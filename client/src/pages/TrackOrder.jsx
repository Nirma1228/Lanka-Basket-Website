import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const TrackOrder = () => {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)

  useEffect(() => {
    // Check if user is logged in
    if (!user._id) {
      toast.error('Please login to view your orders')
      navigate('/login')
      return
    }

    const params = new URLSearchParams(location.search)
    const orderId = params.get('orderId')
    
    if (orderId) {
      fetchOrderById(orderId)
    } else {
      fetchAllOrders()
    }
  }, [location, user._id])

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getOrderItems
      })
      
      if (response.data.success) {
        setOrders(response.data.data)
      } else {
        toast.error(response.data.message || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderById = async (id) => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getOrderById,
        url: `${SummaryApi.getOrderById.url}/${id}`
      })
      
      if (response.data.success) {
        setSelectedOrder(response.data.data)
      } else {
        toast.error(response.data.message || 'Order not found')
        navigate('/track-order')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      toast.error('Failed to fetch order details')
      navigate('/track-order')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (!orderNumber.trim()) {
      toast.error('Please enter an order number')
      return
    }
    navigate(`/track-order?orderId=${orderNumber}`)
  }

  const handleOrderSelect = (orderId) => {
    navigate(`/track-order?orderId=${orderId}`)
  }

  const handleBackToOrders = () => {
    navigate('/track-order')
    setSelectedOrder(null)
  }

  const handleConfirmDelivery = async () => {
    if (!selectedOrder?.orderId) return
    
    try {
      setIsConfirming(true)
      const response = await Axios({
        ...SummaryApi.confirmOrderDelivery,
        data: { orderId: selectedOrder.orderId }
      })
      
      if (response.data.success) {
        toast.success('Order delivery confirmed successfully!')
        fetchOrderById(selectedOrder._id)
      } else {
        toast.error(response.data.message || 'Failed to confirm delivery')
      }
    } catch (error) {
      console.error('Error confirming delivery:', error)
      toast.error('Failed to confirm delivery')
    } finally {
      setIsConfirming(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50',
      confirmed: 'text-blue-600 bg-blue-50',
      processing: 'text-purple-600 bg-purple-50',
      packing: 'text-orange-600 bg-orange-50',
      shipped: 'text-indigo-600 bg-indigo-50',
      delivered: 'text-green-600 bg-green-50',
      cancelled: 'text-red-600 bg-red-50'
    }
    return colors[status?.toLowerCase()] || 'text-gray-600 bg-gray-50'
  }

  const getProgressWidth = (currentStatus, packingStatus) => {
    // Use packing_status for accurate tracking
    const actualStatus = packingStatus || currentStatus
    const statuses = ['pending', 'packed', 'shipped', 'delivered']
    const currentIndex = statuses.indexOf(actualStatus?.toLowerCase())
    return currentIndex === -1 ? 0 : ((currentIndex + 1) / statuses.length) * 100
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimelineSteps = () => {
    const baseSteps = [
      { 
        status: 'pending', 
        label: 'Order Placed', 
        icon: '📝',
        description: 'Your order has been received and is being processed'
      },
      { 
        status: 'packed', 
        label: 'Order Packed', 
        icon: '📦',
        description: 'Your order has been carefully packed and is ready for shipping'
      },
      { 
        status: 'shipped', 
        label: 'Handed to Courier', 
        icon: '🚚',
        description: 'Your order has been handed over to the delivery partner'
      },
      { 
        status: 'delivered', 
        label: 'Delivered', 
        icon: '🎯',
        description: 'Your order has been successfully delivered'
      }
    ]

    if (!selectedOrder) return baseSteps

    // Use packing_status for accurate tracking
    const actualStatus = selectedOrder.packing_status || 'pending'
    const currentIndex = baseSteps.findIndex(step => 
      step.status.toLowerCase() === actualStatus?.toLowerCase()
    )

    return baseSteps.map((step, index) => {
      let stepDate = null
      let isCompleted = false
      let isActive = false

      if (index === 0) {
        // Order placed is always completed
        isCompleted = true
        stepDate = selectedOrder.createdAt
      } else if (index <= currentIndex) {
        isCompleted = true
        isActive = index === currentIndex
        
        // Get specific dates for each step
        if (step.status === 'packed' && selectedOrder.packing_completed_at) {
          stepDate = selectedOrder.packing_completed_at
        } else if (step.status === 'shipped' && selectedOrder.shipping_details?.shipped_at) {
          stepDate = selectedOrder.shipping_details.shipped_at
        } else if (step.status === 'delivered' && selectedOrder.shipping_details?.delivered_at) {
          stepDate = selectedOrder.shipping_details.delivered_at
        } else if (isActive) {
          stepDate = selectedOrder.updatedAt
        }
      }

      return {
        ...step,
        completed: isCompleted,
        active: isActive,
        date: stepDate
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          {selectedOrder ? (
            <div>
              <button
                onClick={handleBackToOrders}
                className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2 mx-auto transition-colors"
              >
                ← Back to Orders
              </button>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Tracking</h1>
              <p className="text-gray-600 text-lg">
                Real-time tracking for Order #{selectedOrder._id}
              </p>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Orders</h1>
              <p className="text-gray-600 text-lg">
                Click on any order to track its progress in real-time
              </p>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Orders List View */}
        {!selectedOrder && !loading && (
          <div>
            {orders.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(() => {
                  // Group orders by orderId for display
                  const orderGroups = orders.reduce((acc, item) => {
                    if (!acc[item.orderId]) {
                      acc[item.orderId] = {
                        orderId: item.orderId,
                        status: item.packing_status || item.order_status,
                        totalAmount: 0,
                        itemCount: 0,
                        createdAt: item.createdAt,
                        items: []
                      }
                    }
                    acc[item.orderId].totalAmount += item.totalAmt || 0
                    acc[item.orderId].itemCount += 1
                    acc[item.orderId].items.push(item)
                    return acc
                  }, {})

                  // Render unique order groups
                  return Object.values(orderGroups).map((orderGroup) => (
                    <div
                      key={orderGroup.orderId}
                      onClick={() => handleOrderSelect(orderGroup.items[0]._id)}
                      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            Order #{orderGroup.orderId.slice(-8)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(orderGroup.createdAt)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(orderGroup.status)}`}>
                          {orderGroup.status?.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Items:</span>
                          <span className="font-medium">{orderGroup.itemCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold text-green-600">
                            LKR {orderGroup.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {orderGroup.items.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.product_details?.image?.[0]}
                              alt={item.product_details?.name}
                              className="w-8 h-8 rounded-full border-2 border-white object-cover"
                            />
                          ))}
                          {orderGroup.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{orderGroup.items.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Track →
                        </button>
                      </div>
                    </div>
                  ))
                })()}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Found</h2>
                <p className="text-gray-600 mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here!
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        )}

        {/* Detailed Order Tracking View */}
        {selectedOrder && !loading && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Progress</h2>
                <p className="text-gray-600">Real-time tracking of your order status</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-in-out"
                    style={{ width: `${getProgressWidth(selectedOrder.order_status, selectedOrder.packing_status)}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-6">
                {getTimelineSteps().map((step, index) => (
                  <div key={step.status} className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                      step.completed 
                        ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg' 
                        : step.active
                        ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg animate-pulse'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-semibold text-lg ${
                            step.completed || step.active ? 'text-gray-800' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            step.completed || step.active ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                        {step.date && (
                          <div className="text-right">
                            <span className="text-sm text-gray-500 block">
                              {formatDate(step.date)}
                            </span>
                            {step.status === 'packed' && step.completed && (
                              <span className="text-xs text-green-600 block">
                                ✓ Confirmed by Admin
                              </span>
                            )}
                            {step.status === 'shipped' && step.completed && (
                              <span className="text-xs text-blue-600 block">
                                🚚 Handed to {selectedOrder.shipping_details?.courier_name}
                              </span>
                            )}
                            {step.status === 'delivered' && step.completed && selectedOrder.shipping_details?.confirmed_by_customer && (
                              <span className="text-xs text-green-600 block">
                                ✓ Confirmed by Customer
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {step.active && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-blue-700 font-medium text-sm">
                            🔄 Currently in progress
                          </p>
                          {step.status === 'pending' && (
                            <p className="text-blue-600 text-xs mt-1">
                              Our team is processing your order
                            </p>
                          )}
                          {step.status === 'packed' && (
                            <p className="text-blue-600 text-xs mt-1">
                              Admin is confirming the packing
                            </p>
                          )}
                          {step.status === 'shipped' && (
                            <p className="text-blue-600 text-xs mt-1">
                              Order is being handed to courier service
                            </p>
                          )}
                        </div>
                      )}
                      {step.completed && !step.active && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-green-700 font-medium text-sm">
                            ✅ Completed successfully
                          </p>
                        </div>
                      )}
                      {!step.completed && !step.active && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-500 font-medium text-sm">
                            ⏳ Waiting for previous step to complete
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Confirmation Button */}
              {selectedOrder.packing_status?.toLowerCase() === 'delivered' && 
               !selectedOrder.shipping_details?.confirmed_by_customer && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      📦 Order Delivered Successfully!
                    </h3>
                    <p className="text-green-700 mb-4">
                      Your order has been delivered. Please confirm that you have received your order in good condition.
                    </p>
                    <button
                      onClick={handleConfirmDelivery}
                      disabled={isConfirming}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 font-semibold shadow-lg"
                    >
                      {isConfirming ? 'Confirming...' : '✓ Confirm Delivery'}
                    </button>
                  </div>
                </div>
              )}

              {selectedOrder.shipping_details?.confirmed_by_customer && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      ✅ Delivery Confirmed by Customer
                    </h3>
                    <p className="text-green-700">
                      Thank you for confirming the delivery. We hope you enjoy your order!
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      Confirmed on: {formatDate(selectedOrder.shipping_details.delivered_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Order Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {selectedOrder._id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.packing_status || selectedOrder.order_status)}`}>
                      {(selectedOrder.packing_status || selectedOrder.order_status)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg text-green-600">
                      LKR {selectedOrder.totalAmt?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              {selectedOrder.shipping_details && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">🚚 Courier Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 block text-sm">Courier Service:</span>
                      <span className="font-medium text-lg">{selectedOrder.shipping_details.courier_name}</span>
                    </div>
                    {selectedOrder.shipping_details.tracking_number && (
                      <div>
                        <span className="text-gray-600 block text-sm">Tracking Number:</span>
                        <span className="font-mono text-sm bg-blue-50 px-3 py-2 rounded-lg border">
                          {selectedOrder.shipping_details.tracking_number}
                        </span>
                      </div>
                    )}
                    {selectedOrder.shipping_details.handover_date && (
                      <div>
                        <span className="text-gray-600 block text-sm">Handed Over to Courier:</span>
                        <span className="font-medium">{formatDate(selectedOrder.shipping_details.handover_date)}</span>
                      </div>
                    )}
                    {selectedOrder.shipping_details.expected_delivery_date && (
                      <div>
                        <span className="text-gray-600 block text-sm">Expected Delivery:</span>
                        <span className="font-medium text-blue-600">
                          {formatDate(selectedOrder.shipping_details.expected_delivery_date)}
                        </span>
                      </div>
                    )}
                    {selectedOrder.shipping_details.delivered_at && (
                      <div>
                        <span className="text-gray-600 block text-sm">Actual Delivery:</span>
                        <span className="font-medium text-green-600">
                          {formatDate(selectedOrder.shipping_details.delivered_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {selectedOrder.delivery_address && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Delivery Address</h3>
                  <div className="text-gray-700 leading-relaxed">
                    <p className="font-medium">{selectedOrder.delivery_address.address_line}</p>
                    <p>{selectedOrder.delivery_address.city}, {selectedOrder.delivery_address.state}</p>
                    <p>{selectedOrder.delivery_address.pincode}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      📞 {selectedOrder.delivery_address.mobile}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={selectedOrder.product_details?.image?.[0]} 
                      alt={selectedOrder.product_details?.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{selectedOrder.product_details?.name}</h4>
                      <p className="text-xs text-gray-500">Qty: 1</p>
                    </div>
                    <span className="font-medium text-green-600">
                      LKR {selectedOrder.totalAmt?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrder
