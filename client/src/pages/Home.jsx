import React, { useState, useEffect } from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { BsCart4, BsLightning, BsTruck, BsShield, BsStar, BsAward, BsHeart } from "react-icons/bs"
import { FaArrowRight, FaFire, FaGift, FaLeaf, FaClock, FaShoppingBag } from "react-icons/fa"
import { MdOutlineLocalOffer, MdTrendingUp, MdVerified, MdSecurity } from "react-icons/md"
import { IoSparkles, IoCheckmarkCircle } from "react-icons/io5"
import { HiOutlineCursorClick } from "react-icons/hi"

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
      icon: <BsLightning className='animate-bounce' />,
      features: ["🥬 Farm Fresh", "⚡ 30min Delivery", "🚚 Free Shipping"]
    },
    {
      title: "Best Prices Guaranteed",
      subtitle: "Save more with our exclusive deals and offers on premium quality products",
      highlight: "Up to 50% Off",
      bgGradient: "from-orange-500 via-red-500 to-pink-500",
      icon: <FaFire className='animate-pulse' />,
      features: ["💰 Best Prices", "🏷️ Daily Deals", "🎁 Special Offers"]
    },
    {
      title: "Premium Quality Products",
      subtitle: "Handpicked fresh products from trusted farmers and suppliers across Sri Lanka",
      highlight: "100% Fresh",
      bgGradient: "from-blue-500 via-purple-500 to-indigo-500",
      icon: <FaLeaf className='animate-bounce' />,
      features: ["✅ Quality Assured", "🌱 Organic Options", "📦 Safe Packaging"]
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50'>
      {/* Hero Section with Dynamic Slides */}
      <section className='relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 min-h-[90vh] flex items-center'>
        {/* Animated Background */}
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-black/30 to-transparent'></div>
          
          {/* Floating Elements - Better positioned to avoid overlap */}
          <div className='absolute top-10 left-10 w-20 h-20 lg:w-32 lg:h-32 bg-yellow-400/15 rounded-full animate-float blur-sm'></div>
          <div className='absolute top-20 right-16 w-16 h-16 lg:w-20 lg:h-20 bg-pink-400/20 rounded-full animate-float-delayed blur-sm'></div>
          <div className='absolute bottom-32 left-1/4 w-18 h-18 lg:w-24 lg:h-24 bg-blue-400/15 rounded-full animate-float blur-sm'></div>
          <div className='absolute bottom-40 right-12 w-12 h-12 lg:w-16 lg:h-16 bg-green-400/20 rounded-full animate-float-delayed blur-sm'></div>
          
          {/* Grid Pattern - Subtle */}
          <div className='absolute inset-0 opacity-5' 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               }}
          ></div>
        </div>
            
        {/* Hero Content */}
        <div className='relative z-20 w-full max-w-7xl mx-auto px-4 lg:px-8'>
          <div className='text-center'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 lg:px-6 py-2 lg:py-3 rounded-full mb-6 lg:mb-8 animate-fade-in'>
              <IoSparkles className='text-yellow-400 animate-pulse text-sm lg:text-base' />
              <span className='text-white/90 font-medium text-xs lg:text-base'>Sri Lanka's #1 Online Grocery Store</span>
              <BsAward className='text-yellow-400 text-sm lg:text-base' />
            </div>
            
            {/* Main Title */}
            <div className='relative mb-6 lg:mb-8'>
              <h1 className='text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black mb-4 lg:mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-fade-in drop-shadow-2xl leading-tight px-2'>
                Lanka Basket
              </h1>
              <div className='absolute -top-2 -right-2 lg:-top-4 lg:-right-4 text-xl lg:text-3xl xl:text-4xl animate-bounce'>
                🛒
              </div>
            </div>
            
            {/* Dynamic Slides Container - Fixed height to prevent overlap */}
            <div className='relative mx-auto max-w-4xl mb-8 lg:mb-12'>
              <div className='h-36 sm:h-32 lg:h-40 xl:h-48 overflow-hidden'>
                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 transform px-4 ${
                      index === currentSlide 
                        ? 'translate-y-0 opacity-100' 
                        : index < currentSlide 
                          ? '-translate-y-full opacity-0' 
                          : 'translate-y-full opacity-0'
                    }`}
                  >
                    <div className='text-center h-full flex flex-col justify-center'>
                      <h2 className='text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold mb-2 lg:mb-3 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent leading-tight'>
                        {slide.title}
                      </h2>
                      <p className='text-sm sm:text-base lg:text-xl text-white/90 mb-3 lg:mb-4 max-w-3xl mx-auto leading-relaxed'>
                        {slide.subtitle}
                      </p>
                      
                      {/* Features */}
                      <div className='flex items-center justify-center gap-2 lg:gap-4 mb-3 lg:mb-4 flex-wrap px-2'>
                        {slide.features.map((feature, idx) => (
                          <span key={idx} className='text-xs lg:text-sm bg-white/10 backdrop-blur-sm px-2 lg:px-3 py-1 rounded-full border border-white/20'>
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <div className='flex items-center justify-center gap-2 lg:gap-3 text-lg lg:text-2xl xl:text-3xl'>
                        <span className='text-yellow-400 animate-bounce'>
                          {slide.icon}
                        </span>
                        <span className='font-bold text-yellow-300 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent text-xl lg:text-3xl xl:text-4xl'>
                          {slide.highlight}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 mb-12 lg:mb-16 px-4'>
              <button 
                onClick={() => navigate('/search')}
                className='group relative bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 hover:from-green-600 hover:via-emerald-700 hover:to-green-800 text-white px-6 lg:px-8 xl:px-12 py-3 lg:py-4 xl:py-5 rounded-2xl font-bold text-base lg:text-lg xl:text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 lg:gap-3 w-full sm:w-auto max-w-xs sm:max-w-none overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                <BsCart4 className='group-hover:animate-bounce text-lg lg:text-2xl xl:text-3xl relative z-10' />
                <span className='relative z-10'>Start Shopping</span>
                <FaArrowRight className='group-hover:translate-x-1 transition-transform text-sm lg:text-lg xl:text-xl relative z-10' />
              </button>
              
              <button className='group relative border-2 border-white/40 hover:border-white/60 text-white hover:text-white px-6 lg:px-8 xl:px-12 py-3 lg:py-4 xl:py-5 rounded-2xl font-bold text-base lg:text-lg xl:text-xl hover:bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 flex items-center gap-2 lg:gap-3 w-full sm:w-auto max-w-xs sm:max-w-none'>
                <MdTrendingUp className='group-hover:animate-pulse text-lg lg:text-2xl xl:text-3xl' />
                View Offers
                <HiOutlineCursorClick className='group-hover:rotate-12 transition-transform text-sm lg:text-lg xl:text-xl' />
              </button>
            </div>

            {/* Enhanced Stats - Better organized grid */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 max-w-6xl mx-auto px-4'>
              {[
                { icon: <BsTruck className='text-2xl lg:text-3xl xl:text-4xl' />, value: "30 Min", label: "Fast Delivery", subtext: "Average delivery time", color: "from-blue-500 to-cyan-500" },
                { icon: <BsShield className='text-2xl lg:text-3xl xl:text-4xl' />, value: "100%", label: "Fresh Products", subtext: "Quality guarantee", color: "from-green-500 to-emerald-500" },
                { icon: <BsStar className='text-2xl lg:text-3xl xl:text-4xl' />, value: "5000+", label: "Products", subtext: "Wide selection", color: "from-yellow-500 to-orange-500" },
                { icon: <MdOutlineLocalOffer className='text-2xl lg:text-3xl xl:text-4xl' />, value: "50%", label: "Max Discount", subtext: "Daily deals", color: "from-purple-500 to-pink-500" }
              ].map((stat, index) => (
                <div key={index} className='group bg-white/95 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-4 lg:p-6 xl:p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center min-h-[120px] lg:min-h-[140px] xl:min-h-[160px] flex flex-col justify-center border border-white/20 hover-lift'>
                  <div className={`w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-gradient-to-r ${stat.color} rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 lg:mb-4 mx-auto group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                    <div className='text-white animate-pulse'>
                      {stat.icon}
                    </div>
                  </div>
                  <div className='text-lg lg:text-2xl xl:text-3xl font-black text-gray-900 mb-1 leading-tight'>{stat.value}</div>
                  <div className='text-xs lg:text-sm xl:text-base font-bold text-gray-700 mb-1'>{stat.label}</div>
                  <div className='text-xs lg:text-sm text-gray-500 font-medium'>{stat.subtext}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Modern & Minimal */}
      <section className='py-20 lg:py-32 bg-gray-50 relative overflow-hidden'>
        <div className='container mx-auto px-4 lg:px-8'>
          {/* Simplified Header */}
          <div className='text-center mb-16 lg:mb-24'>
            <div className='inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full mb-8 shadow-sm border border-gray-200'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span className='text-gray-700 font-medium text-sm lg:text-base'>Shop by Categories</span>
            </div>
            
            <h2 className='text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
              Everything You Need,
              <br />
              <span className='text-green-600'>All in One Place</span>
            </h2>
            <p className='text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto'>
              Discover fresh groceries, daily essentials, and premium products
            </p>
          </div>
          
          
          {/* Categories Grid - Clean Modern Cards */}
          <div className='max-w-6xl mx-auto mb-16'>
            {
              loadingCategory ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8'>
                  {new Array(12).fill(null).map((_, index) => (
                    <div key={index+"loadingcategory"}>
                      <div className='bg-white rounded-2xl p-6 min-h-[160px] shadow-sm animate-pulse border border-gray-100'>
                        <div className='w-16 h-16 mx-auto rounded-2xl mb-4 bg-gray-200'></div>
                        <div className='h-4 bg-gray-200 rounded mx-2'></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8'>
                  {categoryData.map((cat, index) => (
                    <div 
                      key={cat._id+"displayCategory"} 
                      className='group cursor-pointer animate-fade-in-up'
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}
                    >
                      <div className='bg-white rounded-2xl p-6 lg:p-8 min-h-[160px] lg:min-h-[180px] shadow-sm hover:shadow-lg border border-gray-100 hover:border-green-200 transition-all duration-300 group-hover:-translate-y-1'>
                        {/* Image Container */}
                        <div className='relative mb-4 lg:mb-6'>
                          <div className='w-16 h-16 lg:w-20 lg:h-20 mx-auto bg-gray-50 rounded-2xl p-3 lg:p-4 group-hover:bg-green-50 transition-colors duration-300 flex items-center justify-center'>
                            <img 
                              src={cat.image}
                              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                              alt={cat.name}
                            />
                          </div>
                        </div>
                        
                        {/* Category Name */}
                        <h3 className='text-sm lg:text-base font-semibold text-gray-900 text-center group-hover:text-green-600 transition-colors duration-300'>
                          {cat.name}
                        </h3>
                        
                        {/* Bottom Accent Line */}
                        <div className='mt-4 w-0 h-0.5 bg-green-500 mx-auto group-hover:w-full transition-all duration-300'></div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
          
          {/* Simple CTA */}
          <div className='text-center'>
            <button 
              onClick={() => navigate('/search')}
              className='group bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-3 mx-auto'
            >
              <span>Browse All Categories</span>
              <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
            </button>
            
            <p className='text-gray-500 text-sm mt-4 flex items-center justify-center gap-2'>
              <MdVerified className='text-green-500' />
              5000+ Products Available
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white relative'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full mb-6 border border-blue-200'>
              <MdVerified className='text-blue-600 animate-pulse' />
              <span className='text-blue-700 font-semibold text-sm lg:text-base'>Why Choose Us</span>
            </div>
            
            <h2 className='text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight'>
              Experience the
              <span className='block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
                Future of Shopping
              </span>
            </h2>
            <p className='text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              Discover why thousands of customers trust Lanka Basket for their daily grocery needs
            </p>
          </div>
          
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto'>
            {[
              {
                icon: <BsLightning className='text-4xl lg:text-5xl' />,
                title: "Lightning Fast Delivery",
                description: "Get your orders delivered within 30 minutes to your doorstep with our express delivery network",
                color: "from-yellow-400 to-orange-500",
                bgColor: "from-yellow-50 to-orange-50",
                benefits: ["30min delivery", "Real-time tracking", "Temperature controlled"]
              },
              {
                icon: <BsShield className='text-4xl lg:text-5xl' />,
                title: "100% Fresh Guarantee",
                description: "We ensure the highest quality and freshness for all our products with rigorous quality checks",
                color: "from-green-400 to-emerald-500",
                bgColor: "from-green-50 to-emerald-50",
                benefits: ["Quality assured", "Fresh guarantee", "Easy returns"]
              },
              {
                icon: <FaGift className='text-4xl lg:text-5xl' />,
                title: "Best Prices & Offers",
                description: "Enjoy competitive prices with exciting deals, discounts and loyalty rewards program",
                color: "from-purple-400 to-pink-500",
                bgColor: "from-purple-50 to-pink-50",
                benefits: ["Daily deals", "Loyalty rewards", "Bulk discounts"]
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`group bg-gradient-to-br ${feature.bgColor} rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 animate-fade-in-up border border-white/50 hover:border-green-200 hover-lift min-h-[320px] lg:min-h-[350px] flex flex-col`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-500 shadow-xl mx-auto`}>
                  <div className='text-white'>
                    {feature.icon}
                  </div>
                </div>
                
                <div className='text-center flex-1 flex flex-col justify-between'>
                  <div>
                    <h3 className='text-xl lg:text-2xl font-black text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300 leading-tight'>
                      {feature.title}
                    </h3>
                    <p className='text-gray-600 text-base lg:text-lg leading-relaxed mb-6'>
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className='space-y-2'>
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className='flex items-center justify-center gap-2 text-sm lg:text-base text-gray-700'>
                        <IoCheckmarkCircle className='text-green-500 text-lg flex-shrink-0' />
                        <span className='font-medium'>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust Indicators */}
          <div className='mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-12'>
            <div className='text-center mb-8'>
              <h3 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>Trusted by 50,000+ Customers</h3>
              <p className='text-gray-600 text-lg'>Join thousands of satisfied customers across Sri Lanka</p>
            </div>
            
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
              {[
                { icon: <MdSecurity className='text-2xl lg:text-3xl' />, label: "Secure Payments", value: "SSL Encrypted" },
                { icon: <BsHeart className='text-2xl lg:text-3xl' />, label: "Customer Love", value: "4.8★ Rating" },
                { icon: <FaClock className='text-2xl lg:text-3xl' />, label: "24/7 Support", value: "Always Here" },
                { icon: <MdVerified className='text-2xl lg:text-3xl' />, label: "Verified Quality", value: "100% Authentic" }
              ].map((trust, index) => (
                <div key={index} className='text-center group'>
                  <div className='w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                    <div className='text-white animate-pulse'>
                      {trust.icon}
                    </div>
                  </div>
                  <h4 className='font-bold text-gray-900 text-sm lg:text-base mb-1'>{trust.label}</h4>
                  <p className='text-gray-600 text-xs lg:text-sm font-medium'>{trust.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className='py-16 lg:py-20 bg-white'>
        <div className='container mx-auto px-4 lg:px-8'>
          {categoryData?.map((c, index)=>{
            return(
              <div 
                key={c?._id+"CategorywiseProduct"} 
                className={`mb-12 lg:mb-16 animate-fade-in-up`}
                style={{ animationDelay: `${index * 150}ms` }}
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
      <section className='py-16 lg:py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-black/20'></div>
          {/* Complex animated shapes - Better positioned */}
          <div className='absolute top-0 left-0 w-64 h-64 lg:w-96 lg:h-96 bg-white/8 rounded-full -translate-x-32 -translate-y-32 lg:-translate-x-48 lg:-translate-y-48 animate-float'></div>
          <div className='absolute bottom-0 right-0 w-48 h-48 lg:w-80 lg:h-80 bg-white/8 rounded-full translate-x-24 translate-y-24 lg:translate-x-40 lg:translate-y-40 animate-float-delayed'></div>
          <div className='absolute top-1/2 left-1/2 w-32 h-32 lg:w-64 lg:h-64 bg-white/5 rounded-full -translate-x-16 -translate-y-16 lg:-translate-x-32 lg:-translate-y-32 animate-float'></div>
          
          {/* Grid overlay */}
          <div className='absolute inset-0 opacity-5' 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-10 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm20 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z'/%3E%3C/g%3E%3C/svg%3E")`,
               }}
          ></div>
        </div>
        
        <div className='container mx-auto px-4 lg:px-8 relative z-20'>
          <div className='max-w-5xl mx-auto text-center text-white'>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 lg:px-6 py-2 lg:py-3 rounded-full mb-6 lg:mb-8'>
              <IoSparkles className='text-yellow-400 animate-pulse text-sm lg:text-base' />
              <span className='font-semibold text-sm lg:text-base'>Stay Updated</span>
            </div>
            
            <h2 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 lg:mb-6 leading-tight px-2'>
              Get Fresh Deals
              <span className='block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent mt-2'>
                Delivered Daily!
              </span>
            </h2>
            <p className='text-lg lg:text-xl xl:text-2xl text-white/90 mb-8 lg:mb-12 px-4 max-w-3xl mx-auto leading-relaxed'>
              Subscribe to our newsletter and never miss out on amazing offers, fresh arrivals, and exclusive member benefits
            </p>
            
            <div className='bg-white/10 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-6 lg:p-8 xl:p-10 border border-white/20 max-w-3xl mx-auto mb-8 lg:mb-12'>
              <div className='flex flex-col sm:flex-row items-center gap-4 lg:gap-6'>
                <div className='flex-1 w-full'>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className='w-full px-4 lg:px-6 py-3 lg:py-4 xl:py-5 rounded-xl lg:rounded-2xl border-0 focus:ring-4 focus:ring-white/30 outline-none text-gray-900 text-base lg:text-lg xl:text-xl font-medium shadow-lg backdrop-blur-sm'
                  />
                </div>
                <button className='group bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-gray-900 px-6 lg:px-8 py-3 lg:py-4 xl:py-5 rounded-xl lg:rounded-2xl font-bold text-base lg:text-lg xl:text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto whitespace-nowrap'>
                  <span>Subscribe</span>
                  <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                </button>
              </div>
              
              <div className='flex items-center justify-center gap-4 lg:gap-6 mt-4 lg:mt-6 text-white/80 text-sm lg:text-base flex-wrap'>
                <div className='flex items-center gap-2'>
                  <IoCheckmarkCircle className='text-green-400 text-base lg:text-lg' />
                  <span>No spam</span>
                </div>
                <div className='flex items-center gap-2'>
                  <IoCheckmarkCircle className='text-green-400 text-base lg:text-lg' />
                  <span>Unsubscribe anytime</span>
                </div>
                <div className='flex items-center gap-2'>
                  <IoCheckmarkCircle className='text-green-400 text-base lg:text-lg' />
                  <span>Weekly deals</span>
                </div>
              </div>
            </div>
            
            {/* Social Proof */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto'>
              {[
                { value: "50K+", label: "Happy Customers", icon: <BsHeart className='text-red-400' /> },
                { value: "1M+", label: "Orders Delivered", icon: <BsTruck className='text-blue-400' /> },
                { value: "500+", label: "5-Star Reviews", icon: <BsStar className='text-yellow-400' /> }
              ].map((stat, index) => (
                <div key={index} className='bg-white/10 backdrop-blur-md rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300'>
                  <div className='flex items-center justify-center gap-2 lg:gap-3 mb-2'>
                    <div className='text-lg lg:text-xl'>
                      {stat.icon}
                    </div>
                    <span className='text-xl lg:text-2xl xl:text-3xl font-black'>{stat.value}</span>
                  </div>
                  <p className='text-white/80 font-medium text-sm lg:text-base'>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home