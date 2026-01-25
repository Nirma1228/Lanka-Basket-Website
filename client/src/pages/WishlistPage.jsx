import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { BsHeart, BsHeartFill, BsCart4, BsTrash, BsSearch, BsFilter, BsGrid, BsList, BsExclamationTriangle } from 'react-icons/bs'
import { FaSort, FaSortAmountDown, FaSortAmountUp, FaShoppingBag, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { MdClear, MdNotifications, MdFilterList } from 'react-icons/md'
import { IoSparkles, IoCheckmarkCircle } from 'react-icons/io5'
import { HiOutlineEmojiSad } from 'react-icons/hi'
import { removeFromWishlist, clearWishlist, markNotificationAsRead } from '../store/wishlistSlice'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { valideURLConvert } from '../utils/valideURLConvert'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'

const WishlistPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { fetchCartItem } = useGlobalContext()
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('newest') // 'newest', 'oldest', 'price-low', 'price-high', 'name'
    const [filterStock, setFilterStock] = useState('all') // 'all', 'in-stock', 'out-of-stock'
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems)
    const stockAlerts = useSelector(state => state.wishlist.stockAlerts)
    const user = useSelector(state => state.user)
    
    // Filter and sort wishlist items
    const filteredAndSortedItems = wishlistItems
        .filter(item => {
            // Filter by search query
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
            
            // Filter by stock status
            const matchesStock = 
                filterStock === 'all' ||
                (filterStock === 'in-stock' && item.isInStock) ||
                (filterStock === 'out-of-stock' && !item.isInStock)
            
            return matchesSearch && matchesStock
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.addedAt) - new Date(a.addedAt)
                case 'oldest':
                    return new Date(a.addedAt) - new Date(b.addedAt)
                case 'price-low':
                    return a.price - b.price
                case 'price-high':
                    return b.price - a.price
                case 'name':
                    return a.name.localeCompare(b.name)
                default:
                    return 0
            }
        })
    
    // Get unread stock alerts
    const unreadAlerts = stockAlerts.filter(alert => !alert.isRead)
    
    const handleRemoveFromWishlist = async (productId, productName) => {
        try {
            setIsLoading(true)
            if (user?._id) {
                await Axios({
                    ...SummaryApi.removeFromWishlist,
                    data: { productId }
                })
            }
            dispatch(removeFromWishlist(productId))
            toast.success(`${productName} removed from wishlist`)
        } catch (error) {
            toast.error('Failed to remove item from wishlist')
        } finally {
            setIsLoading(false)
        }
    }
    
    const handleClearWishlist = async () => {
        try {
            setIsLoading(true)
            if (user?._id) {
                await Axios({
                    ...SummaryApi.clearWishlist
                })
            }
            dispatch(clearWishlist())
            toast.success('Wishlist cleared successfully')
        } catch (error) {
            toast.error('Failed to clear wishlist')
        } finally {
            setIsLoading(false)
        }
    }
    
    const handleAddToCart = async (product) => {
        try {
            if (!product.isInStock) {
                toast.error('Product is out of stock')
                return
            }
            
            setIsLoading(true)
            const response = await Axios({
                ...SummaryApi.addTocart,
                data: { productId: product._id, qty: 1 }
            })
            
            if (response.data.success) {
                toast.success(`${product.name} added to cart`)
                fetchCartItem()
            }
        } catch (error) {
            toast.error('Failed to add item to cart')
        } finally {
            setIsLoading(false)
        }
    }
    
    const handleAddAllToCart = async () => {
        const availableItems = filteredAndSortedItems.filter(item => item.isInStock)
        
        if (availableItems.length === 0) {
            toast.error('No items available to add to cart')
            return
        }
        
        setIsLoading(true)
        let successCount = 0
        
        for (const item of availableItems) {
            try {
                const response = await Axios({
                    ...SummaryApi.addTocart,
                    data: { productId: item._id, qty: 1 }
                })
                if (response.data.success) {
                    successCount++
                }
            } catch (error) {
                console.error(`Failed to add ${item.name} to cart:`, error)
            }
        }
        
        setIsLoading(false)
        if (successCount > 0) {
            toast.success(`${successCount} items added to cart`)
            fetchCartItem() // Refresh cart
        }
        if (successCount < availableItems.length) {
            toast.error(`${availableItems.length - successCount} items failed to add`)
        }
    }
    
    const handleProductClick = (product) => {
        const url = `/product/${valideURLConvert(product.name)}-${product._id}`
        navigate(url)
    }
    
    const handleNotificationClick = (alert) => {
        dispatch(markNotificationAsRead(alert.id))
        if (alert.productId) {
            handleProductClick({ _id: alert.productId, name: alert.productName })
        }
    }
    
    const getStockBadge = (item) => {
        if (!item.isInStock) {
            return (
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                    <FaTimesCircle />
                    Out of Stock
                </span>
            )
        }
        if (item.stock <= 5) {
            return (
                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-medium">
                    <BsExclamationTriangle />
                    Only {item.stock} left
                </span>
            )
        }
        return (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                <FaCheckCircle />
                In Stock
            </span>
        )
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                            <p className="text-gray-600">
                                {wishlistItems.length === 0 
                                    ? "Your wishlist is empty" 
                                    : `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved`
                                }
                            </p>
                        </div>
                        
                        {wishlistItems.length > 0 && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAddAllToCart}
                                    disabled={isLoading || filteredAndSortedItems.filter(item => item.isInStock).length === 0}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <BsCart4 />
                                    Add All to Cart
                                </button>
                                
                                <button
                                    onClick={handleClearWishlist}
                                    disabled={isLoading}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <MdClear />
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Stock Alerts Section */}
            {unreadAlerts.length > 0 && (
                <div className="bg-blue-50 border-b border-blue-200">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-3 mb-3">
                            <MdNotifications className="text-blue-600 text-xl" />
                            <h3 className="font-semibold text-blue-900">Stock Alerts ({unreadAlerts.length})</h3>
                        </div>
                        
                        <div className="space-y-2">
                            {unreadAlerts.slice(0, 3).map((alert) => (
                                <div
                                    key={alert.id}
                                    onClick={() => handleNotificationClick(alert)}
                                    className="bg-white border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-blue-600">
                                            {alert.type === 'back_in_stock' && <FaCheckCircle />}
                                            {alert.type === 'out_of_stock' && <FaTimesCircle />}
                                            {alert.type === 'low_stock' && <BsExclamationTriangle />}
                                            {alert.type === 'price_drop' && <IoSparkles />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900 font-medium">{alert.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(alert.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {unreadAlerts.length > 3 && (
                            <p className="text-sm text-blue-600 mt-2">
                                And {unreadAlerts.length - 3} more notifications...
                            </p>
                        )}
                    </div>
                </div>
            )}
            
            {/* Filters and Controls */}
            {wishlistItems.length > 0 && (
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search wishlist items..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                />
                            </div>
                            
                            {/* Filters and View Controls */}
                            <div className="flex items-center gap-4">
                                {/* Stock Filter */}
                                <select
                                    value={filterStock}
                                    onChange={(e) => setFilterStock(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                >
                                    <option value="all">All Items</option>
                                    <option value="in-stock">In Stock</option>
                                    <option value="out-of-stock">Out of Stock</option>
                                </select>
                                
                                {/* Sort */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                                
                                {/* View Mode */}
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <BsGrid />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <BsList />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Wishlist Content */}
            <div className="container mx-auto px-4 py-8">
                {wishlistItems.length === 0 ? (
                    // Empty State
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BsHeart className="text-4xl text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
                            <p className="text-gray-600 mb-8">
                                Save items you love by clicking the heart icon on any product
                            </p>
                            <Link
                                to="/search"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300"
                            >
                                <FaShoppingBag />
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                ) : filteredAndSortedItems.length === 0 ? (
                    // No Results State
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HiOutlineEmojiSad className="text-4xl text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No items found</h3>
                            <p className="text-gray-600 mb-8">
                                Try adjusting your search or filter criteria
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setFilterStock('all')
                                    setSortBy('newest')
                                }}
                                className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                            >
                                <MdClear />
                                Clear Filters
                            </button>
                        </div>
                    </div>
                ) : (
                    // Wishlist Items
                    <div className={viewMode === 'grid' 
                        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                        : "space-y-4"
                    }>
                        {filteredAndSortedItems.map((item) => (
                            <div
                                key={item._id}
                                className={viewMode === 'grid' 
                                    ? "bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                                    : "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 group"
                                }
                            >
                                {viewMode === 'grid' ? (
                                    // Grid View
                                    <>
                                        <div className="relative aspect-square overflow-hidden">
                                            <img
                                                src={item.image[0]}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                onClick={() => handleProductClick(item)}
                                            />
                                            {!item.isInStock && (
                                                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                                                    <span className="bg-white text-gray-900 px-2 py-1 rounded text-sm font-medium">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => handleRemoveFromWishlist(item._id, item.name)}
                                                disabled={isLoading}
                                                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
                                            >
                                                <BsHeartFill className="text-red-500" />
                                            </button>
                                        </div>
                                        
                                        <div className="p-4">
                                            <h3 
                                                className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 cursor-pointer hover:text-red-600"
                                                onClick={() => handleProductClick(item)}
                                            >
                                                {item.name}
                                            </h3>
                                            
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-red-600 font-bold">
                                                    {DisplayPriceInRupees(item.price)}
                                                </span>
                                                {getStockBadge(item)}
                                            </div>
                                            
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                disabled={!item.isInStock || isLoading}
                                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <BsCart4 />
                                                {item.isInStock ? 'Add to Cart' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    // List View
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-20 h-20 flex-shrink-0">
                                            <img
                                                src={item.image[0]}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                                                onClick={() => handleProductClick(item)}
                                            />
                                            {!item.isInStock && (
                                                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">OUT</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 
                                                className="font-medium text-gray-900 mb-1 truncate cursor-pointer hover:text-red-600"
                                                onClick={() => handleProductClick(item)}
                                            >
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-red-600 font-bold">
                                                    {DisplayPriceInRupees(item.price)}
                                                </span>
                                                {getStockBadge(item)}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Added {new Date(item.addedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                disabled={!item.isInStock || isLoading}
                                                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={item.isInStock ? 'Add to Cart' : 'Out of Stock'}
                                            >
                                                <BsCart4 />
                                            </button>
                                            
                                            <button
                                                onClick={() => handleRemoveFromWishlist(item._id, item.name)}
                                                disabled={isLoading}
                                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                                title="Remove from Wishlist"
                                            >
                                                <BsTrash />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishlistPage
