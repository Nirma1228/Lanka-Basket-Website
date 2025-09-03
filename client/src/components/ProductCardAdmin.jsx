import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import CofirmBox from './CofirmBox'
import { IoClose } from 'react-icons/io5'
import { MdWarning, MdCheckCircle } from 'react-icons/md'
import { FaExclamationTriangle } from 'react-icons/fa'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen,setEditOpen]= useState(false)
  const [openDelete,setOpenDelete] = useState(false)

  const handleDeleteCancel  = ()=>{
      setOpenDelete(false)
  }

  const handleDelete = async()=>{
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data : {
          _id : data._id
        }
      })

      const { data : responseData } = response

      if(responseData.success){
          toast.success(responseData.message)
          if(fetchProductData){
            fetchProductData()
          }
          setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  // Get stock status
  const getStockStatus = () => {
    if (data.stock === 0) {
      return { 
        status: 'Out of Stock', 
        color: 'text-red-600', 
        bg: 'bg-red-50', 
        border: 'border-red-200',
        icon: <MdWarning className='text-red-500' />
      }
    } else if (data.stock <= 10) {
      return { 
        status: 'Low Stock', 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-50', 
        border: 'border-yellow-200',
        icon: <FaExclamationTriangle className='text-yellow-500' />
      }
    } else {
      return { 
        status: 'In Stock', 
        color: 'text-green-600', 
        bg: 'bg-green-50', 
        border: 'border-green-200',
        icon: <MdCheckCircle className='text-green-500' />
      }
    }
  }

  const stockStatus = getStockStatus()

  return (
    <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
        {/* Stock Status Badge */}
        <div className={`${stockStatus.bg} ${stockStatus.border} border-b px-3 py-2`}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              {stockStatus.icon}
              <span className={`text-xs font-medium ${stockStatus.color}`}>
                {stockStatus.status}
              </span>
            </div>
            <span className={`text-xs font-bold ${stockStatus.color}`}>
              {data.stock} units
            </span>
          </div>
        </div>

        {/* Product Image */}
        <div className='p-4'>
          <div className='relative'>
            <img
               src={data?.image[0] || '/api/placeholder/200/200'}  
               alt={data?.name}
               className='w-full h-32 object-cover rounded-lg'
            />
            {data.stock === 0 && (
              <div className='absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>OUT OF STOCK</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className='px-4 pb-4'>
          <h3 className='font-semibold text-gray-900 text-sm line-clamp-2 mb-1'>
            {data?.name}
          </h3>
          <p className='text-gray-500 text-xs mb-2'>{data?.unit}</p>
          
          {/* Price */}
          <div className='mb-3'>
            <p className='font-bold text-green-600'>
              {DisplayPriceInRupees(data?.price)}
            </p>
            {data?.discount > 0 && (
              <p className='text-xs text-orange-600'>
                {data.discount}% off
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className='grid grid-cols-2 gap-2'>
            <button 
              onClick={() => setEditOpen(true)} 
              className='px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors'
            >
              Edit
            </button>
            <button 
              onClick={() => setOpenDelete(true)} 
              className='px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors'
            >
              Delete
            </button>
          </div>
        </div>

        {
          editOpen && (
            <EditProductAdmin fetchProductData={fetchProductData} data={data} close={()=>setEditOpen(false)}/>
          )
        }

        {
          openDelete && (
            <section className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-600 z-50 bg-opacity-70 p-4 flex justify-center items-center'>
                <div className='bg-white p-4 w-full max-w-md rounded-md'>
                    <div className='flex items-center justify-between gap-4'>

                        <h3 className='font-semibold'>Permanently Deleted</h3>

                        <button onClick={()=>setOpenDelete(false)}>
                          <IoClose size={25}/>
                        </button>
                    </div>

                    <p className='my-2'>Are you sure you want to delete this permanently?</p>

                    <div className='flex justify-end gap-5 py-4'>
                      <button onClick={handleDeleteCancel} className='border px-3 py-1 rounded bg-red-100 border-red-500 text-red-500 hover:bg-red-200'>Cancel</button>
                      <button onClick={handleDelete} className='border px-3 py-1 rounded bg-green-100 border-green-500 text-green-500 hover:bg-green-200'>Delete</button>
                    </div>
                </div>
            </section>
          )
        }
    </div>
  )
}

export default ProductCardAdmin
