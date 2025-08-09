import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight, FaFire } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { IoSparkles } from "react-icons/io5"
import { MdTrendingUp } from "react-icons/md"

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 300
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 300
    }

    const handleRedirectProductListpage = ()=>{
        const subcategory = subCategoryData.find(sub =>{
          const filterData = sub.category.some(c => {
            return c._id == id
          })

          return filterData ? true : null
        })
        const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

        return url
    }

    const redirectURL = handleRedirectProductListpage()
    
    if (!data.length && !loading) return null

    return (
        <div className='mb-12 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md dark:shadow-gray-900/20 transition-all duration-300'>
            {/* Modern Header */}
            <div className='container mx-auto flex items-center justify-between mb-8'>
                <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl'>
                            <IoSparkles className='text-white text-lg' />
                        </div>
                        <div>
                            <h3 className='font-bold text-2xl md:text-3xl text-gray-900 dark:text-white mb-1'>
                                {name}
                            </h3>
                            <p className='text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1'>
                                <MdTrendingUp className='text-orange-500 animate-pulse' />
                                Trending in {name}
                            </p>
                        </div>
                    </div>
                </div>
                
                <Link 
                    to={redirectURL} 
                    className='group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2'
                >
                    View All
                    <FaAngleRight className='group-hover:translate-x-1 transition-transform duration-300' />
                </Link>
            </div>

            {/* Products Carousel */}
            <div className='relative'>
                <div 
                    className='flex gap-6 container mx-auto overflow-x-auto scrollbar-none scroll-smooth pb-4' 
                    ref={containerRef}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <div key={"CategorywiseProductDisplay123" + index} className='min-w-72'>
                                    <CardLoading />
                                </div>
                            )
                        })
                    }

                    {
                        data.map((p, index) => {
                            return (
                                <div 
                                    key={p._id + "CategorywiseProductDisplay" + index}
                                    className={`min-w-72 animate-fade-in-up hover-lift`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardProduct data={p} />
                                </div>
                            )
                        })
                    }
                </div>

                {/* Navigation Buttons */}
                <div className='absolute top-1/2 -translate-y-1/2 left-0 right-0 container mx-auto px-4 hidden lg:flex justify-between pointer-events-none'>
                    <button 
                        onClick={handleScrollLeft} 
                        className='pointer-events-auto z-10 bg-white hover:bg-gray-50 shadow-xl hover:shadow-2xl text-gray-700 hover:text-green-600 p-4 rounded-full transform hover:scale-110 transition-all duration-300 border border-gray-100'
                    >
                        <FaAngleLeft className='text-xl' />
                    </button>
                    <button 
                        onClick={handleScrollRight} 
                        className='pointer-events-auto z-10 bg-white hover:bg-gray-50 shadow-xl hover:shadow-2xl text-gray-700 hover:text-green-600 p-4 rounded-full transform hover:scale-110 transition-all duration-300 border border-gray-100'
                    >
                        <FaAngleRight className='text-xl' />
                    </button>
                </div>

                {/* Hot Deals Badge for first few items */}
                {data.length > 0 && (
                    <div className='absolute -top-2 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg'>
                        <FaFire className='inline mr-1' />
                        HOT DEALS
                    </div>
                )}
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay
