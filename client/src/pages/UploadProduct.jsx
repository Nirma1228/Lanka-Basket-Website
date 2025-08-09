import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt, FaImage, FaBoxOpen, FaTags, FaPlus } from "react-icons/fa"
import { MdDelete, MdClose, MdDescription } from "react-icons/md"
import { HiOutlineCurrencyDollar, HiOutlineCollection } from "react-icons/hi"
import { IoClose } from "react-icons/io5"
import uploadImage from '../utils/UploadImage'
import ViewImage from '../components/ViewImage'
import { useSelector } from 'react-redux'
import AddFieldComponent from '../components/AddFieldComponent'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import successAlert from '../utils/SuccessAlert'
import LoadingSpinner from '../components/LoadingSpinner'

const UploadProduct = () => {
  const [data,setData] = useState({
      name : "",
      image : [],
      category : [],
      subCategory : [],
      unit : "",
      stock : "",
      price : "",
      discount : "",
      description : "",
      more_details : {},
  })
  const [imageLoading,setImageLoading] = useState(false)
  const [ViewImageURL,setViewImageURL] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory,setSelectCategory] = useState("")
  const [selectSubCategory,setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField,setOpenAddField] = useState(false)
  const [fieldName,setFieldName] = useState("")


  const handleChange = (e)=>{
    const { name, value} = e.target 

    setData((preve)=>{
      return{
          ...preve,
          [name]  : value
      }
    })
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    if(!file){
      return 
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data : ImageResponse } = response
    const imageUrl = ImageResponse.data.url 

    setData((preve)=>{
      return{
        ...preve,
        image : [...preve.image,imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async(index)=>{
      data.image.splice(index,1)
      setData((preve)=>{
        return{
            ...preve
        }
      })
  }

  const handleRemoveCategory = async(index)=>{
    data.category.splice(index,1)
    setData((preve)=>{
      return{
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async(index)=>{
      data.subCategory.splice(index,1)
      setData((preve)=>{
        return{
          ...preve
        }
      })
  }

  const handleAddField = ()=>{
    setData((preve)=>{
      return{
          ...preve,
          more_details : {
            ...preve.more_details,
            [fieldName] : ""
          }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    setSubmitLoading(true)
    console.log("data",data)

    try {
      const response = await Axios({
          ...SummaryApi.createProduct,
          data : data
      })
      const { data : responseData} = response

      if(responseData.success){
          successAlert(responseData.message)
          setData({
            name : "",
            image : [],
            category : [],
            subCategory : [],
            unit : "",
            stock : "",
            price : "",
            discount : "",
            description : "",
            more_details : {},
          })

      }
    } catch (error) {
        AxiosToastError(error)
    } finally {
        setSubmitLoading(false)
    }
  }

  // useEffect(()=>{
  //   successAlert("Upload successfully")
  // },[])
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Modern Header */}
      <div className='bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700'>
        <div className='px-6 py-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md'>
              <FaBoxOpen className='text-white text-lg' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Add New Product</h1>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Create a new product listing with detailed information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className='p-6 max-w-4xl mx-auto'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700'>
          <form className='p-8 space-y-8' onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className='space-y-6'>
              <div className='flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700'>
                <MdDescription className='text-xl text-blue-600 dark:text-blue-400' />
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Basic Information</h2>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label htmlFor='name' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Product Name *
                  </label>
                  <input 
                    id='name'
                    type='text'
                    placeholder='Enter product name'
                    name='name'
                    value={data.name}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='unit' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Unit *
                  </label>
                  <input 
                    id='unit'
                    type='text'
                    placeholder='e.g., kg, pieces, liters'
                    name='unit'
                    value={data.unit}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='description' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Description *
                </label>
                <textarea 
                  id='description'
                  placeholder='Describe your product in detail...'
                  name='description'
                  value={data.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none'
                />
              </div>
            </div>

            {/* Images Section */}
            <div className='space-y-6'>
              <div className='flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700'>
                <FaImage className='text-xl text-purple-600 dark:text-purple-400' />
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Product Images</h2>
              </div>

              <div className='space-y-4'>
                <label htmlFor='productImage' className='block bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 group'>
                  <div className='flex flex-col items-center gap-3'>
                    {imageLoading ? (
                      <div className='flex flex-col items-center gap-2'>
                        <LoadingSpinner size="lg" />
                        <p className='text-gray-600 dark:text-gray-300 font-medium'>Uploading image...</p>
                      </div>
                    ) : (
                      <>
                        <div className='w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors duration-200'>
                          <FaCloudUploadAlt className='text-2xl text-green-600 dark:text-green-400' />
                        </div>
                        <div>
                          <p className='font-semibold text-gray-900 dark:text-white'>Click to upload images</p>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>PNG, JPG, JPEG up to 10MB</p>
                        </div>
                      </>
                    )}
                  </div>
                  <input 
                    type='file'
                    id='productImage'
                    className='hidden'
                    accept='image/*'
                    onChange={handleUploadImage}
                  />
                </label>

                {data.image.length > 0 && (
                  <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4'>
                    {data.image.map((img, index) => (
                      <div key={img + index} className='relative group bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600'>
                        <div className='aspect-square'>
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            className='w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200' 
                            onClick={() => setViewImageURL(img)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)} 
                          className='absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md'
                        >
                          <MdDelete className='text-sm' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Categories Section */}
            <div className='space-y-6'>
              <div className='flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700'>
                <FaTags className='text-xl text-orange-600 dark:text-orange-400' />
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Categories & Classification</h2>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>Categories</label>
                  <select
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-gray-900 dark:text-white'
                    value={selectCategory}
                    onChange={(e) => {
                      const value = e.target.value 
                      const category = allCategory.find(el => el._id === value)
                      
                      setData((preve) => ({
                        ...preve,
                        category: [...preve.category, category],
                      }))
                      setSelectCategory("")
                    }}
                  >
                    <option value="">Select Category</option>
                    {allCategory.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  
                  {data.category.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {data.category.map((c, index) => (
                        <div key={c._id + index} className='inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-2 rounded-lg text-sm border border-blue-200 dark:border-blue-800'>
                          <span>{c.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(index)}
                            className='hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200'
                          >
                            <IoClose size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className='space-y-4'>
                  <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>Sub Categories</label>
                  <select
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-gray-900 dark:text-white'
                    value={selectSubCategory}
                    onChange={(e) => {
                      const value = e.target.value 
                      const subCategory = allSubCategory.find(el => el._id === value)

                      setData((preve) => ({
                        ...preve,
                        subCategory: [...preve.subCategory, subCategory]
                      }))
                      setSelectSubCategory("")
                    }}
                  >
                    <option value="">Select Sub Category</option>
                    {allSubCategory.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  
                  {data.subCategory.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {data.subCategory.map((c, index) => (
                        <div key={c._id + index} className='inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-2 rounded-lg text-sm border border-purple-200 dark:border-purple-800'>
                          <span>{c.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubCategory(index)}
                            className='hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200'
                          >
                            <IoClose size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Stock Section */}
            <div className='space-y-6'>
              <div className='flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700'>
                <HiOutlineCurrencyDollar className='text-xl text-green-600 dark:text-green-400' />
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Pricing & Stock</h2>
              </div>

              <div className='grid md:grid-cols-3 gap-6'>
                <div className='space-y-2'>
                  <label htmlFor='price' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Price *
                  </label>
                  <input 
                    id='price'
                    type='number'
                    placeholder='0.00'
                    name='price'
                    value={data.price}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='discount' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Discount (%)
                  </label>
                  <input 
                    id='discount'
                    type='number'
                    placeholder='0'
                    name='discount'
                    value={data.discount}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='stock' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Stock Quantity *
                  </label>
                  <input 
                    id='stock'
                    type='number'
                    placeholder='0'
                    name='stock'
                    value={data.stock}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                  />
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className='space-y-6'>
              <div className='flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700'>
                <HiOutlineCollection className='text-xl text-indigo-600 dark:text-indigo-400' />
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Additional Details</h2>
              </div>

              <div className='space-y-4'>
                {Object.keys(data.more_details).map((k, index) => (
                  <div key={k + index} className='space-y-2'>
                    <label htmlFor={k} className='block text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize'>
                      {k.replace('_', ' ')}
                    </label>
                    <input 
                      id={k}
                      type='text'
                      value={data.more_details[k]}
                      onChange={(e) => {
                        const value = e.target.value 
                        setData((preve) => ({
                          ...preve,
                          more_details: {
                            ...preve.more_details,
                            [k]: value
                          }
                        }))
                      }}
                      className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setOpenAddField(true)} 
                  className='inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium transition-all duration-200 border border-gray-300 dark:border-gray-600'
                >
                  <FaPlus className='text-sm' />
                  <span>Add Custom Field</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className='pt-8 border-t border-gray-200 dark:border-gray-700'>
              <button
                type="submit"
                disabled={submitLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                  submitLoading 
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {submitLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <LoadingSpinner size="sm" color="white" />
                    <span>Creating Product...</span>
                  </div>
                ) : (
                  <div className='flex items-center justify-center gap-2'>
                    <FaBoxOpen className='text-lg' />
                    <span>Create Product</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modals */}
      {ViewImageURL && (
        <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
      )}

      {openAddField && (
        <AddFieldComponent 
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)} 
        />
      )}
    </div>
  )
}

export default UploadProduct