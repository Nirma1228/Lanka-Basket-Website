import React, { useState, useEffect, useRef } from 'react'
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
  const [scrollAnimations, setScrollAnimations] = useState({})
  
  // Refs for scroll animations
  const heroRef = useRef(null)
  const categoriesRef = useRef(null)
  const featuresRef = useRef(null)
  const productsRef = useRef(null)
  const newsletterRef = useRef(null)

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const elementId = entry.target.getAttribute('data-section')
        if (entry.isIntersecting) {
          setScrollAnimations(prev => ({
            ...prev,
            [elementId]: true
          }))
        }
      })
    }, observerOptions)

    // Observe all sections
    const sections = [heroRef, categoriesRef, featuresRef, productsRef, newsletterRef]
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])

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
    <div className='min-h-screen bg-white'>
      {/* Modern Hero Section with Scroll Animations */}
      <section 
        ref={heroRef}
        data-section="hero"
        className={`relative overflow-hidden bg-white min-h-screen flex items-center transition-all duration-1000 ${
          scrollAnimations.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Subtle Background Elements */}
        <div className='absolute inset-0 z-0'>
          {/* Light gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white'></div>
          
          {/* Animated floating elements */}
          <div className={`absolute top-20 right-20 w-32 h-32 bg-yellow-200/20 rounded-full blur-xl transition-all duration-2000 ${
            scrollAnimations.hero ? 'animate-pulse opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
          <div className={`absolute bottom-32 left-20 w-24 h-24 bg-red-200/20 rounded-full blur-lg transition-all duration-2000 delay-300 ${
            scrollAnimations.hero ? 'animate-bounce opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
          <div className={`absolute top-1/2 right-1/3 w-16 h-16 bg-gray-200/30 rounded-full transition-all duration-2000 delay-500 ${
            scrollAnimations.hero ? 'animate-float opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
        </div>
            
        {/* Hero Content - Enhanced with scroll animations */}
        <div className='relative z-20 w-full max-w-7xl mx-auto px-4 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            
            {/* Left Content - Text & CTA with staggered animations */}
            <div className={`text-left lg:text-left order-2 lg:order-1 transition-all duration-1000 delay-200 ${
              scrollAnimations.hero ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              {/* Animated Badge */}
              <div className={`inline-flex items-center gap-2 bg-gray-100 border border-gray-200 px-4 py-2 rounded-full mb-6 transition-all duration-1000 delay-400 ${
                scrollAnimations.hero ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'
              }`}>
                <div className='w-2 h-2 bg-yellow-500 rounded-full animate-pulse'></div>
                <span className='text-gray-700 font-medium text-sm'>Sri Lanka's #1 Grocery Store</span>
              </div>
              
              {/* Animated Main Title */}
              <h1 className={`text-5xl lg:text-7xl font-black mb-6 text-gray-900 leading-tight transition-all duration-1000 delay-600 ${
                scrollAnimations.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <span className={`block transition-all duration-1000 delay-700 ${
                  scrollAnimations.hero ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
                }`}>Fresh</span>
                <span className={`block text-transparent bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text transition-all duration-1000 delay-800 ${
                  scrollAnimations.hero ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}>
                  Groceries
                </span>
                <span className={`block text-4xl lg:text-5xl font-normal text-gray-600 transition-all duration-1000 delay-900 ${
                  scrollAnimations.hero ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-15'
                }`}>
                  Delivered Fast
                </span>
              </h1>
              
              {/* Animated Description */}
              <p className={`text-xl text-gray-600 mb-8 max-w-lg leading-relaxed transition-all duration-1000 delay-1000 ${
                scrollAnimations.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}>
                Get fresh produce, daily essentials, and premium products delivered to your doorstep in just 30 minutes.
              </p>
              
              {/* Animated CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-1000 delay-1200 ${
                scrollAnimations.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <button 
                  onClick={() => navigate('/search')}
                  className={`group bg-gradient-to-r from-yellow-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 ${
                    scrollAnimations.hero ? 'animate-slideInLeft' : ''
                  }`}
                >
                  <BsCart4 className='text-xl group-hover:scale-110 transition-transform' />
                  Start Shopping
                  <FaArrowRight className='text-sm group-hover:translate-x-1 transition-transform' />
                </button>
                
                <button className={`group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 ${
                  scrollAnimations.hero ? 'animate-slideInRight' : ''
                }`}>
                  <MdTrendingUp className='text-xl group-hover:scale-110 transition-transform' />
                  View Offers
                </button>
              </div>
              
              {/* Animated Key Features */}
              <div className={`flex items-center gap-8 transition-all duration-1000 delay-1400 ${
                scrollAnimations.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}>
                <div className={`text-center transition-all duration-500 delay-1500 ${
                  scrollAnimations.hero ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}>
                  <div className='text-2xl font-bold text-gray-900'>30min</div>
                  <div className='text-sm text-gray-500'>Fast Delivery</div>
                </div>
                <div className='w-px h-12 bg-gray-300'></div>
                <div className={`text-center transition-all duration-500 delay-1600 ${
                  scrollAnimations.hero ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}>
                  <div className='text-2xl font-bold text-gray-900'>5000+</div>
                  <div className='text-sm text-gray-500'>Products</div>
                </div>
                <div className='w-px h-12 bg-gray-300'></div>
                <div className={`text-center transition-all duration-500 delay-1700 ${
                  scrollAnimations.hero ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}>
                  <div className='text-2xl font-bold text-gray-900'>100%</div>
                  <div className='text-sm text-gray-500'>Fresh</div>
                </div>
              </div>
            </div>

            {/* Right Content - Visual with enhanced animations */}
            <div className={`order-1 lg:order-2 relative transition-all duration-1000 delay-300 ${
              scrollAnimations.hero ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <div className='relative'>
                {/* Main Visual Card with scroll animation */}
                <div className={`bg-white border border-gray-200 rounded-3xl p-8 shadow-lg transition-all duration-1000 delay-500 ${
                  scrollAnimations.hero ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 rotate-3'
                }`}>
                  <div className='text-center mb-6'>
                    <div className={`w-20 h-20 bg-gradient-to-r from-yellow-400 to-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-1000 delay-700 ${
                      scrollAnimations.hero ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-12'
                    }`}>
                      <FaLeaf className='text-3xl text-white' />
                    </div>
                    <h3 className={`text-2xl font-bold text-gray-900 mb-2 transition-all duration-1000 delay-800 ${
                      scrollAnimations.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}>Premium Quality</h3>
                    <p className={`text-gray-600 transition-all duration-1000 delay-900 ${
                      scrollAnimations.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                    }`}>Fresh from local farms</p>
                  </div>
                  
                  {/* Features Grid with staggered animations */}
                  <div className='grid grid-cols-2 gap-4'>
                    {[
                      { icon: BsLightning, color: 'yellow-500', text: '30 Min Delivery', delay: 'delay-1000' },
                      { icon: BsShield, color: 'red-500', text: 'Quality Assured', delay: 'delay-1100' },
                      { icon: MdOutlineLocalOffer, color: 'yellow-600', text: 'Best Prices', delay: 'delay-1200' },
                      { icon: BsTruck, color: 'red-600', text: 'Free Shipping', delay: 'delay-1300' }
                    ].map((feature, index) => (
                      <div 
                        key={index}
                        className={`bg-gray-50 rounded-xl p-4 text-center border border-gray-100 transition-all duration-1000 ${feature.delay} ${
                          scrollAnimations.hero ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'
                        }`}
                      >
                        <feature.icon className={`text-2xl text-${feature.color} mx-auto mb-2`} />
                        <div className='text-gray-900 font-medium text-sm'>{feature.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Animated floating elements */}
                <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-1000 delay-1400 ${
                  scrollAnimations.hero ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-50'
                }`}>
                  🛒
                </div>
                <div className={`absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full flex items-center justify-center text-xl shadow-lg transition-all duration-1000 delay-1500 ${
                  scrollAnimations.hero ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-50'
                }`}>
                  ⚡
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Categories Section with Scroll Animations */}
      <section 
        ref={categoriesRef}
        data-section="categories"
        className={`py-20 bg-gradient-to-br from-gray-50 via-white to-yellow-50/30 relative overflow-hidden transition-all duration-1000 ${
          scrollAnimations.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Animated background elements */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className={`absolute top-20 right-1/4 w-32 h-32 bg-gradient-to-r from-yellow-200/20 to-red-200/20 rounded-full blur-3xl transition-all duration-2000 ${
            scrollAnimations.categories ? 'animate-pulse opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
          <div className={`absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-red-100/30 to-yellow-100/30 rounded-full blur-2xl transition-all duration-2000 delay-300 ${
            scrollAnimations.categories ? 'animate-bounce opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
          <div className={`absolute top-1/2 left-1/2 w-16 h-16 bg-yellow-100/40 rounded-full blur-xl transition-all duration-2000 delay-500 ${
            scrollAnimations.categories ? 'animate-float opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
        </div>

        <div className='container mx-auto px-4 lg:px-8 relative z-10'>
          {/* Animated Header */}
          <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
            scrollAnimations.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className={`inline-flex items-center gap-3 bg-white shadow-lg border border-gray-200/50 px-6 py-3 rounded-full mb-8 hover:shadow-xl transition-all duration-300 ${
              scrollAnimations.categories ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className='w-3 h-3 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full animate-pulse'></div>
              <span className='text-gray-700 font-semibold text-sm tracking-wide'>Shop by Categories</span>
              <div className='w-2 h-2 bg-yellow-400/60 rounded-full'></div>
            </div>
            
            <h2 className={`text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight transition-all duration-1000 delay-400 ${
              scrollAnimations.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              Everything You Need
            </h2>
            <p className={`text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-600 ${
              scrollAnimations.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}>
              Fresh groceries, daily essentials, and premium products delivered with care
            </p>
          </div>
          
          {/* Enhanced Categories Grid with scroll animations */}
          <div className='max-w-6xl mx-auto'>
            {
              loadingCategory ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
                  {new Array(12).fill(null).map((_, index) => (
                    <div 
                      key={index+"loadingcategory"} 
                      className={`group transition-all duration-1000 ${
                        scrollAnimations.categories ? `opacity-100 translate-y-0 delay-[${(index * 100) + 800}ms]` : 'opacity-0 translate-y-10'
                      }`}
                    >
                      <div className='bg-white rounded-2xl p-6 h-40 animate-pulse border border-gray-200/50 shadow-sm'>
                        <div className='w-16 h-16 mx-auto rounded-2xl mb-4 bg-gradient-to-br from-gray-200 to-gray-300'></div>
                        <div className='h-4 bg-gray-200 rounded-lg mx-2'></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
                  {categoryData.map((cat, index) => (
                    <div 
                      key={cat._id+"displayCategory"} 
                      className={`group cursor-pointer transition-all duration-1000 ${
                        scrollAnimations.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                      style={{ 
                        transitionDelay: scrollAnimations.categories ? `${(index * 100) + 800}ms` : '0ms'
                      }}
                      onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}
                    >
                      <div className='relative bg-white rounded-2xl p-6 h-40 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50 hover:border-red-200/80 group-hover:scale-105 group-hover:-translate-y-2 overflow-hidden'>
                        {/* Enhanced gradient overlay */}
                        <div className='absolute inset-0 bg-gradient-to-br from-yellow-50/0 via-red-50/0 to-yellow-50/0 group-hover:from-yellow-50/40 group-hover:via-red-50/20 group-hover:to-yellow-50/40 transition-all duration-500 rounded-2xl'></div>
                        
                        {/* Modern Image Container with animation */}
                        <div className='relative z-10 mb-4 flex justify-center'>
                          <div className='w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-3 group-hover:bg-gradient-to-br group-hover:from-yellow-50 group-hover:to-red-50 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 shadow-sm group-hover:shadow-lg'>
                            <img 
                              src={cat.image}
                              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                              alt={cat.name}
                            />
                          </div>
                        </div>
                        
                        {/* Enhanced Category Name */}
                        <div className='relative z-10 text-center'>
                          <h3 className='text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300 tracking-wide'>
                            {cat.name}
                          </h3>
                        </div>
                        
                        {/* Modern accent line */}
                        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-b-2xl'></div>
                        
                        {/* Floating elements */}
                        <div className='absolute top-3 right-3 w-2 h-2 bg-yellow-400/0 group-hover:bg-yellow-400 rounded-full transition-all duration-500'></div>
                        <div className='absolute bottom-3 left-3 w-1.5 h-1.5 bg-red-400/0 group-hover:bg-red-400 rounded-full transition-all duration-700'></div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
            
            {/* Enhanced CTA Section with animation */}
            <div className={`text-center mt-16 transition-all duration-1000 delay-1200 ${
              scrollAnimations.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <button 
                onClick={() => navigate('/search')}
                className='group relative bg-gradient-to-r from-yellow-600 via-red-500 to-yellow-600 hover:from-yellow-700 hover:via-red-600 hover:to-yellow-700 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto overflow-hidden'
              >
                {/* Shine effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                
                <span className='relative z-10'>Browse All Categories</span>
                <FaArrowRight className='relative z-10 text-sm group-hover:translate-x-1 transition-transform duration-300' />
              </button>
              
              {/* Enhanced stats with staggered animation */}
              <div className='mt-8 flex items-center justify-center gap-10 text-sm'>
                {[
                  { text: '5000+ Products', color: 'yellow-500', delay: 'delay-1400' },
                  { text: 'Fresh Daily', color: 'red-500', delay: 'delay-1500' },
                  { text: 'Best Prices', color: 'yellow-600', delay: 'delay-1600' }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200 transition-all duration-1000 ${stat.delay} ${
                      scrollAnimations.categories ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'
                    }`}
                  >
                    <div className={`w-2 h-2 bg-${stat.color} rounded-full animate-pulse`}></div>
                    <span className='text-gray-700 font-semibold'>{stat.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Us Section with Scroll Animations */}
      <section 
        ref={featuresRef}
        data-section="features"
        className={`py-20 bg-white relative overflow-hidden transition-all duration-1000 ${
          scrollAnimations.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Animated background elements */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className={`absolute top-20 right-1/4 w-32 h-32 bg-gradient-to-r from-yellow-200/20 to-red-200/20 rounded-full blur-3xl transition-all duration-2000 ${
            scrollAnimations.features ? 'animate-pulse opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
          <div className={`absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-red-100/30 to-yellow-100/30 rounded-full blur-2xl transition-all duration-2000 delay-300 ${
            scrollAnimations.features ? 'animate-bounce opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
          <div className={`absolute top-1/2 right-1/3 w-16 h-16 bg-yellow-100/40 rounded-full blur-xl transition-all duration-2000 delay-500 ${
            scrollAnimations.features ? 'animate-float opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
        </div>
        
        <div className='container mx-auto px-4 lg:px-8 relative z-10'>
          {/* Animated Header */}
          <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
            scrollAnimations.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className={`inline-flex items-center gap-3 bg-white shadow-lg border border-gray-200/50 px-6 py-3 rounded-full mb-8 hover:shadow-xl transition-all duration-300 ${
              scrollAnimations.features ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className='w-3 h-3 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full animate-pulse'></div>
              <span className='text-gray-700 font-semibold text-sm tracking-wide'>Why Choose Us</span>
              <div className='w-2 h-2 bg-yellow-400/60 rounded-full'></div>
            </div>
            
            <h2 className={`text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight transition-all duration-1000 delay-400 ${
              scrollAnimations.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              Experience the
              <span className='block bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent mt-2'>
                Future of Shopping
              </span>
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-600 ${
              scrollAnimations.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}>
              Discover why thousands choose Lanka Basket for their daily needs
            </p>
          </div>
          
          {/* Enhanced Feature Cards with staggered animations */}
          <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20'>
            {[
              {
                icon: <BsLightning className='text-4xl text-yellow-500' />,
                title: "Lightning Fast Delivery",
                description: "30-minute delivery to your doorstep",
                features: ["Real-time tracking", "Temperature controlled", "Express service"],
                bgGradient: "from-yellow-50 to-yellow-100/50",
                borderColor: "yellow-200/50",
                hoverBorder: "yellow-300/80",
                delay: 'delay-800'
              },
              {
                icon: <BsShield className='text-4xl text-red-500' />,
                title: "100% Fresh Guarantee",
                description: "Quality assured with easy returns",
                features: ["Quality checks", "Fresh guarantee", "Money back"],
                bgGradient: "from-red-50 to-red-100/50",
                borderColor: "red-200/50",
                hoverBorder: "red-300/80",
                delay: 'delay-1000'
              },
              {
                icon: <MdOutlineLocalOffer className='text-4xl text-yellow-600' />,
                title: "Best Prices & Offers",
                description: "Daily deals and loyalty rewards",
                features: ["Daily discounts", "Bulk savings", "Member rewards"],
                bgGradient: "from-yellow-50 to-red-50",
                borderColor: "yellow-200/50",
                hoverBorder: "red-300/80",
                delay: 'delay-1200'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`group relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-${feature.borderColor} hover:border-${feature.hoverBorder} hover:scale-105 hover:-translate-y-2 overflow-hidden ${feature.delay} ${
                  scrollAnimations.features ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 rotate-1'
                }`}
              >
                {/* Gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 group-hover:from-white/30 group-hover:to-white/20 transition-all duration-500 rounded-3xl'></div>
                
                {/* Icon container with animation */}
                <div className='relative z-10 mb-6 text-center'>
                  <div className='w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500'>
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className='relative z-10 text-center'>
                  <h3 className='text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 mb-6 text-lg leading-relaxed'>
                    {feature.description}
                  </p>
                  
                  {/* Features list */}
                  <div className='space-y-3'>
                    {feature.features.map((item, idx) => (
                      <div key={idx} className='flex items-center justify-center gap-3 text-gray-700 font-medium'>
                        <div className='w-2 h-2 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full'></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className='absolute top-4 right-4 w-3 h-3 bg-yellow-400/0 group-hover:bg-yellow-400 rounded-full transition-all duration-500'></div>
                <div className='absolute bottom-4 left-4 w-2 h-2 bg-red-400/0 group-hover:bg-red-400 rounded-full transition-all duration-700'></div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Trust Section with animations */}
          <div className={`bg-gradient-to-br from-gray-50 via-white to-yellow-50/30 rounded-3xl p-10 lg:p-12 relative overflow-hidden border border-gray-200/50 shadow-xl transition-all duration-1000 delay-1400 ${
            scrollAnimations.features ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          }`}>
            {/* Background decorations */}
            <div className='absolute inset-0 pointer-events-none'>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-yellow-200/20 to-red-200/20 rounded-full blur-2xl transition-all duration-1000 delay-1600 ${
                scrollAnimations.features ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}></div>
              <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-r from-red-100/30 to-yellow-100/30 rounded-full blur-xl transition-all duration-1000 delay-1800 ${
                scrollAnimations.features ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}></div>
            </div>
            
            <div className='relative z-10'>
              {/* Header */}
              <div className={`text-center mb-12 transition-all duration-1000 delay-1600 ${
                scrollAnimations.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}>
                <h3 className='text-3xl lg:text-4xl font-black text-gray-900 mb-4'>
                  Trusted by 50,000+ Customers
                </h3>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                  Join satisfied customers across Sri Lanka
                </p>
              </div>
              
              {/* Trust metrics with staggered animations */}
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
                {[
                  { 
                    icon: <MdSecurity className='text-3xl text-white' />, 
                    label: "Secure Payments", 
                    value: "SSL Encrypted", 
                    bgColor: "from-yellow-500 to-yellow-600",
                    shadow: "shadow-yellow-200",
                    delay: 'delay-1800'
                  },
                  { 
                    icon: <BsHeart className='text-3xl text-white' />, 
                    label: "Customer Love", 
                    value: "4.8★ Rating", 
                    bgColor: "from-red-500 to-red-600",
                    shadow: "shadow-red-200",
                    delay: 'delay-2000'
                  },
                  { 
                    icon: <FaClock className='text-3xl text-white' />, 
                    label: "24/7 Support", 
                    value: "Always Here", 
                    bgColor: "from-yellow-600 to-red-500",
                    shadow: "shadow-orange-200",
                    delay: 'delay-2200'
                  },
                  { 
                    icon: <MdVerified className='text-3xl text-white' />, 
                    label: "Verified Quality", 
                    value: "100% Authentic", 
                    bgColor: "from-red-600 to-yellow-500",
                    shadow: "shadow-red-200",
                    delay: 'delay-2400'
                  }
                ].map((trust, index) => (
                  <div 
                    key={index} 
                    className={`group text-center transition-all duration-1000 ${trust.delay} ${
                      scrollAnimations.features ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-90'
                    }`}
                  >
                    <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r ${trust.bgColor} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${trust.shadow} shadow-lg group-hover:shadow-xl`}>
                      {trust.icon}
                    </div>
                    <h4 className='font-bold text-gray-900 text-lg lg:text-xl mb-2 group-hover:text-red-600 transition-colors duration-300'>
                      {trust.label}
                    </h4>
                    <p className='text-gray-600 font-medium text-sm lg:text-base'>
                      {trust.value}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* CTA Section with animation */}
              <div className={`text-center mt-12 transition-all duration-1000 delay-2600 ${
                scrollAnimations.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <button 
                  onClick={() => navigate('/search')}
                  className='group relative bg-gradient-to-r from-yellow-600 via-red-500 to-yellow-600 hover:from-yellow-700 hover:via-red-600 hover:to-yellow-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto overflow-hidden'
                >
                  {/* Shine effect */}
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                  
                  <FaShoppingBag className='relative z-10 text-xl group-hover:scale-110 transition-transform duration-300' />
                  <span className='relative z-10'>Start Shopping Now</span>
                  <FaArrowRight className='relative z-10 text-sm group-hover:translate-x-1 transition-transform duration-300' />
                </button>
                
                {/* Additional stats with staggered animation */}
                <div className='mt-8 flex items-center justify-center gap-8 text-sm flex-wrap'>
                  {[
                    { text: '5000+ Products', color: 'yellow-500', delay: 'delay-2800' },
                    { text: '30min Delivery', color: 'red-500', delay: 'delay-2900' },
                    { text: 'Best Prices', color: 'yellow-600', delay: 'delay-3000' }
                  ].map((stat, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200 transition-all duration-1000 ${stat.delay} ${
                        scrollAnimations.features ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
                      }`}
                    >
                      <div className={`w-2 h-2 bg-${stat.color} rounded-full animate-pulse`}></div>
                      <span className='text-gray-700 font-semibold'>{stat.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section with Scroll Animations */}
      <section 
        ref={productsRef}
        data-section="products"
        className={`py-16 lg:py-20 bg-white transition-all duration-1000 ${
          scrollAnimations.products ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className='container mx-auto px-4 lg:px-8'>
          {categoryData?.map((c, index)=>{
            return(
              <div 
                key={c?._id+"CategorywiseProduct"} 
                className={`mb-12 lg:mb-16 transition-all duration-1000 ${
                  scrollAnimations.products ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ 
                  transitionDelay: scrollAnimations.products ? `${index * 200}ms` : '0ms'
                }}
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

      {/* Modern Newsletter Section with Enhanced Scroll Animations */}
      <section 
        ref={newsletterRef}
        data-section="newsletter"
        className={`py-16 lg:py-20 bg-white relative overflow-hidden transition-all duration-1000 ${
          scrollAnimations.newsletter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Animated background elements */}
        <div className='absolute inset-0 z-0'>
          {/* Animated subtle background elements */}
          <div className={`absolute top-0 left-0 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-r from-yellow-100/30 to-red-100/30 rounded-full -translate-x-32 -translate-y-32 lg:-translate-x-48 lg:-translate-y-48 transition-all duration-2000 ${
            scrollAnimations.newsletter ? 'animate-morphing-blob opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
          <div className={`absolute bottom-0 right-0 w-48 h-48 lg:w-80 lg:h-80 bg-gradient-to-r from-red-100/20 to-yellow-100/20 rounded-full translate-x-24 translate-y-24 lg:translate-x-40 lg:translate-y-40 transition-all duration-2000 delay-300 ${
            scrollAnimations.newsletter ? 'animate-parallax-float opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
          <div className={`absolute top-1/2 left-1/2 w-32 h-32 lg:w-64 lg:h-64 bg-gradient-to-r from-yellow-50/40 to-red-50/40 rounded-full -translate-x-16 -translate-y-16 lg:-translate-x-32 lg:-translate-y-32 transition-all duration-2000 delay-500 ${
            scrollAnimations.newsletter ? 'animate-float opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}></div>
          
          {/* Additional animated elements */}
          <div className={`absolute top-1/4 left-1/4 w-12 h-12 bg-yellow-200/20 rounded-full transition-all duration-2000 delay-700 ${
            scrollAnimations.newsletter ? 'animate-particle-float opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}></div>
          <div className={`absolute top-3/4 right-1/4 w-8 h-8 bg-red-200/30 rounded-full transition-all duration-2000 delay-900 ${
            scrollAnimations.newsletter ? 'animate-sparkle opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}></div>
          <div className={`absolute bottom-1/4 left-3/4 w-10 h-10 bg-yellow-100/40 transition-all duration-2000 delay-1100 ${
            scrollAnimations.newsletter ? 'animate-morphing-blob opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}></div>
        </div>
        
        <div className='container mx-auto px-4 lg:px-8 relative z-20'>
          <div className='max-w-5xl mx-auto text-center'>
            {/* Animated badge */}
            <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-red-50 border border-red-200/50 px-4 lg:px-6 py-2 lg:py-3 rounded-full mb-6 lg:mb-8 transition-all duration-1000 delay-200 ${
              scrollAnimations.newsletter ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'
            }`}>
              <IoSparkles className='text-yellow-500 animate-pulse text-sm lg:text-base' />
              <span className='font-semibold text-sm lg:text-base text-gray-700'>Stay Updated</span>
            </div>
            
            {/* Animated main title */}
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 lg:mb-6 leading-tight px-2 text-gray-900 transition-all duration-1000 delay-400 ${
              scrollAnimations.newsletter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <span className={`block transition-all duration-1000 delay-600 ${
                scrollAnimations.newsletter ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
              }`}>Get Fresh Deals</span>
              <span className={`block bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent mt-2 transition-all duration-1000 delay-800 ${
                scrollAnimations.newsletter ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
              }`}>
                Delivered Daily!
              </span>
            </h2>
            
            {/* Animated description */}
            <p className={`text-lg lg:text-xl xl:text-2xl text-gray-600 mb-8 lg:mb-12 px-4 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-1000 ${
              scrollAnimations.newsletter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              Subscribe to our newsletter and never miss out on amazing offers, fresh arrivals, and exclusive member benefits
            </p>
            
            {/* Animated form */}
            <div className={`bg-white border-2 border-gray-200 shadow-lg rounded-2xl lg:rounded-3xl p-6 lg:p-8 xl:p-10 max-w-3xl mx-auto mb-8 lg:mb-12 transition-all duration-1000 delay-1200 ${
              scrollAnimations.newsletter ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
            }`}>
              <div className='flex flex-col sm:flex-row items-center gap-4 lg:gap-6'>
                <div className='flex-1 w-full'>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className='w-full px-4 lg:px-6 py-3 lg:py-4 xl:py-5 rounded-xl lg:rounded-2xl border-2 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none text-gray-900 text-base lg:text-lg xl:text-xl font-medium shadow-sm transition-all duration-300'
                  />
                </div>
                <button className='group bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white px-6 lg:px-8 py-3 lg:py-4 xl:py-5 rounded-xl lg:rounded-2xl font-bold text-base lg:text-lg xl:text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto whitespace-nowrap'>
                  <span>Subscribe</span>
                  <FaArrowRight className='group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300' />
                </button>
              </div>
              
              {/* Animated feature list */}
              <div className='flex items-center justify-center gap-4 lg:gap-6 mt-4 lg:mt-6 text-gray-600 text-sm lg:text-base flex-wrap'>
                {[
                  { icon: <IoCheckmarkCircle className='text-yellow-500 text-base lg:text-lg' />, text: "No spam", delay: 'delay-1400' },
                  { icon: <IoCheckmarkCircle className='text-red-500 text-base lg:text-lg' />, text: "Unsubscribe anytime", delay: 'delay-1500' },
                  { icon: <IoCheckmarkCircle className='text-yellow-600 text-base lg:text-lg' />, text: "Weekly deals", delay: 'delay-1600' }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-2 hover:scale-105 transition-all duration-1000 ${item.delay} ${
                      scrollAnimations.newsletter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                    }`}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enhanced Social Proof with staggered animations */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto'>
              {[
                { value: "50K+", label: "Happy Customers", icon: <BsHeart className='text-red-500' />, bg: "from-red-50 to-red-100", delay: 'delay-1800' },
                { value: "1M+", label: "Orders Delivered", icon: <BsTruck className='text-yellow-600' />, bg: "from-yellow-50 to-yellow-100", delay: 'delay-2000' },
                { value: "500+", label: "5-Star Reviews", icon: <BsStar className='text-yellow-500' />, bg: "from-yellow-50 to-red-50", delay: 'delay-2200' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-br ${stat.bg} rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md ${stat.delay} ${
                    scrollAnimations.newsletter ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-5 rotate-1'
                  }`}
                >
                  <div className='flex items-center justify-center gap-2 lg:gap-3 mb-2'>
                    <div className='text-lg lg:text-xl'>
                      {stat.icon}
                    </div>
                    <span className='text-xl lg:text-2xl xl:text-3xl font-black text-gray-900'>{stat.value}</span>
                  </div>
                  <p className='text-gray-600 font-medium text-sm lg:text-base'>{stat.label}</p>
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