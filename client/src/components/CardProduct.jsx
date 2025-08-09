import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'
import { FaFire, FaStar } from "react-icons/fa"
import { MdLocalOffer } from "react-icons/md"

const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const discountPrice = pricewithDiscount(data.price, data.discount)
    const hasDiscount = Boolean(data.discount)
  
    return (
        <Link 
            to={url} 
            className='group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-400 overflow-hidden transform hover:scale-105 transition-all duration-300 hover-lift min-w-72'
        >
            {/* Discount Badge */}
            {hasDiscount && (
                <div className='absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse'>
                    <FaFire />
                    {data.discount}% OFF
                </div>
            )}
            
            {/* Stock Badge */}
            {data.stock === 0 && (
                <div className='absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl'>
                    <span className='bg-red-500 text-white px-4 py-2 rounded-lg font-semibold'>Out of Stock</span>
                </div>
            )}

            {/* Product Image */}
            <div className='relative h-48 lg:h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4'>
                <img 
                    src={data.image[0]}
                    alt={data.name}
                    className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </div>

            {/* Product Details */}
            <div className='p-4 space-y-3'>
                {/* Product Name */}
                <h3 className='font-semibold text-gray-900 dark:text-white text-sm lg:text-base line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 leading-tight'>
                    {data.name}
                </h3>

                {/* Unit */}
                <p className='text-gray-600 dark:text-gray-400 text-xs lg:text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg w-fit'>
                    {data.unit}
                </p>

                {/* Rating (mock rating for visual appeal) */}
                <div className='flex items-center gap-1'>
                    <div className='flex text-yellow-400'>
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className='text-xs' />
                        ))}
                    </div>
                    <span className='text-xs text-gray-500'>(4.5)</span>
                </div>

                {/* Price and Add to Cart */}
                <div className='flex items-center justify-between pt-2'>
                    <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                            <span className='font-bold text-lg text-gray-900 dark:text-white'>
                                {DisplayPriceInRupees(discountPrice)}
                            </span>
                            {hasDiscount && (
                                <span className='text-sm text-gray-500 dark:text-gray-400 line-through'>
                                    {DisplayPriceInRupees(data.price)}
                                </span>
                            )}
                        </div>
                        {hasDiscount && (
                            <div className='flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium'>
                                <MdLocalOffer />
                                Save {DisplayPriceInRupees(data.price - discountPrice)}
                            </div>
                        )}
                    </div>
                    
                    <div className='flex-shrink-0'>
                        {data.stock === 0 ? (
                            <button className='bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 px-4 py-2 rounded-lg font-medium cursor-not-allowed'>
                                Sold Out
                            </button>
                        ) : (
                            <div className='transform hover:scale-105 transition-transform duration-200'>
                                <AddToCartButton data={data} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover overlay effect */}
            <div className='absolute inset-0 border-2 border-green-400 dark:border-green-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
        </Link>
    )
}

export default CardProduct
