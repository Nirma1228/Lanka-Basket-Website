import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft, FaHeart, FaShare, FaStar, FaShieldAlt, FaTruck, FaUndo, FaHeadset } from "react-icons/fa"
import { MdLocalOffer, MdZoomIn, MdClose, MdChevronRight } from "react-icons/md"
import { HiOutlineBadgeCheck } from "react-icons/hi"
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import CardProduct from '../components/CardProduct'
import LoadingSpinner from '../components/LoadingSpinner'

const ProductDisplayPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    price: 0,
    discount: 0,
    stock: 0,
    description: "",
    unit: "",
    more_details: {}
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [similarProducts, setSimilarProducts] = useState([])
  const [similarLoading, setSimilarLoading] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const imageContainer = useRef()

  const discountPrice = pricewithDiscount(data.price, data.discount)
  const savings = data.price - discountPrice

  const fetchProductDetails = async() => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId 
        }
      })

      const { data: responseData } = response

      if(responseData.success) {
        setData(responseData.data)
        // Fetch similar products after getting product details
        if(responseData.data.category && responseData.data.category.length > 0) {
          fetchSimilarProducts(responseData.data.category[0]._id, productId)
        }
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarProducts = async(categoryId, currentProductId) => {
    try {
      setSimilarLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          categoryId: categoryId,
          page: 1,
          limit: 8
        }
      })

      const { data: responseData } = response

      if(responseData.success) {
        // Filter out current product and limit to 6 items
        const filteredProducts = responseData.data
          .filter(product => product._id !== currentProductId)
          .slice(0, 6)
        setSimilarProducts(filteredProducts)
      }
    } catch (error) {
      console.error('Error fetching similar products:', error)
    } finally {
      setSimilarLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])
  
  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }
  
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }

  const openImageModal = (index) => {
    setSelectedImageIndex(index)
    setIsImageModalOpen(true)
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev < data.image.length - 1 ? prev + 1 : 0
    )
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev > 0 ? prev - 1 : data.image.length - 1
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <LoadingSpinner size="xl" />
          <p className='mt-4 text-gray-600 dark:text-gray-300'>Loading product details...</p>
        </div>
      </div>
    )
  }
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Breadcrumb */}
      <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30'>
        <div className='container mx-auto px-4 py-3'>
          <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300'>
            <button 
              onClick={() => navigate('/')}
              className='hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200'
            >
              Home
            </button>
            <MdChevronRight />
            {data.category && data.category[0] && (
              <>
                <span className='hover:text-green-600 dark:hover:text-green-400 cursor-pointer transition-colors duration-200'>
                  {data.category[0].name}
                </span>
                <MdChevronRight />
              </>
            )}
            <span className='text-gray-900 dark:text-white font-medium truncate'>{data.name}</span>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12'>
          {/* Image Section */}
          <div className='space-y-4'>
            {/* Main Image */}
            <div className='relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg'>
              <div className='aspect-square lg:aspect-[4/3] p-6 flex items-center justify-center'>
                <img
                  src={data.image[image]}
                  alt={data.name}
                  className='w-full h-full object-contain cursor-zoom-in hover:scale-105 transition-transform duration-300'
                  onClick={() => openImageModal(image)}
                />
                
                {/* Zoom button */}
                <button
                  onClick={() => openImageModal(image)}
                  className='absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200 shadow-lg'
                >
                  <MdZoomIn className='text-xl text-gray-700 dark:text-gray-300' />
                </button>

                {/* Discount badge */}
                {data.discount > 0 && (
                  <div className='absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse'>
                    <MdLocalOffer className='inline mr-1' />
                    {data.discount}% OFF
                  </div>
                )}
              </div>

              {/* Image indicators */}
              <div className='flex items-center justify-center gap-2 pb-4'>
                {data.image.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === image 
                        ? 'bg-green-600 w-8' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className='relative'>
              <div 
                ref={imageContainer} 
                className='flex gap-3 overflow-x-auto scrollbar-none pb-2'
              >
                {data.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                      index === image 
                        ? 'border-green-500 shadow-lg' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${data.name} ${index + 1}`}
                      className='w-full h-full object-contain bg-white dark:bg-gray-800 p-1'
                    />
                  </button>
                ))}
              </div>
              
              {/* Scroll buttons */}
              {data.image.length > 4 && (
                <div className='absolute inset-y-0 flex items-center justify-between w-full pointer-events-none'>
                  <button
                    onClick={handleScrollLeft}
                    className='pointer-events-auto bg-white dark:bg-gray-800 shadow-lg p-2 rounded-full hover:scale-110 transition-transform duration-200 -ml-4'
                  >
                    <FaAngleLeft className='text-gray-600 dark:text-gray-300' />
                  </button>
                  <button
                    onClick={handleScrollRight}
                    className='pointer-events-auto bg-white dark:bg-gray-800 shadow-lg p-2 rounded-full hover:scale-110 transition-transform duration-200 -mr-4'
                  >
                    <FaAngleRight className='text-gray-600 dark:text-gray-300' />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className='space-y-6'>
            {/* Product Title and Actions */}
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <h1 className='text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight'>
                  {data.name}
                </h1>
                <p className='text-gray-600 dark:text-gray-400 mt-1 font-medium'>{data.unit}</p>
                
                {/* Mock rating */}
                <div className='flex items-center gap-3 mt-2'>
                  <div className='flex text-yellow-400'>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className='text-sm' />
                    ))}
                  </div>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>(4.5) • 127 reviews</span>
                </div>
              </div>
              
              <div className='flex gap-2'>
                <button className='p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'>
                  <FaHeart className='text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400' />
                </button>
                <button className='p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'>
                  <FaShare className='text-gray-600 dark:text-gray-400' />
                </button>
              </div>
            </div>

            {/* Price Section */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm'>
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {DisplayPriceInRupees(discountPrice)}
                  </div>
                  {data.discount > 0 && (
                    <div className='text-lg text-gray-500 line-through'>
                      {DisplayPriceInRupees(data.price)}
                    </div>
                  )}
                  {data.discount > 0 && (
                    <div className='bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold'>
                      {data.discount}% OFF
                    </div>
                  )}
                </div>
                
                {savings > 0 && (
                  <p className='text-green-600 dark:text-green-400 font-medium'>
                    You save {DisplayPriceInRupees(savings)}!
                  </p>
                )}
                
                {/* Stock status */}
                <div className='flex items-center gap-2'>
                  {data.stock > 0 ? (
                    <div className='flex items-center gap-2 text-green-600 dark:text-green-400'>
                      <HiOutlineBadgeCheck className='text-lg' />
                      <span className='font-medium'>In Stock ({data.stock} available)</span>
                    </div>
                  ) : (
                    <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
                      <span className='font-medium'>Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className='space-y-4'>
              {data.stock > 0 ? (
                <div className='flex gap-4'>
                  <div className='flex-1'>
                    <AddToCartButton data={data} />
                  </div>
                </div>
              ) : (
                <button className='w-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 py-4 rounded-xl font-semibold cursor-not-allowed'>
                  Out of Stock
                </button>
              )}
            </div>

            {/* Features */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700'>
                <FaTruck className='text-green-600 dark:text-green-400 text-xl' />
                <div>
                  <div className='font-semibold text-gray-900 dark:text-white text-sm'>Fast Delivery</div>
                  <div className='text-xs text-gray-600 dark:text-gray-400'>30 mins</div>
                </div>
              </div>
              <div className='flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700'>
                <FaShieldAlt className='text-blue-600 dark:text-blue-400 text-xl' />
                <div>
                  <div className='font-semibold text-gray-900 dark:text-white text-sm'>100% Fresh</div>
                  <div className='text-xs text-gray-600 dark:text-gray-400'>Quality</div>
                </div>
              </div>
              <div className='flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700'>
                <FaUndo className='text-orange-600 dark:text-orange-400 text-xl' />
                <div>
                  <div className='font-semibold text-gray-900 dark:text-white text-sm'>Easy Returns</div>
                  <div className='text-xs text-gray-600 dark:text-gray-400'>7 days</div>
                </div>
              </div>
              <div className='flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700'>
                <FaHeadset className='text-purple-600 dark:text-purple-400 text-xl' />
                <div>
                  <div className='font-semibold text-gray-900 dark:text-white text-sm'>Support</div>
                  <div className='text-xs text-gray-600 dark:text-gray-400'>24/7</div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Product Details</h3>
              
              <div className='space-y-3'>
                <div>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Description</h4>
                  <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{data.description}</p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Unit</h4>
                  <p className='text-gray-600 dark:text-gray-300'>{data.unit}</p>
                </div>
                
                {/* Additional details */}
                {data.more_details && Object.keys(data.more_details).map((key) => (
                  <div key={key}>
                    <h4 className='font-semibold text-gray-900 dark:text-white mb-2 capitalize'>
                      {key.replace('_', ' ')}
                    </h4>
                    <p className='text-gray-600 dark:text-gray-300'>{data.more_details[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className='mt-16'>
            <div className='flex items-center justify-between mb-8'>
              <h2 className='text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white'>
                Similar Products
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                You might also like these items
              </p>
            </div>

            {similarLoading ? (
              <div className='flex justify-center py-12'>
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
                {similarProducts.map((product) => (
                  <div key={product._id} className='transform hover:scale-105 transition-transform duration-200'>
                    <CardProduct data={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='relative max-w-4xl max-h-full'>
            <button
              onClick={closeImageModal}
              className='absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors duration-200'
            >
              <MdClose className='text-xl' />
            </button>
            
            <img
              src={data.image[selectedImageIndex]}
              alt={data.name}
              className='max-w-full max-h-full object-contain rounded-xl'
            />
            
            {data.image.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors duration-200'
                >
                  <FaAngleLeft className='text-xl' />
                </button>
                <button
                  onClick={nextImage}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors duration-200'
                >
                  <FaAngleRight className='text-xl' />
                </button>
              </>
            )}
            
            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
              {data.image.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === selectedImageIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDisplayPage
