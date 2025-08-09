
import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5"
import { FaBoxOpen, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { HiOutlineViewGrid } from 'react-icons/hi'
import LoadingSpinner from '../components/LoadingSpinner'

const ProductAdmin = () => {
  const [productData,setProductData] = useState([])
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const [totalPageCount,setTotalPageCount] = useState(1)
  const [search,setSearch] = useState("")
  
  const fetchProductData = async()=>{
    try {
        setLoading(true)
        const response = await Axios({
           ...SummaryApi.getProduct,
           data : {
              page : page,
              limit : 12,
              search : search 
           }
        })

        const { data : responseData } = response 

        if(responseData.success){
          setTotalPageCount(responseData.totalNoPage)
          setProductData(responseData.data)
        }

    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    fetchProductData()
  },[page])

  const handleNext = ()=>{
    if(page !== totalPageCount){
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = ()=>{
    if(page > 1){
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e)=>{
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(()=>{
    let flag = true 

    const interval = setTimeout(() => {
      if(flag){
        fetchProductData()
        flag = false
      }
    }, 300);

    return ()=>{
      clearTimeout(interval)
    }
  },[search])
  
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Modern Header */}
      <div className='bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md'>
                <FaBoxOpen className='text-white text-lg' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Product Management</h1>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Manage your product inventory and listings
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className='flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-600 min-w-80 max-w-md w-full focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200'>
              <IoSearchOutline className='text-xl text-gray-400 dark:text-gray-500' />
              <input
                type='text'
                placeholder='Search products...' 
                className='flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                value={search}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className='p-6'>
        {loading ? (
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700'>
            <div className='flex flex-col items-center gap-4'>
              <LoadingSpinner size="xl" />
              <p className='text-gray-600 dark:text-gray-300 font-medium'>Loading products...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
              {productData.length > 0 ? (
                <div className='p-6'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 min-h-[60vh]'>
                    {productData.map((product) => (
                      <ProductCardAdmin 
                        key={product._id}
                        data={product} 
                        fetchProductData={fetchProductData}  
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className='p-12 text-center'>
                  <div className='w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <HiOutlineViewGrid className='text-3xl text-gray-400 dark:text-gray-500' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                    {search ? 'No Products Found' : 'No Products Available'}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>
                    {search 
                      ? `No products match "${search}". Try a different search term.`
                      : 'Start by adding your first product to get started.'
                    }
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPageCount > 1 && (
                <div className='border-t border-gray-200 dark:border-gray-700 p-4'>
                  <div className='flex items-center justify-between'>
                    <button 
                      onClick={handlePrevious}
                      disabled={page === 1}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        page === 1 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                          : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      <FaChevronLeft className='text-sm' />
                      <span>Previous</span>
                    </button>
                    
                    <div className='flex items-center gap-4'>
                      <span className='text-sm text-gray-600 dark:text-gray-300'>
                        Page {page} of {totalPageCount}
                      </span>
                      <div className='flex gap-1'>
                        {Array.from({ length: Math.min(5, totalPageCount) }).map((_, index) => {
                          const pageNumber = Math.max(1, page - 2) + index
                          if (pageNumber > totalPageCount) return null
                          
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setPage(pageNumber)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                                pageNumber === page
                                  ? 'bg-indigo-600 text-white shadow-md'
                                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleNext}
                      disabled={page === totalPageCount}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        page === totalPageCount 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      <span>Next</span>
                      <FaChevronRight className='text-sm' />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductAdmin
