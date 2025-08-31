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
      <section className='relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 min-h-[85vh] flex items-center'>
        {/* Animated Background */}
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-black/30 to-transparent'></div>
          
          {/* Floating Elements */}
          <div className='absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full animate-float blur-sm'></div>
          <div className='absolute top-32 right-20 w-20 h-20 bg-pink-400/30 rounded-full animate-float-delayed blur-sm'></div>
          <div className='absolute bottom-20 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full animate-float blur-sm'></div>
          <div className='absolute bottom-32 right-10 w-16 h-16 bg-green-400/30 rounded-full animate-float-delayed blur-sm'></div>
          
          {/* Grid Pattern */}
          <div className='absolute inset-0 opacity-10' 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               }}
          ></div>
        </div>
            
        {/* Hero Content */}
        <div className='relative z-10 max-w-7xl mx-auto px-4 w-full'>
          <div className='text-center mb-12'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full mb-8 animate-fade-in'>
              <IoSparkles className='text-yellow-400 animate-pulse' />
              <span className='text-white/90 font-medium text-sm lg:text-base'>Sri Lanka's #1 Online Grocery Store</span>
              <BsAward className='text-yellow-400' />
            </div>
            
            {/* Main Title */}
            <div className='relative mb-8'>
              <h1 className='text-5xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-fade-in drop-shadow-2xl leading-tight'>
                Lanka Basket
              </h1>
              <div className='absolute -top-4 -right-4 lg:-top-8 lg:-right-8 text-2xl lg:text-4xl animate-bounce'>
                🛒
              </div>
            </div>
            
            {/* Dynamic Slides */}
            <div className='relative h-32 lg:h-40 mb-10 overflow-hidden'>
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
                    <h2 className='text-2xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent leading-tight'>
                      {slide.title}
                    </h2>
                    <p className='text-base lg:text-xl text-white/90 mb-4 px-4 max-w-3xl mx-auto leading-relaxed'>
                      {slide.subtitle}
                    </p>
                    
                    {/* Features */}
                    <div className='flex items-center justify-center gap-4 mb-4 flex-wrap'>
                      {slide.features.map((feature, idx) => (
                        <span key={idx} className='text-sm lg:text-base bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20'>
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className='flex items-center justify-center gap-3 text-xl lg:text-3xl'>
                      <span className='text-yellow-400 animate-bounce'>
                        {slide.icon}
                      </span>
                      <span className='font-bold text-yellow-300 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent text-2xl lg:text-4xl'>
                        {slide.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 px-4'>
              <button 
                onClick={() => navigate('/search')}
                className='group relative bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 hover:from-green-600 hover:via-emerald-700 hover:to-green-800 text-white px-8 lg:px-12 py-4 lg:py-5 rounded-2xl font-bold text-lg lg:text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 w-full sm:w-auto overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                <BsCart4 className='group-hover:animate-bounce text-2xl lg:text-3xl relative z-10' />
                <span className='relative z-10'>Start Shopping</span>
                <FaArrowRight className='group-hover:translate-x-1 transition-transform text-lg lg:text-xl relative z-10' />
              </button>
              
              <button className='group relative border-2 border-white/40 hover:border-white/60 text-white hover:text-white px-8 lg:px-12 py-4 lg:py-5 rounded-2xl font-bold text-lg lg:text-xl hover:bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 flex items-center gap-3 w-full sm:w-auto'>
                <MdTrendingUp className='group-hover:animate-pulse text-2xl lg:text-3xl' />
                View Offers
                <HiOutlineCursorClick className='group-hover:rotate-12 transition-transform text-lg lg:text-xl' />
              </button>
            </div>

            {/* Enhanced Stats */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto px-4'>
              {[
                { icon: <BsTruck className='text-3xl lg:text-4xl' />, value: "30 Min", label: "Fast Delivery", subtext: "Average delivery time", color: "from-blue-500 to-cyan-500" },
                { icon: <BsShield className='text-3xl lg:text-4xl' />, value: "100%", label: "Fresh Products", subtext: "Quality guarantee", color: "from-green-500 to-emerald-500" },
                { icon: <BsStar className='text-3xl lg:text-4xl' />, value: "5000+", label: "Products", subtext: "Wide selection", color: "from-yellow-500 to-orange-500" },
                { icon: <MdOutlineLocalOffer className='text-3xl lg:text-4xl' />, value: "50%", label: "Max Discount", subtext: "Daily deals", color: "from-purple-500 to-pink-500" }
              ].map((stat, index) => (
                <div key={index} className='group bg-white/95 backdrop-blur-lg rounded-3xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center min-h-[140px] lg:min-h-[160px] flex flex-col justify-center border border-white/20 hover-lift'>
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                    <div className='text-white animate-pulse'>
                      {stat.icon}
                    </div>
                  </div>
                  <div className='text-2xl lg:text-3xl font-black text-gray-900 mb-1 leading-tight'>{stat.value}</div>
                  <div className='text-sm lg:text-base font-bold text-gray-700 mb-1'>{stat.label}</div>
                  <div className='text-xs lg:text-sm text-gray-500 font-medium'>{stat.subtext}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5' 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2300796b' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
             }}
        ></div>
        
        <div className='container mx-auto px-4 relative z-10'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full mb-6 border border-green-200'>
              <FaShoppingBag className='text-green-600 animate-bounce' />
              <span className='text-green-700 font-semibold text-sm lg:text-base'>Shop by Categories</span>
            </div>
            
            <h2 className='text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight'>
              Everything You Need,
              <span className='block bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent'>
                All in One Place
              </span>
            </h2>
            <p className='text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              Discover fresh groceries, daily essentials, and premium products across all categories
            </p>
          </div>
          
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 lg:gap-8'>
            {
              loadingCategory ? (
                new Array(12).fill(null).map((c, index)=>{
                  return(
                    <div key={index+"loadingcategory"} className='group'>
                      <div className='bg-white rounded-3xl p-6 min-h-48 lg:min-h-52 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 shimmer'>
                        <div className='w-20 h-20 lg:w-24 lg:h-24 mx-auto rounded-2xl mb-4 bg-gray-200 animate-pulse'></div>
                        <div className='h-6 bg-gray-200 rounded-lg animate-pulse'></div>
                      </div>
                    </div>
                  )
                })
              ) : (
                categoryData.map((cat, index)=>{
                  return(
                    <div 
                      key={cat._id+"displayCategory"} 
                      className={`group cursor-pointer transform hover:scale-105 transition-all duration-500 animate-fade-in-up hover-lift`}
                      style={{ animationDelay: `${index * 150}ms` }}
                      onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}
                    >
                      <div className='bg-white rounded-3xl p-6 min-h-48 lg:min-h-52 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-300 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-green-50 relative overflow-hidden'>
                        {/* Shine effect */}
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                        
                        <div className='relative z-10'>
                          <div className='relative overflow-hidden rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br from-gray-50 to-white p-4'>
                            <img 
                              src={cat.image}
                              className='w-16 h-16 lg:w-20 lg:h-20 object-cover mx-auto drop-shadow-lg'
                              alt={cat.name}
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl'></div>
                          </div>
                          <h3 className='text-sm lg:text-base font-bold text-gray-900 text-center group-hover:text-green-600 transition-colors duration-500 leading-tight'>
                            {cat.name}
                          </h3>
                          
                          {/* Hover indicator */}
                          <div className='mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0'>
                            <div className='w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full'></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )
            }
          </div>
          
          {/* Browse All Categories Button */}
          <div className='text-center mt-12'>
            <button 
              onClick={() => navigate('/search')}
              className='group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto'
            >
              <span>Browse All Categories</span>
              <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
            </button>
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
      <section className='py-16 bg-white'>
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
      <section className='py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-black/20'></div>
          {/* Complex animated shapes */}
          <div className='absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48 animate-float'></div>
          <div className='absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-40 translate-y-40 animate-float-delayed'></div>
          <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32 animate-float'></div>
          
          {/* Grid overlay */}
          <div className='absolute inset-0 opacity-10' 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-10 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm20 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z'/%3E%3C/g%3E%3C/svg%3E")`,
               }}
          ></div>
        </div>
        
        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-5xl mx-auto text-center text-white'>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full mb-8'>
              <IoSparkles className='text-yellow-400 animate-pulse' />
              <span className='font-semibold text-sm lg:text-base'>Stay Updated</span>
            </div>
            
            <h2 className='text-4xl lg:text-6xl font-black mb-6 leading-tight'>
              Get Fresh Deals
              <span className='block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent'>
                Delivered Daily!
              </span>
            </h2>
            <p className='text-xl lg:text-2xl text-white/90 mb-12 px-4 max-w-3xl mx-auto leading-relaxed'>
              Subscribe to our newsletter and never miss out on amazing offers, fresh arrivals, and exclusive member benefits
            </p>
            
            <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 lg:p-10 border border-white/20 max-w-2xl mx-auto mb-12'>
              <div className='flex flex-col sm:flex-row items-center gap-4'>
                <div className='flex-1 w-full'>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className='w-full px-6 py-4 lg:py-5 rounded-xl border-0 focus:ring-4 focus:ring-white/30 outline-none text-gray-900 text-lg lg:text-xl font-medium shadow-lg backdrop-blur-sm'
                  />
                </div>
                <button className='group bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-gray-900 px-8 py-4 lg:py-5 rounded-xl font-bold text-lg lg:text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto'>
                  <span>Subscribe</span>
                  <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                </button>
              </div>
              
              <div className='flex items-center justify-center gap-6 mt-6 text-white/80 text-sm lg:text-base'>
                <div className='flex items-center gap-2'>
                  <IoCheckmarkCircle className='text-green-400' />
                  <span>No spam</span>
                </div>
                <div className='flex items-center gap-2'>
                  <IoCheckmarkCircle className='text-green-400' />
                  <span>Unsubscribe anytime</span>
                </div>
                <div className='flex items-center gap-2'>
                  <IoCheckmarkCircle className='text-green-400' />
                  <span>Weekly deals</span>
                </div>
              </div>
            </div>
            
            {/* Social Proof */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto'>
              {[
                { value: "50K+", label: "Happy Customers", icon: <BsHeart className='text-red-400' /> },
                { value: "1M+", label: "Orders Delivered", icon: <BsTruck className='text-blue-400' /> },
                { value: "500+", label: "5-Star Reviews", icon: <BsStar className='text-yellow-400' /> }
              ].map((stat, index) => (
                <div key={index} className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300'>
                  <div className='flex items-center justify-center gap-3 mb-2'>
                    {stat.icon}
                    <span className='text-2xl lg:text-3xl font-black'>{stat.value}</span>
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