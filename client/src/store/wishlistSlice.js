import { createSlice } from '@reduxjs/toolkit'

// Helper functions for localStorage
const loadWishlistFromStorage = () => {
    try {
        const saved = localStorage.getItem('lanka-basket-wishlist')
        return saved ? JSON.parse(saved) : []
    } catch (error) {
        console.error('Error loading wishlist from localStorage:', error)
        return []
    }
}

const saveWishlistToStorage = (wishlistItems) => {
    try {
        localStorage.setItem('lanka-basket-wishlist', JSON.stringify(wishlistItems))
    } catch (error) {
        console.error('Error saving wishlist to localStorage:', error)
    }
}

const loadNotificationsFromStorage = () => {
    try {
        const saved = localStorage.getItem('lanka-basket-wishlist-alerts')
        return saved ? JSON.parse(saved) : []
    } catch (error) {
        console.error('Error loading notifications from localStorage:', error)
        return []
    }
}

const saveNotificationsToStorage = (notifications) => {
    try {
        localStorage.setItem('lanka-basket-wishlist-alerts', JSON.stringify(notifications))
    } catch (error) {
        console.error('Error saving notifications to localStorage:', error)
    }
}

const initialState = {
    wishlistItems: loadWishlistFromStorage(),
    loading: false,
    error: null,
    notifications: [],
    stockAlerts: loadNotificationsFromStorage()
}

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setWishlistItems: (state, action) => {
            state.wishlistItems = action.payload
        },
        addToWishlist: (state, action) => {
            const product = action.payload
            const existingItem = state.wishlistItems.find(item => item._id === product._id)
            
            if (!existingItem) {
                state.wishlistItems.push({
                    ...product,
                    addedAt: new Date().toISOString(),
                    isInStock: product.stock > 0,
                    lastStockCheck: new Date().toISOString()
                })
                
                // Save to localStorage
                saveWishlistToStorage(state.wishlistItems)
                
                // Add success notification
                state.notifications.push({
                    id: Date.now(),
                    type: 'success',
                    message: `${product.name} added to wishlist`,
                    timestamp: new Date().toISOString()
                })
            }
        },
        removeFromWishlist: (state, action) => {
            const productId = action.payload
            const removedItem = state.wishlistItems.find(item => item._id === productId)
            
            state.wishlistItems = state.wishlistItems.filter(item => item._id !== productId)
            
            // Save to localStorage
            saveWishlistToStorage(state.wishlistItems)
            
            if (removedItem) {
                state.notifications.push({
                    id: Date.now(),
                    type: 'info',
                    message: `${removedItem.name} removed from wishlist`,
                    timestamp: new Date().toISOString()
                })
            }
        },
        clearWishlist: (state) => {
            state.wishlistItems = []
            // Save to localStorage
            saveWishlistToStorage([])
            
            state.notifications.push({
                id: Date.now(),
                type: 'info',
                message: 'Wishlist cleared',
                timestamp: new Date().toISOString()
            })
        },
        updateStockStatus: (state, action) => {
            const { productId, stock, price } = action.payload
            const item = state.wishlistItems.find(item => item._id === productId)
            
            if (item) {
                const wasInStock = item.isInStock
                const isNowInStock = stock > 0
                
                // Update item details
                item.stock = stock
                item.isInStock = isNowInStock
                item.lastStockCheck = new Date().toISOString()
                
                if (price !== undefined) {
                    const oldPrice = item.price
                    item.price = price
                    
                    // Price drop notification
                    if (oldPrice > price && isNowInStock) {
                        state.stockAlerts.push({
                            id: Date.now(),
                            type: 'price_drop',
                            productId: productId,
                            productName: item.name,
                            oldPrice: oldPrice,
                            newPrice: price,
                            message: `Great news! ${item.name} price dropped from Rs.${oldPrice} to Rs.${price}`,
                            timestamp: new Date().toISOString(),
                            isRead: false
                        })
                    }
                }
                
                // Stock status change notifications
                if (wasInStock && !isNowInStock) {
                    // Item went out of stock
                    state.stockAlerts.push({
                        id: Date.now(),
                        type: 'out_of_stock',
                        productId: productId,
                        productName: item.name,
                        message: `${item.name} is now out of stock`,
                        timestamp: new Date().toISOString(),
                        isRead: false
                    })
                } else if (!wasInStock && isNowInStock) {
                    // Item came back in stock
                    state.stockAlerts.push({
                        id: Date.now(),
                        type: 'back_in_stock',
                        productId: productId,
                        productName: item.name,
                        message: `Good news! ${item.name} is back in stock`,
                        timestamp: new Date().toISOString(),
                        isRead: false
                    })
                } else if (isNowInStock && stock <= 5) {
                    // Low stock warning
                    state.stockAlerts.push({
                        id: Date.now(),
                        type: 'low_stock',
                        productId: productId,
                        productName: item.name,
                        message: `Hurry! Only ${stock} left of ${item.name}`,
                        timestamp: new Date().toISOString(),
                        isRead: false
                    })
                }
            }
        },
        markNotificationAsRead: (state, action) => {
            const notificationId = action.payload
            const notification = state.stockAlerts.find(alert => alert.id === notificationId)
            if (notification) {
                notification.isRead = true
            }
        },
        clearNotifications: (state) => {
            state.notifications = []
        },
        clearStockAlerts: (state) => {
            state.stockAlerts = []
        },
        removeExpiredNotifications: (state) => {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            state.notifications = state.notifications.filter(
                notification => notification.timestamp > twentyFourHoursAgo
            )
            state.stockAlerts = state.stockAlerts.filter(
                alert => alert.timestamp > twentyFourHoursAgo
            )
        }
    }
})

export const { 
    setLoading,
    setError,
    setWishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    updateStockStatus,
    markNotificationAsRead,
    clearNotifications,
    clearStockAlerts,
    removeExpiredNotifications
} = wishlistSlice.actions

export default wishlistSlice.reducer
