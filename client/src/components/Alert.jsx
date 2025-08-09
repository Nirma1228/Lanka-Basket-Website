import React, { useState, useEffect } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa'

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  autoClose = false, 
  duration = 5000,
  className = '',
  showIcon = true 
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) {
      setTimeout(() => onClose(), 300) // Wait for animation to complete
    }
  }

  const alertStyles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: FaCheckCircle,
      iconColor: 'text-green-600 dark:text-green-400'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: FaExclamationCircle,
      iconColor: 'text-red-600 dark:text-red-400'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: FaExclamationTriangle,
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: FaInfoCircle,
      iconColor: 'text-blue-600 dark:text-blue-400'
    }
  }

  const style = alertStyles[type]
  const IconComponent = style.icon

  if (!isVisible) return null

  return (
    <div className={`
      ${style.bg} ${style.text} border rounded-xl p-4 shadow-sm transition-all duration-300 
      ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}
      ${className}
    `}>
      <div className='flex items-start gap-3'>
        {showIcon && (
          <IconComponent className={`${style.iconColor} text-lg flex-shrink-0 mt-0.5`} />
        )}
        
        <div className='flex-1 min-w-0'>
          {title && (
            <h4 className='font-semibold text-sm mb-1'>{title}</h4>
          )}
          {message && (
            <p className='text-sm leading-relaxed'>{message}</p>
          )}
        </div>

        {onClose && (
          <button
            onClick={handleClose}
            className={`${style.iconColor} hover:opacity-70 transition-opacity duration-200 p-1 -m-1 rounded-full`}
          >
            <FaTimes className='text-sm' />
          </button>
        )}
      </div>
    </div>
  )
}

export const AlertContainer = ({ alerts = [] }) => (
  <div className='fixed top-4 right-4 z-50 space-y-3 max-w-sm'>
    {alerts.map((alert, index) => (
      <Alert key={alert.id || index} {...alert} />
    ))}
  </div>
)

export const InlineAlert = ({ type, message, className = '' }) => (
  <Alert 
    type={type} 
    message={message} 
    className={`mb-4 ${className}`}
    showIcon={true}
  />
)

export default Alert
