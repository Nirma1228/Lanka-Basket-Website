import React from 'react'

const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-green-500',
    white: 'border-white',
    gray: 'border-gray-500',
    blue: 'border-blue-500',
    red: 'border-red-500'
  }

  return (
    <div 
      className={`${sizeClasses[size]} border-2 border-transparent ${colorClasses[color]} border-t-transparent border-l-transparent rounded-full animate-spin ${className}`}
      style={{
        borderTopColor: 'transparent',
        borderRightColor: 'currentColor',
        borderBottomColor: 'currentColor',
        borderLeftColor: 'transparent'
      }}
    />
  )
}

export const PageLoader = ({ message = 'Loading...' }) => (
  <div className='fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center'>
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 border dark:border-gray-700'>
      <LoadingSpinner size="xl" />
      <p className='text-gray-600 dark:text-gray-300 font-medium'>{message}</p>
    </div>
  </div>
)

export const ButtonLoader = ({ size = 'sm', color = 'white' }) => (
  <LoadingSpinner size={size} color={color} className='mx-1' />
)

export const CardLoader = () => (
  <div className='bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 animate-pulse'>
    <div className='bg-gray-200 dark:bg-gray-700 rounded-lg h-48 mb-4'></div>
    <div className='bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2'></div>
    <div className='bg-gray-200 dark:bg-gray-700 rounded h-4 w-2/3 mb-4'></div>
    <div className='bg-gray-200 dark:bg-gray-700 rounded h-8'></div>
  </div>
)

export const ListLoader = ({ items = 3 }) => (
  <div className='space-y-4'>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className='bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 animate-pulse'>
        <div className='flex gap-4'>
          <div className='bg-gray-200 dark:bg-gray-700 rounded-lg w-16 h-16'></div>
          <div className='flex-1'>
            <div className='bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2'></div>
            <div className='bg-gray-200 dark:bg-gray-700 rounded h-4 w-2/3 mb-2'></div>
            <div className='bg-gray-200 dark:bg-gray-700 rounded h-3 w-1/2'></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default LoadingSpinner
