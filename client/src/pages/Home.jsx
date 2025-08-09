import React, { useState, useEffect } from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { BsCart4, BsLightning, BsTruck, BsShield, BsStar } from "react-icons/bs"
import { FaArrowRight, FaFire, FaGift, FaLeaf } from "react-icons/fa"
import { MdOutlineLocalOffer, MdTrendingUp } from "react-icons/md"
import { IoSparkles } from "react-icons/io5"

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    // Auto-slide for hero section
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(slideInterval)
  }, [])

  const handleRedirectProductListpage = (id,cat)=>{
      console.log(id,cat)
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

      navigate(url)
      console.log(url)
  }

  const heroSlides = [
    {
      title: "Fresh Groceries Delivered",
      subtitle: "Get fresh vegetables, fruits & daily essentials delivered to your doorstep",
      highlight: "Within 30 Minutes",
      bgGradient: "from-green-500 via-emerald-500 to-teal-500",
      icon: <BsLightning className="animate-bounce" />
    },
    {
      title: "Best Prices Guaranteed",
      subtitle: "Save more with our exclusive deals and offers on premium quality products",
      highlight: "Up to 50% Off",
      bgGradient: "from-orange-500 via-red-500 to-pink-500",
      icon: <FaFire className="animate-pulse" />
    },
    {
      title: "Premium Quality Products",
      subtitle: "Handpicked fresh products from trusted farmers and suppliers across Sri Lanka",
      highlight: "100% Fresh",
      bgGradient: "from-blue-500 via-purple-500 to-indigo-500",
      icon: <FaLeaf className="animate-bounce" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section with Dynamic Slides */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700 min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300/20 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-20 h-20 bg-pink-300/20 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full animate-float"></div>
          <div className="absolute bottom-32 right-10 w-16 h-16 bg-purple-300/20 rounded-full animate-float-delayed"></div>
        </div>
            
        {/* Hero Content */}
        <div className='relative z-10 max-w-6xl mx-auto px-4'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 px-4 py-2 rounded-full mb-6 animate-pulse'>
              <IoSparkles className="text-green-600 dark:text-green-400" />
              <span className='text-green-700 dark:text-green-300 font-medium text-sm'>Sri Lanka's #1 Online Grocery Store</span>
            </div>
            
            <h1 className='text-4xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-fade-in drop-shadow-lg'>
              Lanka Basket
            </h1>
            
            <div className='relative h-28 lg:h-36 mb-8 overflow-hidden'>
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 transform ${
                    index === currentSlide 
                      ? 'translate-y-0 opacity-100' 
                      : index < currentSlide 
                        ? '-translate-y-full opacity-0' 
                        : 'translate-y-full opacity-0'
                  }`}
                >
                  <div className='text-center'>
                    <h2 className='text-2xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent'>
                      {slide.title}
                    </h2>
                    <p className='text-base lg:text-xl text-white/90 mb-3 px-4'>
                      {slide.subtitle}
                    </p>
                    <div className='flex items-center justify-center gap-2 text-xl lg:text-2xl'>
                      <span className='text-yellow-400 animate-bounce'>
                        {slide.icon}
                      </span>
                      <span className='font-bold text-yellow-300 bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full'>
                        {slide.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 px-4'>
              <button 
                onClick={() => navigate('/search')}
                className='group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto'
              >
                <BsCart4 className="group-hover:animate-bounce text-lg lg:text-xl" />
                Start Shopping
                <FaArrowRight className="group-hover:translate-x-1 transition-transform text-sm lg:text-base" />
              </button>
              
              <button className='group border-2 border-white/30 hover:border-white/50 text-white hover:text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg hover:bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto'>
                <MdTrendingUp className="group-hover:animate-pulse text-lg lg:text-xl" />
                View Offers
              </button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto px-4'>
              {[
                { icon: <BsTruck className="text-2xl lg:text-3xl" />, value: "30 Min", label: "Fast Delivery" },
                { icon: <BsShield className="text-2xl lg:text-3xl" />, value: "100%", label: "Fresh Products" },
                { icon: <BsStar className="text-2xl lg:text-3xl" />, value: "5000+", label: "Products" },
                { icon: <MdOutlineLocalOffer className="text-2xl lg:text-3xl" />, value: "Up to 50%", label: "Discount" }
              ].map((stat, index) => (
                <div key={index} className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center min-h-[120px] flex flex-col justify-center'>
                  <div className='text-green-600 dark:text-green-400 mb-2 flex justify-center animate-pulse'>
                    {stat.icon}
                  </div>
                  <div className='text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 leading-tight'>{stat.value}</div>
                  <div className='text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium'>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-20 -left-20 w-40 h-40 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-float'></div>
          <div className='absolute -top-10 -right-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-float-delayed'></div>
          <div className='absolute -bottom-20 left-1/4 w-36 h-36 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-20 animate-float'></div>
          <div className='absolute -bottom-10 -right-20 w-28 h-28 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 animate-float-delayed'></div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-16 bg-white dark:bg-gray-800'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Shop by Categories
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Discover fresh groceries, daily essentials, and premium products across all categories
            </p>
          </div>
          
          <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4'>
            {
              loadingCategory ? (
                new Array(12).fill(null).map((c, index)=>{
                  return(
                    <div key={index+"loadingcategory"} className='group'>
                      <div className='bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 min-h-40 shadow-md animate-pulse hover:shadow-xl transform hover:scale-105 transition-all duration-300'>
                        <div className='bg-gray-300 dark:bg-gray-500 w-16 h-16 mx-auto rounded-xl mb-4 animate-pulse'></div>
                        <div className='bg-gray-300 dark:bg-gray-500 h-6 rounded-lg animate-pulse'></div>
                      </div>
                    </div>
                  )
                })
              ) : (
                categoryData.map((cat, index)=>{
                  return(
                    <div 
                      key={cat._id+"displayCategory"} 
                      className={`group cursor-pointer transform hover:scale-105 transition-all duration-300 animate-fade-in-up`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}
                    >
                      <div className='bg-white dark:bg-gray-700 rounded-2xl p-4 min-h-40 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-green-200 dark:hover:border-green-400'>
                        <div className='relative overflow-hidden rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300'>
                          <img 
                            src={cat.image}
                            className='w-full h-20 object-cover mx-auto'
                            alt={cat.name}
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        </div>
                        <h3 className='text-sm font-medium text-gray-900 dark:text-white text-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300'>
                          {cat.name}
                        </h3>
                      </div>
                    </div>
                  )
                })
              )
            }
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Why Choose Lanka Basket?
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300'>
              Experience the best online grocery shopping with these amazing benefits
            </p>
          </div>
          
          <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            {[
              {
                icon: <BsLightning className="text-4xl text-yellow-500 animate-pulse" />,
                title: "Lightning Fast Delivery",
                description: "Get your orders delivered within 30 minutes to your doorstep",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: <BsShield className="text-4xl text-green-500 animate-bounce" />,
                title: "100% Fresh Guarantee",
                description: "We ensure the highest quality and freshness for all our products",
                color: "from-green-400 to-emerald-500"
              },
              {
                icon: <FaGift className="text-4xl text-purple-500 animate-pulse" />,
                title: "Best Prices & Offers",
                description: "Enjoy competitive prices with exciting deals and discounts",
                color: "from-purple-400 to-pink-500"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 animate-fade-in-up border dark:border-gray-700 hover:border-green-200 dark:hover:border-green-400`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4 text-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 text-center leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className='py-16 bg-white dark:bg-gray-800'>
        <div className='container mx-auto px-4'>
          {categoryData?.map((c, index)=>{
            return(
              <div 
                key={c?._id+"CategorywiseProduct"} 
                className={`mb-16 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CategoryWiseProductDisplay 
                  id={c?._id} 
                  name={c?.name}
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-black/20'></div>
          {/* Animated shapes */}
          <div className='absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-36 -translate-y-36 animate-float'></div>
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48 animate-float-delayed'></div>
        </div>
        
        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-4xl mx-auto text-center text-white'>
            <h2 className='text-3xl lg:text-5xl font-bold mb-6'>
              Get Fresh Deals Daily!
            </h2>
            <p className='text-xl mb-8 opacity-90'>
              Subscribe to our newsletter and never miss out on amazing offers and fresh arrivals
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto'>
              <input
                type="email"
                placeholder="Enter your email"
                className='flex-1 px-6 py-4 rounded-xl border-0 focus:ring-4 focus:ring-white/30 outline-none text-gray-900 text-lg'
              />
              <button className='bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg'>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home