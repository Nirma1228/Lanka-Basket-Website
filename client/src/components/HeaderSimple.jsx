import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

const HeaderSimple = () => {
  return (
    <header className='h-20 bg-white shadow-md sticky top-0 z-50'>
      <div className='container mx-auto px-4 h-full flex items-center justify-between'>
        <Link to="/" className='flex items-center'>
          <img 
            src={logo}
            width={150}
            height={50}
            alt="Lanka Basket"
            className="h-10 w-auto"
          />
        </Link>
        
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-green-600'>Lanka Basket</h1>
          <p className='text-sm text-gray-600'>Fresh Groceries Delivered</p>
        </div>
        
        <div className='flex items-center gap-4'>
          <Link to="/login" className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'>
            Login
          </Link>
          <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
            Cart (0)
          </button>
        </div>
      </div>
    </header>
  )
}

export default HeaderSimple
