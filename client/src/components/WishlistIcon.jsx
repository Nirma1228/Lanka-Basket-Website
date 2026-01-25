import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { BsHeart, BsHeartFill, BsBell, BsX, BsCart4, BsEye } from 'react-icons/bs'
import { MdOutlineShoppingCart, MdNotifications, MdClose } from 'react-icons/md'
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa'
import { removeFromWishlist, markNotificationAsRead, clearStockAlerts } from '../store/wishlistSlice'
import { useGlobalContext } from '../provider/GlobalProvider'
import { useWishlistStockMonitor } from '../hooks/useWishlistStockMonitor'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'

const WishlistIcon = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const dropdownRef = useRef(null)
    const notificationRef = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { fetchCartItem } = useGlobalContext()
    
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems)
    const stockAlerts = useSelector(state => state.wishlist.stockAlerts)
    const user = useSelector(state => state.user)
    
    const wishlistCount = wishlistItems.length
    const unreadAlerts = stockAlerts.filter(alert => !alert.isRead).length
    
    // Monitor stock status for wishlist items
    useWishlistStockMonitor(30) // Check every 30 minutes
    
    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false)
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    
    const handleRemoveFromWishlist = async (productId, productName) => {
        try {
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
        }
    }
    
    const handleAddToCart = async (product) => {
        try {
            if (!product.isInStock) {
                toast.error('Product is out of stock')
                return
            }
            
            if (!user?._id) {
                toast.error('Please login to add items to cart')
                return
            }
            
            const response = await Axios({
                ...SummaryApi.addTocart,
                data: { productId: product._id, qty: 1 }
            })
            
            if (response.data.success) {
                toast.success(`${product.name} added to cart`)
                // Refresh cart items to update the cart display
                fetchCartItem()
            }
        } catch (error) {
            toast.error('Failed to add item to cart')
        }
    }
    
    const handleNotificationClick = (alert) => {
        dispatch(markNotificationAsRead(alert.id))
        if (alert.productId) {
            navigate(`/product/${alert.productId}`)
        }
    }
    
    const getAlertIcon = (type) => {
        switch (type) {
            case 'out_of_stock':
                return <FaExclamationTriangle className="text-red-500" />
            case 'back_in_stock':
                return <FaCheckCircle className="text-green-500" />
            case 'low_stock':
                return <FaExclamationTriangle className="text-yellow-500" />
            case 'price_drop':
                return <FaInfoCircle className="text-blue-500" />
            default:
                return <FaInfoCircle className="text-gray-500" />
        }
    }
    
    const getAlertBgColor = (type) => {
        switch (type) {
            case 'out_of_stock':
                return 'bg-red-50 border-red-200'
            case 'back_in_stock':
                return 'bg-green-50 border-green-200'
            case 'low_stock':
                return 'bg-yellow-50 border-yellow-200'
            case 'price_drop':
                return 'bg-blue-50 border-blue-200'
            default:
                return 'bg-gray-50 border-gray-200'
        }
    }
    
    return (
        <div className="flex items-center gap-2 relative">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
                <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                    <BsBell className="text-xl text-gray-700" />
                    {unreadAlerts > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                            {unreadAlerts > 9 ? '9+' : unreadAlerts}
                        </span>
                    )}
                </button>
                
                {/* Notification Dropdown */}
                {isNotificationOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Stock Alerts</h3>
                            {stockAlerts.length > 0 && (
                                <button
                                    onClick={() => dispatch(clearStockAlerts())}
                                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto">
                            {stockAlerts.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <BsBell className="text-4xl mx-auto mb-2 opacity-50" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                stockAlerts.slice(0, 10).map((alert) => (
                                    <div
                                        key={alert.id}
                                        onClick={() => handleNotificationClick(alert)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                            !alert.isRead ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getAlertIcon(alert.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 font-medium">
                                                    {alert.productName}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {alert.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(alert.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            {!alert.isRead && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Wishlist Icon */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
                >
                    {wishlistCount > 0 ? (
                        <BsHeartFill className="text-xl text-red-500 group-hover:scale-110 transition-transform duration-200" />
                    ) : (
                        <BsHeart className="text-xl text-gray-700 group-hover:text-red-500 group-hover:scale-110 transition-all duration-200" />
                    )}
                    
                    {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce">
                            {wishlistCount > 9 ? '9+' : wishlistCount}
                        </span>
                    )}
                </button>
                
                {/* Wishlist Dropdown */}
                {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">My Wishlist</h3>
                            <Link
                                to="/wishlist"
                                onClick={() => setIsDropdownOpen(false)}
                                className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                            >
                                View All
                            </Link>
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto">
                            {wishlistItems.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <BsHeart className="text-4xl mx-auto mb-2 opacity-50" />
                                    <p>Your wishlist is empty</p>
                                    <p className="text-sm mt-1">Add items you love!</p>
                                </div>
                            ) : (
                                wishlistItems.slice(0, 5).map((item) => (
                                    <div key={item._id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={item.image[0]}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                                {!item.isInStock && (
                                                    <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">OUT</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 text-sm truncate">
                                                    {item.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-red-600 font-bold text-sm">
                                                        Rs. {item.price}
                                                    </span>
                                                    {!item.isInStock && (
                                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                    {item.isInStock && item.stock <= 5 && (
                                                        <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full font-medium">
                                                            Only {item.stock} left
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => handleAddToCart(item)}
                                                    disabled={!item.isInStock}
                                                    className={`p-1.5 rounded-full transition-colors ${
                                                        item.isInStock
                                                            ? 'hover:bg-green-100 text-green-600 hover:text-green-700'
                                                            : 'opacity-50 cursor-not-allowed text-gray-400'
                                                    }`}
                                                    title={item.isInStock ? 'Add to Cart' : 'Out of Stock'}
                                                >
                                                    <BsCart4 className="text-sm" />
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleRemoveFromWishlist(item._id, item.name)}
                                                    className="p-1.5 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-full transition-colors"
                                                    title="Remove from Wishlist"
                                                >
                                                    <BsX className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        {wishlistItems.length > 0 && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <Link
                                    to="/wishlist"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 group"
                                >
                                    <BsEye className="group-hover:scale-110 transition-transform" />
                                    View Full Wishlist ({wishlistCount})
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishlistIcon
