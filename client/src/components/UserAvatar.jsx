import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

const UserAvatar = ({ user, size = 'md', showOnlineStatus = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl'
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarBgColor = (name) => {
    if (!name) return 'bg-gray-500'
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}>
      {user?.avatar ? (
        <img 
          src={user.avatar} 
          alt={user.name || 'User'} 
          className='w-full h-full object-cover'
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center text-white font-semibold ${getAvatarBgColor(user?.name)} ${textSizeClasses[size]}`}>
          {user?.name ? getInitials(user.name) : <FaUserCircle className='w-full h-full text-gray-400' />}
        </div>
      )}
      
      {showOnlineStatus && (
        <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></div>
      )}
    </div>
  )
}

export default UserAvatar
