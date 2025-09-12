import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoSearchOutline, IoNotificationsOutline } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import useMobile from '../hooks/useMobile';
import { useSelector } from 'react-redux';
import UserMenu from './UserMenu';
import WishlistIcon from './WishlistIcon';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const [openMobileMenu, setOpenMobileMenu] = useState(false)
    const [openMobileSearch, setOpenMobileSearch] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }
        navigate("/user")
    }

    const toggleMobileMenu = () => {
        setOpenMobileMenu(!openMobileMenu)
    }

    const toggleMobileSearch = () => {
        setOpenMobileSearch(!openMobileSearch)
    }

    return (
        <>
            {/* Compact Modern Header */}
            <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
                isScrolled ? 'shadow-lg backdrop-blur-md bg-white/98 border-b border-gray-200/50' : 'shadow-md'
            }`}>
                
                {/* Desktop Header */}
                <div className="hidden lg:block">
                    <div className="container mx-auto px-4 lg:px-6">
                        {/* Compact Top Bar */}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors cursor-pointer">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                    <span>📞 +94 11 123 4567</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors cursor-pointer">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    <span>✉️ hello@lankabasket.com</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <Link to="/track-order" className="text-gray-600 hover:text-red-600 transition-colors font-medium">
                                    Track Order
                                </Link>
                                <Link to="/help" className="text-gray-600 hover:text-yellow-600 transition-colors font-medium">
                                    Help & Support
                                </Link>
                            </div>
                        </div>

                        {/* Compact Main Navigation */}
                        <div className="flex items-center justify-between py-3">
                            {/* Compact Logo */}
                            <Link to="/" className="flex items-center hover:scale-105 transition-transform duration-300">
                                <img 
                                    src={logo}
                                    width={160}
                                    height={55}
                                    alt="Lanka Basket"
                                    className="h-10 w-auto"
                                />
                            </Link>

                            {/* Compact Search Bar */}
                            <div className="flex-1 max-w-2xl mx-6">
                                <Search />
                            </div>

                            {/* Compact Right Side Actions */}
                            <div className="flex items-center space-x-3">
                                
                    

                                {/* Compact Notifications */}
                                <button className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors rounded-lg hover:bg-yellow-50">
                                    <IoNotificationsOutline size={20} />
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        3
                                    </span>
                                </button>

                                {/* Compact User Account */}
                                {user?._id ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenUserMenu(!openUserMenu)}
                                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-100 to-red-100 rounded-full flex items-center justify-center">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full" />
                                                ) : (
                                                    <FaRegCircleUser className="text-red-600" />
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {user.name?.split(' ')[0] || 'User'}
                                                </p>
                                            </div>
                                            {openUserMenu ? <MdKeyboardArrowUp size={16} /> : <MdKeyboardArrowDown size={16} />}
                                        </button>

                                        {/* User Dropdown Menu */}
                                        {openUserMenu && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-40" 
                                                    onClick={() => setOpenUserMenu(false)}
                                                />
                                                <div className="absolute right-0 top-12 z-50 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2">
                                                    <UserMenu close={handleCloseUserMenu} />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={redirectToLoginPage}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 font-semibold"
                                    >
                                        <FaRegCircleUser size={16} />
                                        <span>Sign In</span>
                                    </button>
                                )}

                                {/* Wishlist Icon */}
                                <WishlistIcon />

                                {/* Compact Shopping Cart */}
                                <button
                                    onClick={() => setOpenCartSection(true)}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-yellow-600 to-red-500 hover:from-yellow-700 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    <div className="relative">
                                        <HiOutlineShoppingBag size={20} />
                                        {totalQty > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                {totalQty}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-left">
                                        {cartItem.length > 0 ? (
                                            <>
                                                <p className="text-xs opacity-90">{totalQty} Items</p>
                                                <p className="font-semibold text-sm">{DisplayPriceInRupees(totalPrice)}</p>
                                            </>
                                        ) : (
                                            <p className="font-semibold text-sm">Cart</p>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compact Mobile Header */}
                <div className="lg:hidden">
                    <div className="flex items-center justify-between p-3">
                        {/* Compact Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        >
                            {openMobileMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>

                        {/* Compact Mobile Logo */}
                        <Link to="/" className="flex items-center">
                            <img 
                                src={logo}
                                width={120}
                                height={50}
                                alt="Lanka Basket"
                                className="h-7 w-auto"
                            />
                        </Link>

                        {/* Compact Mobile Actions */}
                        <div className="flex items-center space-x-1">
                            {/* Mobile Search Toggle */}
                            <button
                                onClick={toggleMobileSearch}
                                className="p-2 text-gray-700 hover:text-yellow-600 transition-colors rounded-lg hover:bg-yellow-50"
                            >
                                <IoSearchOutline size={20} />
                            </button>

                            {/* Mobile Wishlist */}
                            <div className="flex items-center">
                                <WishlistIcon />
                            </div>

                            {/* Mobile Cart */}
                            <button
                                onClick={() => setOpenCartSection(true)}
                                className="relative p-2 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            >
                                <HiOutlineShoppingBag size={20} />
                                {totalQty > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {totalQty}
                                    </span>
                                )}
                            </button>

                            {/* Mobile User */}
                            <button 
                                onClick={handleMobileUser} 
                                className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors rounded-lg hover:bg-yellow-50"
                            >
                                <FaRegCircleUser size={18} />
                                {user?._id && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Compact Mobile Search Bar */}
                    {(openMobileSearch || isSearchPage) && (
                        <div className="px-3 pb-3 border-t border-gray-100">
                            <Search />
                        </div>
                    )}
                </div>

                {/* Compact Mobile Menu Overlay */}
                {openMobileMenu && (
                    <>
                        <div 
                            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                            onClick={() => setOpenMobileMenu(false)}
                        />
                        <div className="fixed top-0 left-0 z-50 w-72 h-full bg-white shadow-xl transform transition-transform lg:hidden">
                            {/* Compact Mobile Menu Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <img src={logo} alt="Lanka Basket" className="h-7 w-auto" />
                                <button
                                    onClick={() => setOpenMobileMenu(false)}
                                    className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-lg"
                                >
                                    <FaTimes size={18} />
                                </button>
                            </div>
                            
                            {/* Compact Mobile Menu Content */}
                            <div className="p-4">
                                <nav className="space-y-1">
                                    {[
                                        { to: "/", label: "Home", icon: "🏠" },
                                        { to: "/categories", label: "Categories", icon: "📦" },
                                        { to: "/offers", label: "Offers", icon: "🎁" },
                                        { to: "/track-order", label: "Track Order", icon: "📍" },
                                        { to: "/help", label: "Help & Support", icon: "💬" }
                                    ].map((item, index) => (
                                        <Link
                                            key={index}
                                            to={item.to}
                                            className="flex items-center gap-3 py-3 px-3 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
                                            onClick={() => setOpenMobileMenu(false)}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    ))}
                                </nav>

                                {/* Compact Mobile Contact Info */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-3">Contact Us</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                            <span>📞 +94 11 123 4567</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                            <span>✉️ hello@lankabasket.com</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Compact Mobile User Section */}
                                {user?._id && (
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-gradient-to-r from-yellow-100 to-red-100 rounded-full flex items-center justify-center">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full" />
                                                    ) : (
                                                        <FaRegCircleUser className="text-red-600" />
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{user.name || 'User'}</p>
                                                <p className="text-sm text-gray-600">Welcome back!</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </header>

            {/* Cart Sidebar */}
            {openCartSection && (
                <DisplayCartItem close={() => setOpenCartSection(false)} />
            )}
        </>
    )
}

export default Header