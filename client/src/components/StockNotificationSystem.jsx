import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BsBell, BsX } from 'react-icons/bs'
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa'
import { IoSparkles } from 'react-icons/io5'
import { markNotificationAsRead, removeExpiredNotifications, updateStockStatus } from '../store/wishlistSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const StockNotificationSystem = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [visibleNotifications, setVisibleNotifications] = useState([])
    const stockAlerts = useSelector(state => state.wishlist.stockAlerts)
    
    // Get unread stock alerts
    const unreadAlerts = stockAlerts.filter(alert => !alert.isRead)
    
    useEffect(() => {
        // Clean up expired notifications every hour
        const cleanupInterval = setInterval(() => {
            dispatch(removeExpiredNotifications())
        }, 60 * 60 * 1000) // 1 hour
        
        return () => clearInterval(cleanupInterval)
    }, [dispatch])
    
    useEffect(() => {
        // Show new notifications as toasts
        unreadAlerts.forEach(alert => {
            if (!visibleNotifications.includes(alert.id)) {
                showNotificationToast(alert)
                setVisibleNotifications(prev => [...prev, alert.id])
            }
        })
    }, [unreadAlerts, visibleNotifications])
    
    const showNotificationToast = (alert) => {
        const toastContent = (
            <div className="flex items-start gap-3 max-w-sm">
                <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                        {alert.productName}
                    </p>
                    <p className="text-xs text-gray-600">
                        {alert.message}
                    </p>
                </div>
            </div>
        )
        
        const toastOptions = {
            duration: 6000,
            position: 'top-right',
            style: {
                background: getToastBackground(alert.type),
                border: `1px solid ${getToastBorderColor(alert.type)}`,
                color: '#374151',
            },
            onClick: () => handleNotificationClick(alert)
        }
        
        switch (alert.type) {
            case 'back_in_stock':
                toast.success(toastContent, toastOptions)
                break
            case 'out_of_stock':
                toast.error(toastContent, toastOptions)
                break
            case 'low_stock':
                toast(toastContent, {
                    ...toastOptions,
                    icon: '⚠️'
                })
                break
            case 'price_drop':
                toast.success(toastContent, toastOptions)
                break
            default:
                toast(toastContent, toastOptions)
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
                return <IoSparkles className="text-blue-500" />
            default:
                return <FaInfoCircle className="text-gray-500" />
        }
    }
    
    const getToastBackground = (type) => {
        switch (type) {
            case 'out_of_stock':
                return '#FEF2F2'
            case 'back_in_stock':
                return '#F0FDF4'
            case 'low_stock':
                return '#FFFBEB'
            case 'price_drop':
                return '#EFF6FF'
            default:
                return '#F9FAFB'
        }
    }
    
    const getToastBorderColor = (type) => {
        switch (type) {
            case 'out_of_stock':
                return '#FECACA'
            case 'back_in_stock':
                return '#BBF7D0'
            case 'low_stock':
                return '#FDE68A'
            case 'price_drop':
                return '#DBEAFE'
            default:
                return '#E5E7EB'
        }
    }
    
    const handleNotificationClick = (alert) => {
        dispatch(markNotificationAsRead(alert.id))
        if (alert.productId) {
            navigate(`/product/${alert.productId}`)
        }
    }
    
    // Auto-mark notifications as read after some time
    useEffect(() => {
        const autoMarkReadTimeout = setTimeout(() => {
            unreadAlerts.forEach(alert => {
                const timeSinceCreated = Date.now() - new Date(alert.timestamp).getTime()
                if (timeSinceCreated > 30000) { // 30 seconds
                    dispatch(markNotificationAsRead(alert.id))
                }
            })
        }, 30000)
        
        return () => clearTimeout(autoMarkReadTimeout)
    }, [unreadAlerts, dispatch])
    
    return null // This component only handles toast notifications
}

// Hook for manually triggering stock check notifications
export const useStockNotifications = () => {
    const dispatch = useDispatch()
    
    const checkAndUpdateStock = async (products) => {
        // This would typically make an API call to check current stock status
        // For now, we'll simulate stock updates
        products.forEach(product => {
            // Simulate random stock changes for demo
            const randomStock = Math.floor(Math.random() * 20)
            const randomPrice = product.price * (0.8 + Math.random() * 0.4) // ±20% price variation
            
            dispatch(updateStockStatus({
                productId: product._id,
                stock: randomStock,
                price: Math.random() > 0.9 ? randomPrice : product.price // 10% chance of price change
            }))
        })
    }
    
    return { checkAndUpdateStock }
}

export default StockNotificationSystem
