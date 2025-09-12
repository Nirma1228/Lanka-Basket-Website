import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateStockStatus } from '../store/wishlistSlice'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

// Hook to periodically check stock status for wishlist items
export const useWishlistStockMonitor = (intervalMinutes = 30) => {
    const dispatch = useDispatch()
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems)
    const user = useSelector(state => state.user)
    
    useEffect(() => {
        if (!user?._id || wishlistItems.length === 0) return
        
        const checkStock = async () => {
            try {
                const response = await Axios({
                    ...SummaryApi.checkWishlistStockStatus,
                    data: {
                        productIds: wishlistItems.map(item => item._id)
                    }
                })
                
                if (response.data.success) {
                    response.data.products.forEach(product => {
                        dispatch(updateStockStatus({
                            productId: product._id,
                            stock: product.stock,
                            price: product.price
                        }))
                    })
                }
            } catch (error) {
                console.error('Error checking wishlist stock status:', error)
            }
        }
        
        // Check immediately
        checkStock()
        
        // Set up periodic checking
        const interval = setInterval(checkStock, intervalMinutes * 60 * 1000)
        
        return () => clearInterval(interval)
    }, [dispatch, wishlistItems, user, intervalMinutes])
}

// Hook for manual stock refresh
export const useRefreshWishlistStock = () => {
    const dispatch = useDispatch()
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems)
    const user = useSelector(state => state.user)
    
    const refreshStock = async () => {
        if (!user?._id || wishlistItems.length === 0) return false
        
        try {
            const response = await Axios({
                ...SummaryApi.checkWishlistStockStatus,
                data: {
                    productIds: wishlistItems.map(item => item._id)
                }
            })
            
            if (response.data.success) {
                response.data.products.forEach(product => {
                    dispatch(updateStockStatus({
                        productId: product._id,
                        stock: product.stock,
                        price: product.price
                    }))
                })
                return true
            }
        } catch (error) {
            console.error('Error refreshing wishlist stock:', error)
            return false
        }
        
        return false
    }
    
    return refreshStock
}
