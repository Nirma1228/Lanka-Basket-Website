import React, { useState, useEffect } from 'react'
import { FaShoppingCart, FaCalendarAlt, FaFilter, FaSearch, FaTruck, FaCreditCard, FaMoneyBillWave, FaEye, FaChevronLeft, FaChevronRight, FaClipboardList, FaBoxOpen, FaCheck, FaCheckCircle } from 'react-icons/fa'
import { HiOutlineShoppingBag, HiOutlineCalendar, HiOutlineCurrencyRupee } from 'react-icons/hi'
import { MdAccessTime, MdLocationOn, MdPhone, MdEmail, MdShoppingCart, MdVerified } from 'react-icons/md'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    date: 'today',
    status: 'all',
    search: ''
  })
  const [pagination, setPagination] = useState({})
  const [summary, setSummary] = useState({})
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showPackingDetails, setShowPackingDetails] = useState(false)
  const [packingLoading, setPackingLoading] = useState(false)

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'CASH ON DELIVERY', label: 'Cash on Delivery' },
    { value: 'paid', label: 'Paid Online' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' }
  ]

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getAllOrders,
        data: filters
      })

      const { data: responseData } = response
      if (responseData.success) {
        setOrders(responseData.data.orders)
        setPagination(responseData.data.pagination)
        setSummary(responseData.data.summary)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when changing filters
    }))
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'cash on delivery':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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

  const handlePackingConfirmation = async (orderId, status = 'packed') => {
    try {
      setPackingLoading(true)
      
      const response = await Axios({
        ...SummaryApi.updatePackingStatus,
        data: {
          orderId: orderId,
          status: status
        }
      })

      if (response.data.success) {
        toast.success(`Order packing ${status === 'packed' ? 'completed successfully!' : 'status updated!'}`)
        
        // Update the selected order in state
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder(prev => ({
            ...prev,
            packing_status: status,
            packing_completed_at: status === 'packed' ? new Date() : prev.packing_completed_at
          }))
        }
        
        // Refresh the orders list
        fetchOrders()
      }
    } catch (error) {
      console.error('Packing update error:', error)
      AxiosToastError(error)
    } finally {
      setPackingLoading(false)
    }
  }

  const getPackingStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'packed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'delivered':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200'
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-lg border-b border-gray-200'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md'>
                <FaShoppingCart className='text-white text-lg' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Orders Management</h1>
                <p className='text-sm text-gray-600'>
                  Track and manage all customer orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200 glass-effect'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                <HiOutlineShoppingBag className='text-2xl text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Today's Orders</p>
                <p className='text-2xl font-bold text-gray-900'>{summary.todayOrders || 0}</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200 glass-effect'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                <HiOutlineCurrencyRupee className='text-2xl text-green-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Today's Revenue</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {DisplayPriceInRupees(summary.todayRevenue || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200 glass-effect'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                <HiOutlineCurrencyRupee className='text-2xl text-purple-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Revenue</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {DisplayPriceInRupees(summary.totalRevenue || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 glass-effect'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            {/* Search */}
            <div className='relative'>
              <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm' />
              <input
                type="text"
                placeholder="Search orders, products..."
                value={filters.search}
                onChange={handleSearch}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Date Filter */}
            <div className='relative'>
              <FaCalendarAlt className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm' />
              <select
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none'
              >
                {dateOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className='relative'>
              <FaFilter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm' />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none'
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Results per page */}
            <div>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className='w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden glass-effect'>
          {loading ? (
            <div className='p-12 text-center'>
              <LoadingSpinner size="xl" />
              <p className='mt-4 text-gray-600 font-medium'>Loading orders...</p>
            </div>
          ) : orders.length > 0 ? (
            <>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Order Info</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Customer</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Items</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Order Value</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Payment Status</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Packing Status</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {orders.map((order) => (
                      <tr key={order._id} className='hover:bg-gray-50 transition-colors duration-200'>
                        {/* Order Info */}
                        <td className='px-6 py-4'>
                          <div>
                            <p className='font-semibold text-gray-900 text-sm'>
                              #{order.orderId}
                            </p>
                            <p className='text-xs text-gray-500 flex items-center gap-1 mt-1'>
                              <MdAccessTime className='text-xs' />
                              {formatDate(order.createdAt)}
                            </p>
                            <p className='text-xs text-blue-600 flex items-center gap-1 mt-1'>
                              <MdShoppingCart className='text-xs' />
                              {order.totalItems} item{order.totalItems !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </td>
                        
                        {/* Customer Info */}
                        <td className='px-6 py-4'>
                          <div>
                            <p className='font-medium text-gray-900 text-sm'>
                              {order.userId?.name || 'Unknown'}
                            </p>
                            <p className='text-xs text-gray-500 flex items-center gap-1'>
                              <MdEmail className='text-xs' />
                              {order.userId?.email || 'N/A'}
                            </p>
                            {order.userId?.mobile && (
                              <p className='text-xs text-gray-500 flex items-center gap-1 mt-1'>
                                <MdPhone className='text-xs' />
                                {order.userId.mobile}
                              </p>
                            )}
                          </div>
                        </td>
                        
                        {/* Items Preview */}
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-2'>
                            <div className='flex -space-x-2'>
                              {order.items.slice(0, 3).map((item, index) => (
                                item.product_details?.image?.[0] && (
                                  <img
                                    key={index}
                                    src={item.product_details.image[0]}
                                    alt={item.product_details.name}
                                    className='w-8 h-8 rounded-full object-cover border-2 border-white'
                                  />
                                )
                              ))}
                              {order.items.length > 3 && (
                                <div className='w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center'>
                                  <span className='text-xs font-medium text-gray-600'>
                                    +{order.items.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className='text-xs text-gray-500'>
                                {order.items[0]?.product_details?.name}
                                {order.items.length > 1 && ` +${order.items.length - 1} more`}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        {/* Order Value */}
                        <td className='px-6 py-4'>
                          <div>
                            <p className='font-semibold text-gray-900 text-sm'>
                              {DisplayPriceInRupees(order.orderValue)}
                            </p>
                            {order.subTotalValue !== order.orderValue && (
                              <p className='text-xs text-gray-500 line-through'>
                                {DisplayPriceInRupees(order.subTotalValue)}
                              </p>
                            )}
                          </div>
                        </td>
                        
                        {/* Payment Status */}
                        <td className='px-6 py-4'>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.payment_status)}`}>
                            {order.payment_status === 'CASH ON DELIVERY' ? (
                              <FaMoneyBillWave className='text-xs' />
                            ) : order.payment_status === 'paid' ? (
                              <FaCreditCard className='text-xs' />
                            ) : (
                              <FaTruck className='text-xs' />
                            )}
                            {order.payment_status}
                          </span>
                        </td>
                        
                        {/* Packing Status */}
                        <td className='px-6 py-4'>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPackingStatusColor(order.packing_status)}`}>
                            {order.packing_status === 'packed' ? (
                              <FaCheckCircle className='text-xs' />
                            ) : order.packing_status === 'shipped' ? (
                              <FaTruck className='text-xs' />
                            ) : order.packing_status === 'delivered' ? (
                              <MdVerified className='text-xs' />
                            ) : (
                              <FaBoxOpen className='text-xs' />
                            )}
                            {order.packing_status || 'pending'}
                          </span>
                          {order.packing_completed_at && (
                            <p className='text-xs text-gray-500 mt-1'>
                              {formatDate(order.packing_completed_at)}
                            </p>
                          )}
                        </td>
                        
                        {/* Actions */}
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowPackingDetails(true)
                              }}
                              className='inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md'
                            >
                              <FaBoxOpen className='text-xs' />
                              Proceed
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowPackingDetails(false)
                              }}
                              className='inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200'
                            >
                              <FaEye className='text-xs' />
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className='border-t border-gray-200 px-6 py-4'>
                  <div className='flex items-center justify-between'>
                    <div className='text-sm text-gray-600'>
                      Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                      {Math.min(pagination.currentPage * filters.limit, pagination.totalOrders)} of{' '}
                      {pagination.totalOrders} orders
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          !pagination.hasPrevPage
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 :bg-blue-900/50 border border-blue-200 '
                        }`}
                      >
                        <FaChevronLeft className='text-sm' />
                        Previous
                      </button>
                      
                      <span className='text-sm text-gray-600'>
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          !pagination.hasNextPage
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 :bg-blue-900/50 border border-blue-200 '
                        }`}
                      >
                        Next
                        <FaChevronRight className='text-sm' />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='p-12 text-center'>
              <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaShoppingCart className='text-3xl text-gray-400' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                No Orders Found
              </h3>
              <p className='text-gray-600'>
                {filters.search || filters.status !== 'all' || filters.date !== 'all'
                  ? 'No orders match your current filters. Try adjusting your search criteria.'
                  : 'No orders have been placed yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details & Packing Modal */}
      {selectedOrder && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto glass-effect-strong'>
            <div className='p-6 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${showPackingDetails ? 'bg-green-100 ' : 'bg-blue-100 '}`}>
                    {showPackingDetails ? (
                      <FaClipboardList className={`text-2xl text-green-600 `} />
                    ) : (
                      <FaEye className={`text-2xl text-blue-600 `} />
                    )}
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900'>
                      {showPackingDetails ? 'Packing Details' : 'Order Details'} - #{selectedOrder.orderId}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {showPackingDetails 
                        ? 'Items to pack for delivery' 
                        : 'Complete order information'
                      }
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  {/* Toggle buttons */}
                  <button
                    onClick={() => setShowPackingDetails(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      !showPackingDetails 
                        ? 'bg-blue-100 text-blue-700 '
                        : 'text-gray-500 hover:bg-gray-100 :bg-gray-700'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setShowPackingDetails(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      showPackingDetails 
                        ? 'bg-green-100 text-green-700 '
                        : 'text-gray-500 hover:bg-gray-100 :bg-gray-700'
                    }`}
                  >
                    Packing
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setShowPackingDetails(false);
                    }}
                    className='p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2'
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
            
            <div className='p-6 space-y-6'>
              {showPackingDetails ? (
                /* Packing Details View */
                <>
                  {/* Order Summary Header */}
                  <div className='bg-green-50 rounded-lg p-4 border border-green-200'>
                    <div className='flex items-center justify-between mb-4'>
                      <div>
                        <h4 className='font-bold text-green-800 text-lg'>Order #{selectedOrder.orderId}</h4>
                        <p className='text-sm text-green-600'>
                          Customer: {selectedOrder.userId?.name || 'Unknown'} | 
                          Items: {selectedOrder.totalItems} | 
                          Value: {DisplayPriceInRupees(selectedOrder.orderValue)}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm text-green-600'>Order Time</p>
                        <p className='font-medium text-green-800'>{formatDate(selectedOrder.createdAt)}</p>
                        
                        {/* Packing Status Display */}
                        <div className='mt-2'>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPackingStatusColor(selectedOrder.packing_status)}`}>
                            {selectedOrder.packing_status === 'packed' ? (
                              <FaCheckCircle className='text-xs' />
                            ) : (
                              <FaBoxOpen className='text-xs' />
                            )}
                            {selectedOrder.packing_status || 'pending'}
                          </span>
                          {selectedOrder.packing_completed_at && (
                            <p className='text-xs text-gray-500 mt-1'>
                              Packed: {formatDate(selectedOrder.packing_completed_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items to Pack */}
                  <div>
                    <h4 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                      <FaBoxOpen className='text-green-600' />
                      Items to Pack ({selectedOrder.totalItems} items)
                    </h4>
                    
                    <div className='space-y-4'>
                      {selectedOrder.items.map((item, index) => (
                        <div key={item._id} className='bg-gray-50 rounded-lg p-4 flex items-center gap-4 border border-gray-200'>
                          <div className='bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-green-600 border-2 border-green-200'>
                            {index + 1}
                          </div>
                          
                          {item.product_details?.image?.[0] && (
                            <img
                              src={item.product_details.image[0]}
                              alt={item.product_details.name}
                              className='w-16 h-16 rounded-lg object-cover border border-gray-200'
                            />
                          )}
                          
                          <div className='flex-1'>
                            <h5 className='font-medium text-gray-900 mb-1'>
                              {item.product_details?.name || 'Product Deleted'}
                            </h5>
                            <div className='flex items-center gap-4 text-sm text-gray-600'>
                              <span>Quantity: <strong>1</strong></span>
                              <span>Price: <strong>{DisplayPriceInRupees(item.totalAmt)}</strong></span>
                              {item.productId?.stock !== undefined && (
                                <span>Available Stock: <strong>{item.productId.stock}</strong></span>
                              )}
                            </div>
                          </div>
                          
                          <div className='text-right'>
                            <div className='bg-green-100 px-3 py-2 rounded-lg'>
                              <p className='text-sm font-medium text-green-800'>
                                Pack 1 unit
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Information */}
                  {selectedOrder.delivery_address && (
                    <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                      <h5 className='font-semibold text-blue-800 mb-3 flex items-center gap-2'>
                        <MdLocationOn />
                        Delivery Address
                      </h5>
                      <div className='text-sm text-blue-700 space-y-1'>
                        <p><strong>{selectedOrder.userId?.name || 'Unknown Customer'}</strong></p>
                        <p>{selectedOrder.delivery_address.address_line}</p>
                        <p>{selectedOrder.delivery_address.city}, {selectedOrder.delivery_address.state}</p>
                        <p>{selectedOrder.delivery_address.country} - {selectedOrder.delivery_address.pincode}</p>
                        {selectedOrder.delivery_address.mobile && (
                          <p className='flex items-center gap-1'>
                            <MdPhone />
                            {selectedOrder.delivery_address.mobile}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Packing Summary */}
                  <div className='border-t border-gray-200 pt-4'>
                    <div className='bg-gray-50 rounded-lg p-4'>
                      <h5 className='font-semibold text-gray-900 mb-3'>Packing Summary</h5>
                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <p className='text-gray-600'>Total Items:</p>
                          <p className='font-medium text-gray-900'>{selectedOrder.totalItems} items</p>
                        </div>
                        <div>
                          <p className='text-gray-600'>Order Value:</p>
                          <p className='font-medium text-gray-900'>{DisplayPriceInRupees(selectedOrder.orderValue)}</p>
                        </div>
                        <div>
                          <p className='text-gray-600'>Payment Method:</p>
                          <p className='font-medium text-gray-900'>{selectedOrder.payment_status}</p>
                        </div>
                        <div>
                          <p className='text-gray-600'>Customer:</p>
                          <p className='font-medium text-gray-900'>{selectedOrder.userId?.name || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Packing Confirmation Actions */}
                  <div className='border-t border-gray-200 pt-6'>
                    <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h5 className='font-bold text-gray-900 mb-2 flex items-center gap-2'>
                            <FaBoxOpen className='text-green-600' />
                            Packing Confirmation
                          </h5>
                          <p className='text-sm text-gray-600 mb-3'>
                            Confirm that all items have been packed and are ready for delivery
                          </p>
                          
                          {selectedOrder.packing_status === 'packed' && (
                            <div className='flex items-center gap-2 text-green-700 text-sm mb-2'>
                              <FaCheckCircle />
                              <span>Order packed successfully on {formatDate(selectedOrder.packing_completed_at)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className='flex flex-col sm:flex-row gap-3'>
                          {selectedOrder.packing_status !== 'packed' ? (
                            <button
                              onClick={() => handlePackingConfirmation(selectedOrder.orderId, 'packed')}
                              disabled={packingLoading}
                              className='group relative bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-700 hover:via-green-800 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                              {packingLoading ? (
                                <>
                                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                  <span>Confirming...</span>
                                </>
                              ) : (
                                <>
                                  <FaCheck className='group-hover:scale-110 transition-transform' />
                                  <span>Confirm Packing</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <div className='flex flex-col gap-2'>
                              <button
                                onClick={() => handlePackingConfirmation(selectedOrder.orderId, 'shipped')}
                                disabled={packingLoading}
                                className='group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50'
                              >
                                <FaTruck className='group-hover:scale-110 transition-transform' />
                                <span>Mark as Shipped</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Original Order Details View */
                <>
                  {/* Customer Info */}
                  <div>
                    <h4 className='font-semibold text-gray-900 mb-3'>Customer Information</h4>
                    <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                      <p className='text-sm'><span className='font-medium'>Name:</span> {selectedOrder.userId?.name || 'Unknown'}</p>
                      <p className='text-sm'><span className='font-medium'>Email:</span> {selectedOrder.userId?.email || 'N/A'}</p>
                      {selectedOrder.userId?.mobile && (
                        <p className='text-sm'><span className='font-medium'>Phone:</span> {selectedOrder.userId.mobile}</p>
                      )}
                    </div>
                  </div>

                  {/* All Items in Order */}
                  <div>
                    <h4 className='font-semibold text-gray-900 mb-3'>
                      Order Items ({selectedOrder.totalItems} items)
                    </h4>
                    <div className='space-y-3'>
                      {selectedOrder.items.map((item, index) => (
                        <div key={item._id} className='bg-gray-50 rounded-lg p-4 flex items-center gap-4'>
                          {item.product_details?.image?.[0] && (
                            <img
                              src={item.product_details.image[0]}
                              alt={item.product_details.name}
                              className='w-12 h-12 rounded-lg object-cover border border-gray-200'
                            />
                          )}
                          <div className='flex-1'>
                            <p className='font-medium text-gray-900'>
                              {item.product_details?.name || 'Product Deleted'}
                            </p>
                            <div className='flex items-center gap-4 text-sm text-gray-600 mt-1'>
                              <span>Qty: 1</span>
                              <span>Price: {DisplayPriceInRupees(item.totalAmt)}</span>
                              {item.productId?.stock !== undefined && (
                                <span>Stock: {item.productId.stock}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className='font-semibold text-gray-900 mb-3'>Order Summary</h4>
                    <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span>Total Items:</span>
                        <span>{selectedOrder.totalItems}</span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span>Subtotal:</span>
                        <span>{DisplayPriceInRupees(selectedOrder.subTotalValue)}</span>
                      </div>
                      <div className='flex justify-between text-sm font-medium pt-2 border-t border-gray-200'>
                        <span>Total:</span>
                        <span>{DisplayPriceInRupees(selectedOrder.orderValue)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Delivery */}
                  <div>
                    <h4 className='font-semibold text-gray-900 mb-3'>Payment & Delivery</h4>
                    <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                      <p className='text-sm'><span className='font-medium'>Payment Method:</span> {selectedOrder.payment_status}</p>
                      {selectedOrder.paymentId && (
                        <p className='text-sm'><span className='font-medium'>Payment ID:</span> {selectedOrder.paymentId}</p>
                      )}
                      <p className='text-sm'><span className='font-medium'>Order Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                      {selectedOrder.delivery_address && (
                        <div className='mt-3'>
                          <p className='font-medium text-sm mb-2'>Delivery Address:</p>
                          <div className='text-sm text-gray-600 space-y-1'>
                            <p>{selectedOrder.delivery_address.address_line}</p>
                            <p>{selectedOrder.delivery_address.city}, {selectedOrder.delivery_address.state}</p>
                            <p>{selectedOrder.delivery_address.country} - {selectedOrder.delivery_address.pincode}</p>
                            {selectedOrder.delivery_address.mobile && (
                              <p>Mobile: {selectedOrder.delivery_address.mobile}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
