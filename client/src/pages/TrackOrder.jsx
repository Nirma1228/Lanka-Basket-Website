import React, { useState, useEffect } from 'react'
import { FaSearch, FaBoxOpen, FaTruck, FaCheckCircle, FaClock, FaMapMarkerAlt } from 'react-icons/fa'
import { MdVerified, MdAccessTime, MdLocationOn } from 'react-icons/md'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import LoadingSpinner from '../components/LoadingSpinner'

const TrackOrder = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchOrderId, setSearchOrderId] = useState('')
  const [filteredOrders, setFilteredOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (searchOrderId) {
      const filtered = orders.filter(order => 
        order.orderId.toLowerCase().includes(searchOrderId.toLowerCase())
      )
      setFilteredOrders(filtered)
    } else {
      setFilteredOrders(orders)
    }
  }, [searchOrderId, orders])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getOrderItems
      })

      if (response.data.success) {
        // Group orders by orderId (similar to admin logic)
        const allOrders = response.data.data
        const groupedOrders = []
        const processedOrders = new Set()

        for (const order of allOrders) {
          if (processedOrders.has(order._id)) continue

          // Find all orders with the same orderId pattern or timestamp proximity
          const orderTime = new Date(order.createdAt)
          const relatedOrders = allOrders.filter(o => {
            if (processedOrders.has(o._id)) return false
            const oTime = new Date(o.createdAt)
            const timeDiff = Math.abs(orderTime - oTime) / (1000 * 60) // minutes
            return timeDiff <= 5 // Group orders within 5 minutes
          })

          // Create grouped order
          const groupedOrder = {
            _id: order._id,
            orderId: order.orderId,
            createdAt: order.createdAt,
            payment_status: order.payment_status,
            packing_status: order.packing_status || 'pending',
            packing_completed_at: order.packing_completed_at,
            delivery_address: order.delivery_address,
            items: relatedOrders.map(o => ({
              _id: o._id,
              product_details: o.product_details,
              totalAmt: o.totalAmt
            })),
            totalItems: relatedOrders.length,
            orderValue: relatedOrders.reduce((sum, o) => sum + o.totalAmt, 0)
          }

          groupedOrders.push(groupedOrder)
          relatedOrders.forEach(o => processedOrders.add(o._id))
        }

        setOrders(groupedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const getPackingStatusInfo = (status, packedAt) => {
    const statuses = {
      pending: {
        icon: <FaClock className='text-orange-500' />,
        label: 'Preparing Order',
        description: 'Your order is being prepared for packing',
        color: 'bg-orange-50 border-orange-200 text-orange-800',
        step: 1
      },
      packed: {
        icon: <FaBoxOpen className='text-green-500' />,
        label: 'Packed & Ready',
        description: 'Your order has been packed and is ready for delivery',
        color: 'bg-green-50 border-green-200 text-green-800',
        step: 2
      },
      shipped: {
        icon: <FaTruck className='text-blue-500' />,
        label: 'Out for Delivery',
        description: 'Your order is on its way to you',
        color: 'bg-blue-50 border-blue-200 text-blue-800',
        step: 3
      },
      delivered: {
        icon: <FaCheckCircle className='text-purple-500' />,
        label: 'Delivered',
        description: 'Your order has been successfully delivered',
        color: 'bg-purple-50 border-purple-200 text-purple-800',
        step: 4
      }
    }
    return statuses[status] || statuses.pending
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

  const OrderTimeline = ({ order }) => {
    const currentStatus = getPackingStatusInfo(order.packing_status, order.packing_completed_at)
    const steps = [
      { key: 'pending', step: 1, label: 'Order Placed', completed: true },
      { key: 'packed', step: 2, label: 'Packed', completed: currentStatus.step >= 2 },
      { key: 'shipped', step: 3, label: 'Shipped', completed: currentStatus.step >= 3 },
      { key: 'delivered', step: 4, label: 'Delivered', completed: currentStatus.step >= 4 }
    ]

    return (
      <div className='flex items-center justify-between w-full'>
        {steps.map((step, index) => (
          <div key={step.key} className='flex flex-col items-center relative'>
            {index > 0 && (
              <div className={`absolute top-6 right-full w-full h-0.5 -z-10 ${
                step.completed ? 'bg-green-500' : 'bg-gray-200'
              }`} style={{ width: 'calc(100% + 2rem)' }} />
            )}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
              step.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {step.completed ? (
                <FaCheckCircle className='text-lg' />
              ) : (
                <div className='w-3 h-3 rounded-full bg-gray-300' />
              )}
            </div>
            <p className={`text-xs mt-2 font-medium ${
              step.completed ? 'text-green-600' : 'text-gray-400'
            }`}>
              {step.label}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-lg border-b border-gray-200'>
        <div className='container mx-auto px-4 py-6'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Track Your Orders</h1>
            <p className='text-gray-600'>Stay updated on your order status and delivery progress</p>
          </div>
          
          {/* Search Bar */}
          <div className='max-w-md mx-auto mt-6'>
            <div className='relative'>
              <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className='container mx-auto px-4 py-8'>
        {loading ? (
          <div className='text-center py-12'>
            <LoadingSpinner size="xl" />
            <p className='mt-4 text-gray-600'>Loading your orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className='space-y-6'>
            {filteredOrders.map((order) => {
              const statusInfo = getPackingStatusInfo(order.packing_status, order.packing_completed_at)
              
              return (
                <div key={order._id} className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
                  {/* Order Header */}
                  <div className='bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                      <div>
                        <h3 className='text-lg font-bold text-gray-900'>Order #{order.orderId}</h3>
                        <div className='flex items-center gap-4 text-sm text-gray-600 mt-1'>
                          <span className='flex items-center gap-1'>
                            <MdAccessTime />
                            Placed: {formatDate(order.createdAt)}
                          </span>
                          <span>{order.totalItems} items</span>
                          <span className='font-semibold text-gray-900'>
                            {DisplayPriceInRupees(order.orderValue)}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </div>
                    </div>
                  </div>

                  {/* Order Progress Timeline */}
                  <div className='px-6 py-8'>
                    <OrderTimeline order={order} />
                  </div>

                  {/* Status Details */}
                  <div className='px-6 pb-6'>
                    <div className={`rounded-lg p-4 border ${statusInfo.color}`}>
                      <div className='flex items-start gap-3'>
                        <div className='text-2xl'>{statusInfo.icon}</div>
                        <div>
                          <h4 className='font-semibold mb-1'>{statusInfo.label}</h4>
                          <p className='text-sm opacity-80'>{statusInfo.description}</p>
                          {order.packing_completed_at && order.packing_status === 'packed' && (
                            <p className='text-xs mt-2 opacity-70'>
                              Packed on: {formatDate(order.packing_completed_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className='px-6 pb-6'>
                    <h4 className='font-semibold text-gray-900 mb-3'>Order Items ({order.totalItems})</h4>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className='flex items-center gap-3 bg-gray-50 rounded-lg p-3'>
                          {item.product_details?.image?.[0] && (
                            <img
                              src={item.product_details.image[0]}
                              alt={item.product_details.name}
                              className='w-12 h-12 rounded-lg object-cover'
                            />
                          )}
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium text-sm text-gray-900 truncate'>
                              {item.product_details?.name}
                            </p>
                            <p className='text-xs text-gray-600'>
                              {DisplayPriceInRupees(item.totalAmt)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className='flex items-center justify-center bg-gray-100 rounded-lg p-3 text-gray-600'>
                          <span className='text-sm font-medium'>
                            +{order.items.length - 3} more items
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.delivery_address && (
                    <div className='px-6 pb-6'>
                      <h4 className='font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                        <MdLocationOn className='text-green-600' />
                        Delivery Address
                      </h4>
                      <div className='bg-gray-50 rounded-lg p-3 text-sm text-gray-700'>
                        <p>{order.delivery_address.address_line}</p>
                        <p>{order.delivery_address.city}, {order.delivery_address.state}</p>
                        <p>{order.delivery_address.country} - {order.delivery_address.pincode}</p>
                        {order.delivery_address.mobile && (
                          <p>Mobile: {order.delivery_address.mobile}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <FaBoxOpen className='text-3xl text-gray-400' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              {searchOrderId ? 'No Orders Found' : 'No Orders Yet'}
            </h3>
            <p className='text-gray-600'>
              {searchOrderId 
                ? 'No orders match your search criteria.' 
                : 'You haven\'t placed any orders yet. Start shopping to see your orders here!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrder
