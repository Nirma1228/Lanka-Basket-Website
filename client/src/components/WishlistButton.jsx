import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'

const WishlistButton = ({ 
    product, 
    size = 'md', // 'sm', 'md', 'lg'
    className = '',
    showTooltip = true
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems)
    
    const isInWishlist = wishlistItems.some(item => item._id === product._id)
    
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-8 h-8 text-sm'
            case 'lg':
                return 'w-12 h-12 text-xl'
            default:
                return 'w-10 h-10 text-base'
        }
    }
    
    const handleWishlistToggle = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!user?._id) {
            toast.error('Please login to use wishlist')
            return
        }
        
        setIsLoading(true)
        
        try {
            if (isInWishlist) {
                // Remove from wishlist
                try {
                    // Try backend API first
                    await Axios({
                        ...SummaryApi.removeFromWishlist,
                        data: { productId: product._id }
                    })
                } catch (apiError) {
                    // If backend fails, continue with local storage as fallback
                    console.warn('Backend wishlist API not available, using localStorage fallback')
                }
                
                dispatch(removeFromWishlist(product._id))
                toast.success(`${product.name} removed from wishlist`)
            } else {
                // Add to wishlist
                try {
                    // Try backend API first
                    await Axios({
                        ...SummaryApi.addToWishlist,
                        data: { 
                            productId: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            stock: product.stock || 0
                        }
                    })
                } catch (apiError) {
                    // If backend fails, continue with local storage as fallback
                    console.warn('Backend wishlist API not available, using localStorage fallback')
                }
                
                dispatch(addToWishlist({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    stock: product.stock || 0
                }))
                toast.success(`${product.name} added to wishlist`)
            }
        } catch (error) {
            console.error('Wishlist error:', error)
            toast.error(isInWishlist ? 'Failed to remove from wishlist' : 'Failed to add to wishlist')
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <button
            onClick={handleWishlistToggle}
            disabled={isLoading}
            className={`
                ${getSizeClasses()}
                relative flex items-center justify-center
                bg-white border border-gray-200 rounded-full
                hover:bg-gray-50 hover:border-gray-300 hover:scale-110
                transition-all duration-300 ease-out
                disabled:opacity-50 disabled:cursor-not-allowed
                group shadow-sm hover:shadow-md
                ${className}
            `}
            title={showTooltip ? (isInWishlist ? 'Remove from wishlist' : 'Add to wishlist') : ''}
        >
            {/* Loading state */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                </div>
            )}
            
            {/* Heart icon */}
            <div className={`transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {isInWishlist ? (
                    <BsHeartFill className={`text-red-500 group-hover:scale-110 transition-transform duration-200`} />
                ) : (
                    <BsHeart className={`text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-all duration-200`} />
                )}
            </div>
            
            {/* Pulse effect for added items */}
            {isInWishlist && (
                <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 scale-0 group-hover:scale-100 group-hover:opacity-10 transition-all duration-300"></div>
            )}
        </button>
    )
}

export default WishlistButton
