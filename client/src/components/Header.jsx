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
            {/* Main Header */}
            <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
                isScrolled ? 'shadow-lg backdrop-blur-md bg-white/95' : 'shadow-sm'
            }`}>
                
                {/* Desktop Header */}
                <div className="hidden lg:block">
                    <div className="container mx-auto px-4">
                        {/* Top Bar */}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>📞 +94 11 123 4567</span>
                                <span>✉️ hello@lankabasket.com</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <Link to="/track-order" className="text-gray-600 hover:text-green-600 transition-colors">
                                    Track Order
                                </Link>
                                <Link to="/help" className="text-gray-600 hover:text-green-600 transition-colors">
                                    Help & Support
                                </Link>
                            </div>
                        </div>

                        {/* Main Navigation */}
                        <div className="flex items-center justify-between py-4">
                            {/* Logo */}
                            <Link to="/" className="flex items-center">
                                <img 
                                    src={logo}
                                    width={180}
                                    height={65}
                                    alt="Lanka Basket"
                                    className="h-12 w-auto"
                                />
                            </Link>

                            {/* Search Bar */}
                            <div className="flex-1 max-w-2xl mx-8">
                                <Search />
                            </div>

                            {/* Right Side Actions */}
                            <div className="flex items-center space-x-6">
                                
                                {/* Wishlist */}
                                <button className="relative p-2 text-gray-700 hover:text-red-500 transition-colors">
                                    <FaHeart size={20} />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        0
                                    </span>
                                </button>

                                {/* Notifications */}
                                <button className="relative p-2 text-gray-700 hover:text-blue-500 transition-colors">
                                    <IoNotificationsOutline size={22} />
                                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        3
                                    </span>
                                </button>

                                {/* User Account */}
                                {user?._id ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenUserMenu(!openUserMenu)}
                                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full" />
                                                ) : (
                                                    <FaRegCircleUser className="text-green-600" />
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.name?.split(' ')[0] || 'User'}
                                                </p>
                                                <p className="text-xs text-gray-500">Account</p>
                                            </div>
                                            {openUserMenu ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                                        </button>

                                        {/* User Dropdown Menu */}
                                        {openUserMenu && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-40" 
                                                    onClick={() => setOpenUserMenu(false)}
                                                />
                                                <div className="absolute right-0 top-14 z-50 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                                                    <UserMenu close={handleCloseUserMenu} />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={redirectToLoginPage}
                                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <FaRegCircleUser />
                                        <span>Sign In</span>
                                    </button>
                                )}

                                {/* Shopping Cart */}
                                <button
                                    onClick={() => setOpenCartSection(true)}
                                    className="relative flex items-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    <div className="relative">
                                        <HiOutlineShoppingBag size={24} />
                                        {totalQty > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                                {totalQty}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-left">
                                        {cartItem.length > 0 ? (
                                            <>
                                                <p className="text-xs opacity-90">{totalQty} Items</p>
                                                <p className="font-semibold">{DisplayPriceInRupees(totalPrice)}</p>
                                            </>
                                        ) : (
                                            <p className="font-semibold">My Cart</p>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="lg:hidden">
                    <div className="flex items-center justify-between p-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 text-gray-700 hover:text-green-600 transition-colors"
                        >
                            {openMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>

                        {/* Mobile Logo */}
                        <Link to="/" className="flex items-center">
                            <img 
                                src={logo}
                                width={120}
                                height={50}
                                alt="Lanka Basket"
                                className="h-8 w-auto"
                            />
                        </Link>

                        {/* Mobile Actions */}
                        <div className="flex items-center space-x-2">
                            {/* Mobile Search Toggle */}
                            <button
                                onClick={toggleMobileSearch}
                                className="p-2 text-gray-700 hover:text-green-600 transition-colors"
                            >
                                <IoSearchOutline size={24} />
                            </button>

                            {/* Mobile Cart */}
                            <button
                                onClick={() => setOpenCartSection(true)}
                                className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                            >
                                <HiOutlineShoppingBag size={24} />
                                {totalQty > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {totalQty}
                                    </span>
                                )}
                            </button>

                            {/* Mobile User */}
                            <button onClick={handleMobileUser} className="p-2 text-gray-700 hover:text-green-600 transition-colors">
                                <FaRegCircleUser size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {(openMobileSearch || isSearchPage) && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                            <Search />
                        </div>
                    )}
                </div>

                {/* Mobile Menu Overlay */}
                {openMobileMenu && (
                    <>
                        <div 
                            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                            onClick={() => setOpenMobileMenu(false)}
                        />
                        <div className="fixed top-0 left-0 z-50 w-80 h-full bg-white shadow-xl transform transition-transform lg:hidden">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <img src={logo} alt="Lanka Basket" className="h-8 w-auto" />
                                <button
                                    onClick={() => setOpenMobileMenu(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            
                            <div className="p-4">
                                <nav className="space-y-4">
                                    <Link
                                        to="/"
                                        className="block py-2 text-gray-700 hover:text-green-600 transition-colors"
                                        onClick={() => setOpenMobileMenu(false)}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        to="/categories"
                                        className="block py-2 text-gray-700 hover:text-green-600 transition-colors"
                                        onClick={() => setOpenMobileMenu(false)}
                                    >
                                        Categories
                                    </Link>
                                    <Link
                                        to="/offers"
                                        className="block py-2 text-gray-700 hover:text-green-600 transition-colors"
                                        onClick={() => setOpenMobileMenu(false)}
                                    >
                                        Offers
                                    </Link>
                                    <Link
                                        to="/track-order"
                                        className="block py-2 text-gray-700 hover:text-green-600 transition-colors"
                                        onClick={() => setOpenMobileMenu(false)}
                                    >
                                        Track Order
                                    </Link>
                                    <Link
                                        to="/help"
                                        className="block py-2 text-gray-700 hover:text-green-600 transition-colors"
                                        onClick={() => setOpenMobileMenu(false)}
                                    >
                                        Help & Support
                                    </Link>
                                </nav>

                                {/* Mobile Contact Info */}
                                <div className="mt-8 pt-4 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-3">Contact Us</h4>
                                    <p className="text-sm text-gray-600 mb-2">📞 +94 11 123 4567</p>
                                    <p className="text-sm text-gray-600">✉️ hello@lankabasket.com</p>
                                </div>
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