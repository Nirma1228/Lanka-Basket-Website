import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { FaPlus, FaEdit, FaTrash, FaImages, FaLayerGroup } from 'react-icons/fa'
import { HiOutlineViewGrid } from 'react-icons/hi'
import LoadingSpinner from '../components/LoadingSpinner'

const CategoryPage = () => {
    const [openUploadCategory,setOpenUploadCategory] = useState(false)
    const [loading,setLoading] = useState(false)
    const [categoryData,setCategoryData] = useState([])
    const [openEdit,setOpenEdit] = useState(false)
    const [editData,setEditData] = useState({
        name : "",
        image : "",
    })
    const [openConfimBoxDelete,setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory,setDeleteCategory] = useState({
        _id : ""
    })
    // const allCategory = useSelector(state => state.product.allCategory)


    // useEffect(()=>{
    //     setCategoryData(allCategory)
    // },[allCategory])
    
    const fetchCategory = async()=>{
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data : responseData } = response

            if(responseData.success){
                setCategoryData(responseData.data)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategory()
    },[])

    const handleDeleteCategory = async()=>{
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data : deleteCategory
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Modern Header */}
      <div className='bg-white shadow-lg border-b border-gray-200'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md'>
                <FaLayerGroup className='text-white text-lg' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Categories</h1>
                <p className='text-sm text-gray-600'>
                  Manage product categories ({categoryData.length} total)
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setOpenUploadCategory(true)} 
              className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg'
            >
              <FaPlus className='text-sm' />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className='p-6'>
        {!categoryData[0] && !loading ? (
          <div className='bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200'>
            <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <FaImages className='text-3xl text-gray-400' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>No Categories Found</h3>
            <p className='text-gray-600 mb-6'>
              Get started by adding your first product category
            </p>
            <button 
              onClick={() => setOpenUploadCategory(true)}
              className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg'
            >
              <FaPlus className='text-sm' />
              <span>Add First Category</span>
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6'>
            {categoryData.map((category) => (
              <div 
                key={category._id}
                className='group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden'
              >
                {/* Image Section */}
                <div className='relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100'>
                  <div className='aspect-square p-4'>
                    <img 
                      alt={category.name}
                      src={category.image}
                      className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300'
                    />
                  </div>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </div>

                {/* Content Section */}
                <div className='p-4'>
                  <h3 className='font-semibold text-gray-900 text-center mb-4 truncate' title={category.name}>
                    {category.name}
                  </h3>
                  
                  {/* Action Buttons */}
                  <div className='flex gap-2'>
                    <button 
                      onClick={() => {
                        setOpenEdit(true)
                        setEditData(category)
                      }} 
                      className='flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded-lg font-medium transition-all duration-200 border border-green-200'
                    >
                      <FaEdit className='text-sm' />
                      <span className='text-sm'>Edit</span>
                    </button>
                    <button 
                      onClick={() => {
                        setOpenConfirmBoxDelete(true)
                        setDeleteCategory(category)
                      }} 
                      className='flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg font-medium transition-all duration-200 border border-red-200'
                    >
                      <FaTrash className='text-sm' />
                      <span className='text-sm'>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className='bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200'>
            <div className='flex flex-col items-center gap-4'>
              <LoadingSpinner size="xl" />
              <p className='text-gray-600 font-medium'>Loading categories...</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {openUploadCategory && (
        <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)}/>
      )}

      {openEdit && (
        <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory}/>
      )}

      {openConfimBoxDelete && (
        <CofirmBox 
          close={() => setOpenConfirmBoxDelete(false)} 
          cancel={() => setOpenConfirmBoxDelete(false)} 
          confirm={handleDeleteCategory}
        />
      )}
    </div>
  )
}

export default CategoryPage