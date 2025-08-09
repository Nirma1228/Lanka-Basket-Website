import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { HiPencil } from "react-icons/hi"
import { MdDelete } from "react-icons/md"
import EditSubCategory from '../components/EditSubCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import { FaPlus, FaTags, FaImage, FaEye } from 'react-icons/fa'
import { HiOutlineCollection } from 'react-icons/hi'
import LoadingSpinner from '../components/LoadingSpinner'

const SubCategoryPage = () => {
  const [openAddSubCategory,setOpenAddSubCategory] = useState(false)
  const [data,setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL,setImageURL] = useState("")
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({
    _id : ""
  })
  const [deleteSubCategory,setDeleteSubCategory] = useState({
      _id : ""
  })
  const [openDeleteConfirmBox,setOpenDeleteConfirmBox] = useState(false)


  const fetchSubCategory = async()=>{
    try {
        setLoading(true)
        const response = await Axios({
          ...SummaryApi.getSubCategory
        })
        const { data : responseData } = response

        if(responseData.success){
          setData(responseData.data)
        }
    } catch (error) {
       AxiosToastError(error)
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchSubCategory()
  },[])

  const column = [
    columnHelper.accessor('name', {
      header: "Name",
      cell: ({ row }) => (
        <div className='font-medium text-gray-900'>
          {row.original.name}
        </div>
      )
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => (
        <div className='flex justify-center items-center'>
          <div className='relative group'>
            <img 
              src={row.original.image}
              alt={row.original.name}
              className='w-12 h-12 object-cover rounded-lg border border-gray-200 cursor-pointer hover:scale-110 transition-transform duration-200'
              onClick={() => setImageURL(row.original.image)}      
            />
            <div className='absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
              <FaEye className='text-white text-sm' />
            </div>
          </div>
        </div>
      )
    }),
    columnHelper.accessor("category", {
      header: "Categories",
      cell: ({ row }) => (
        <div className='flex flex-wrap gap-1'>
          {row.original.category.map((c) => (
            <span key={c._id + "table"} className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200'>
              {c.name}
            </span>
          ))}
        </div>
      )
    }),
    columnHelper.accessor("_id", {
      header: "Actions",
      cell: ({ row }) => (
        <div className='flex items-center justify-center gap-2'>
          <button 
            onClick={() => {
              setOpenEdit(true)
              setEditData(row.original)
            }} 
            className='p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-200 border border-green-200'
            title="Edit subcategory"
          >
            <HiPencil size={16}/>
          </button>
          <button 
            onClick={() => {
              setOpenDeleteConfirmBox(true)
              setDeleteSubCategory(row.original)
            }} 
            className='p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 border border-red-200'
            title="Delete subcategory"
          >
            <MdDelete size={16}/>
          </button>
        </div>
      )
    })
  ]

  const handleDeleteSubCategory = async()=>{
      try {
          const response = await Axios({
              ...SummaryApi.deleteSubCategory,
              data : deleteSubCategory
          })

          const { data : responseData } = response

          if(responseData.success){
             toast.success(responseData.message)
             fetchSubCategory()
             setOpenDeleteConfirmBox(false)
             setDeleteSubCategory({_id : ""})
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
              <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md'>
                <FaTags className='text-white text-lg' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Sub Categories</h1>
                <p className='text-sm text-gray-600'>
                  Organize products into detailed subcategories ({data.length} total)
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setOpenAddSubCategory(true)} 
              className='inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg'
            >
              <FaPlus className='text-sm' />
              <span>Add Sub Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className='p-6'>
        {!data.length && !loading ? (
          <div className='bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200'>
            <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <HiOutlineCollection className='text-3xl text-gray-400' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>No Sub Categories Found</h3>
            <p className='text-gray-600 mb-6'>
              Create subcategories to better organize your products
            </p>
            <button 
              onClick={() => setOpenAddSubCategory(true)}
              className='inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg'
            >
              <FaPlus className='text-sm' />
              <span>Add First Sub Category</span>
            </button>
          </div>
        ) : (
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
            {loading ? (
              <div className='p-12 text-center'>
                <div className='flex flex-col items-center gap-4'>
                  <LoadingSpinner size="xl" />
                  <p className='text-gray-600 font-medium'>Loading subcategories...</p>
                </div>
              </div>
            ) : (
              <div className='overflow-auto'>
                <DisplayTable
                  data={data}
                  column={column}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {openAddSubCategory && (
        <UploadSubCategoryModel 
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {ImageURL && (
        <ViewImage url={ImageURL} close={() => setImageURL("")}/>
      )}

      {openEdit && (
        <EditSubCategory 
          data={editData} 
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {openDeleteConfirmBox && (
        <CofirmBox 
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </div>
  )
}

export default SubCategoryPage