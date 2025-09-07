import React, { useState, useEffect } from 'react'
import { FaBoxOpen, FaSearch, FaExclamationTriangle, FaPlus, FaMinus, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'
import { HiOutlineViewGrid, HiOutlineRefresh } from 'react-icons/hi'
import { MdInventory, MdWarning, MdCheckCircle } from 'react-icons/md'
import { IoAlertCircle } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Loading from '../components/Loading'

const StockManagement = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all, low-stock, out-of-stock
  const [editingStock, setEditingStock] = useState(null)
  const [newStockValue, setNewStockValue] = useState('')
  const [stockUpdateLoading, setStockUpdateLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams] = useSearchParams()

  // Low stock threshold
  const LOW_STOCK_THRESHOLD = 10

  useEffect(() => {
    // Get filter from URL parameters
    const urlFilter = searchParams.get('filter')
    if (urlFilter && ['all', 'low-stock', 'out-of-stock'].includes(urlFilter)) {
      setFilter(urlFilter)
    }
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [page])

  useEffect(() => {
    applyFilters()
  }, [products, search, filter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 50 // Get more products for stock management
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        setProducts(responseData.data)
        setTotalPages(responseData.totalNoPage || 1)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.some(cat => cat.name.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Apply stock filter
    switch (filter) {
      case 'low-stock':
        filtered = filtered.filter(product => 
          product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD
        )
        break
      case 'out-of-stock':
        filtered = filtered.filter(product => product.stock === 0)
        break
      default:
        // 'all' - no additional filtering
        break
    }

    // Sort by stock level (lowest first)
    filtered.sort((a, b) => a.stock - b.stock)

    setFilteredProducts(filtered)
  }

  const updateStock = async (productId, newStock) => {
    try {
      setStockUpdateLoading(true)
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: {
          _id: productId,
          stock: parseInt(newStock)
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        toast.success('Stock updated successfully')
        
        // Update local state
        setProducts(prev => 
          prev.map(product => 
            product._id === productId 
              ? { ...product, stock: parseInt(newStock) }
              : product
          )
        )
        
        setEditingStock(null)
        setNewStockValue('')
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setStockUpdateLoading(false)
    }
  }

  const handleStockEdit = (product) => {
    setEditingStock(product._id)
    setNewStockValue(product.stock.toString())
  }

  const handleStockUpdate = (productId) => {
    if (newStockValue === '' || isNaN(newStockValue) || parseInt(newStockValue) < 0) {
      toast.error('Please enter a valid stock quantity')
      return
    }
    updateStock(productId, newStockValue)
  }

  const cancelEdit = () => {
    setEditingStock(null)
    setNewStockValue('')
  }

  const quickUpdateStock = (product, change) => {
    const newStock = Math.max(0, product.stock + change)
    updateStock(product._id, newStock)
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'out-of-stock', color: 'text-red-600', bg: 'bg-red-50', icon: <IoAlertCircle /> }
    if (stock <= LOW_STOCK_THRESHOLD) return { status: 'low-stock', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: <FaExclamationTriangle /> }
    return { status: 'in-stock', color: 'text-green-600', bg: 'bg-green-50', icon: <MdCheckCircle /> }
  }

  const stockStats = {
    total: products.length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length,
    inStock: products.filter(p => p.stock > LOW_STOCK_THRESHOLD).length
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-lg border-b border-gray-200'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md'>
                <MdInventory className='text-white text-lg' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Stock Management</h1>
                <p className='text-sm text-gray-600'>
                  Monitor and manage product inventory levels
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchProducts()}
              className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium'
            >
              <HiOutlineRefresh className='text-lg' />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
          <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Total Products</p>
                <p className='text-2xl font-bold text-gray-900'>{stockStats.total}</p>
              </div>
              <div className='w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center'>
                <FaBoxOpen className='text-blue-600 text-xl' />
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>In Stock</p>
                <p className='text-2xl font-bold text-green-600'>{stockStats.inStock}</p>
              </div>
              <div className='w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center'>
                <MdCheckCircle className='text-green-600 text-xl' />
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Low Stock</p>
                <p className='text-2xl font-bold text-yellow-600'>{stockStats.lowStock}</p>
              </div>
              <div className='w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center'>
                <FaExclamationTriangle className='text-yellow-600 text-xl' />
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Out of Stock</p>
                <p className='text-2xl font-bold text-red-600'>{stockStats.outOfStock}</p>
              </div>
              <div className='w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center'>
                <IoAlertCircle className='text-red-600 text-xl' />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1'>
              <div className='relative'>
                <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search products...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
                />
              </div>
            </div>

            {/* Stock Filter */}
            <div className='flex gap-2'>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setFilter('low-stock')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'low-stock' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Low Stock
              </button>
              <button
                onClick={() => setFilter('out-of-stock')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'out-of-stock' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Out of Stock
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
          {loading ? (
            <div className='p-12 text-center'>
              <Loading />
              <p className='text-gray-600 mt-4'>Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Product
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Category
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Price
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Stock
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock)
                    const isEditing = editingStock === product._id

                    return (
                      <tr key={product._id} className='hover:bg-gray-50 transition-colors'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center gap-3'>
                            <img
                              src={product.image[0] || '/api/placeholder/50/50'}
                              alt={product.name}
                              className='w-12 h-12 rounded-lg object-cover border border-gray-200'
                            />
                            <div>
                              <p className='font-medium text-gray-900 truncate max-w-xs'>
                                {product.name}
                              </p>
                              <p className='text-sm text-gray-500'>{product.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex flex-wrap gap-1'>
                            {product.category.slice(0, 2).map((cat, index) => (
                              <span
                                key={index}
                                className='px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'
                              >
                                {cat.name}
                              </span>
                            ))}
                            {product.category.length > 2 && (
                              <span className='px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full'>
                                +{product.category.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div>
                            <p className='font-medium text-gray-900'>
                              {DisplayPriceInRupees(product.price)}
                            </p>
                            {product.discount > 0 && (
                              <p className='text-xs text-green-600'>
                                {product.discount}% off
                              </p>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {isEditing ? (
                            <div className='flex items-center gap-2'>
                              <input
                                type='number'
                                value={newStockValue}
                                onChange={(e) => setNewStockValue(e.target.value)}
                                className='w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-center'
                                min='0'
                                autoFocus
                              />
                              <button
                                onClick={() => handleStockUpdate(product._id)}
                                disabled={stockUpdateLoading}
                                className='p-1 text-green-600 hover:bg-green-50 rounded transition-colors'
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className='p-1 text-red-600 hover:bg-red-50 rounded transition-colors'
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <div className='flex items-center gap-2'>
                              <span className='font-bold text-lg text-gray-900'>
                                {product.stock}
                              </span>
                              <button
                                onClick={() => handleStockEdit(product)}
                                className='p-1 text-gray-400 hover:text-gray-600 transition-colors'
                              >
                                <FaEdit className='text-sm' />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                            {stockStatus.icon}
                            <span className='capitalize'>
                              {stockStatus.status.replace('-', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {!isEditing && (
                            <div className='flex items-center gap-2'>
                              <button
                                onClick={() => quickUpdateStock(product, -1)}
                                disabled={product.stock === 0 || stockUpdateLoading}
                                className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                title='Decrease stock by 1'
                              >
                                <FaMinus />
                              </button>
                              <button
                                onClick={() => quickUpdateStock(product, 1)}
                                disabled={stockUpdateLoading}
                                className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                                title='Increase stock by 1'
                              >
                                <FaPlus />
                              </button>
                              <button
                                onClick={() => quickUpdateStock(product, 10)}
                                disabled={stockUpdateLoading}
                                className='px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200'
                                title='Add 10 units'
                              >
                                +10
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='p-12 text-center'>
              <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <HiOutlineViewGrid className='text-3xl text-gray-400' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                {search || filter !== 'all' ? 'No Products Found' : 'No Products Available'}
              </h3>
              <p className='text-gray-600'>
                {search || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by adding products to manage their stock levels.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        {stockStats.lowStock > 0 || stockStats.outOfStock > 0 ? (
          <div className='mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4'>
            <div className='flex items-start gap-3'>
              <MdWarning className='text-yellow-600 text-xl mt-0.5 flex-shrink-0' />
              <div>
                <h4 className='font-semibold text-yellow-800 mb-1'>Stock Alert</h4>
                <p className='text-yellow-700 text-sm'>
                  {stockStats.outOfStock > 0 && (
                    <span>{stockStats.outOfStock} products are out of stock. </span>
                  )}
                  {stockStats.lowStock > 0 && (
                    <span>{stockStats.lowStock} products have low stock levels. </span>
                  )}
                  Consider restocking these items to avoid lost sales.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default StockManagement
