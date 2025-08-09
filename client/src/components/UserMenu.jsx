import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink, HiOutlineUser, HiOutlineShoppingBag, HiOutlineLocationMarker, HiOutlineLogout, HiOutlineCollection, HiOutlinePlus, HiOutlineUsers, HiOutlineCog } from "react-icons/hi";
import { FaCrown } from "react-icons/fa";
import { MdDashboard, MdCategory, MdInventory } from "react-icons/md";
import isAdmin from '../utils/isAdmin'
import UserAvatar from './UserAvatar'

const UserMenu = ({close}) => {
   const user = useSelector((state)=> state.user)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleLogout = async()=>{
        try {
          const response = await Axios({
             ...SummaryApi.logout
          })
          console.log("logout",response)
          if(response.data.success){
            if(close){
              close()
            }
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/")
          }
        } catch (error) {
          console.log(error)
          AxiosToastError(error)
        }
   }

   const handleClose = ()=>{
      if(close){
        close()
      }
   }
  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 overflow-hidden min-w-80 animate-slide-in-up'>
      {/* User Profile Header */}
      <div className='bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 right-0 w-32 h-32 rounded-full bg-white -translate-y-16 translate-x-16'></div>
          <div className='absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white translate-y-12 -translate-x-12'></div>
        </div>
        
        <div className='relative z-10'>
          <div className='flex items-center gap-4 mb-3'>
            {/* Avatar */}
            <div className='w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30'>
              <UserAvatar user={user} size="lg" />
            </div>
            
            {/* User Info */}
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-1'>
                <h3 className='font-semibold text-lg truncate'>
                  {user.name || user.mobile || 'User'}
                </h3>
                {isAdmin(user.role) && (
                  <div className='bg-yellow-500 p-1 rounded-full animate-pulse'>
                    <FaCrown className='text-xs text-white' />
                  </div>
                )}
              </div>
              <p className='text-white/80 text-sm truncate'>{user.email}</p>
              {isAdmin(user.role) && (
                <div className='inline-flex items-center gap-1 bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-full mt-2'>
                  <span className='text-xs font-medium text-yellow-100'>Administrator</span>
                </div>
              )}
            </div>
            
            {/* Profile Link */}
            <Link 
              onClick={handleClose} 
              to={"/dashboard/profile"} 
              className='p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 group'
            >
              <HiOutlineExternalLink className='text-white group-hover:scale-110 transition-transform duration-200' />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className='p-2'>
        {/* Admin Section */}
        {isAdmin(user.role) && (
          <div className='mb-4'>
            <div className='px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2'>
              <MdDashboard className='text-sm' />
              Admin Panel
            </div>
            <div className='space-y-1'>
              <MenuLink
                to="/dashboard/category"
                onClick={handleClose}
                icon={<MdCategory />}
                label="Categories"
                description="Manage product categories"
              />
              <MenuLink
                to="/dashboard/subcategory"
                onClick={handleClose}
                icon={<HiOutlineCollection />}
                label="Sub Categories"
                description="Organize subcategories"
              />
              <MenuLink
                to="/dashboard/upload-product"
                onClick={handleClose}
                icon={<HiOutlinePlus />}
                label="Add Product"
                description="Upload new products"
              />
              <MenuLink
                to="/dashboard/product"
                onClick={handleClose}
                icon={<MdInventory />}
                label="Products"
                description="Manage inventory"
              />
              <MenuLink
                to="/dashboard/user-management"
                onClick={handleClose}
                icon={<HiOutlineUsers />}
                label="User Management"
                description="Manage user accounts"
              />
            </div>
            <div className='border-t dark:border-gray-700 my-3'></div>
          </div>
        )}

        {/* User Section */}
        <div className='mb-2'>
          <div className='px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2'>
            <HiOutlineUser className='text-sm' />
            My Account
          </div>
          <div className='space-y-1'>
            <MenuLink
              to="/dashboard/myorders"
              onClick={handleClose}
              icon={<HiOutlineShoppingBag />}
              label="My Orders"
              description="Track your orders"
            />
            <MenuLink
              to="/dashboard/address"
              onClick={handleClose}
              icon={<HiOutlineLocationMarker />}
              label="Saved Addresses"
              description="Manage delivery locations"
            />
          </div>
        </div>

        {/* Logout Section */}
        <div className='border-t dark:border-gray-700 pt-2'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group'
          >
            <HiOutlineLogout className='text-lg group-hover:scale-110 transition-transform duration-200' />
            <div>
              <div className='font-medium'>Sign Out</div>
              <div className='text-xs text-red-500 dark:text-red-400'>Log out of your account</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper component for menu links
const MenuLink = ({ to, onClick, icon, label, description }) => (
  <Link
    to={to}
    onClick={onClick}
    className='flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 rounded-xl transition-all duration-200 group'
  >
    <div className='text-lg group-hover:scale-110 transition-transform duration-200'>
      {icon}
    </div>
    <div>
      <div className='font-medium'>{label}</div>
      <div className='text-xs text-gray-500 dark:text-gray-400'>{description}</div>
    </div>
  </Link>
)

export default UserMenu
