import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash, FaLock, FaArrowLeft, FaCheckCircle, FaKey } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator'
import { validatePassword } from '../utils/passwordValidation'
import LoadingSpinner from '../components/LoadingSpinner'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data,setData] = useState({
    email : "",
    newPassword : "",
    confirmPassword : ""
  })
  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const valideValue = Object.values(data).every(el => el)

  useEffect(()=>{
    if(!(location?.state?.data?.success)){
        navigate("/")
    }

    if(location?.state?.email){
        setData((preve)=>{
            return{
                ...preve,
                email : location?.state?.email
            }
        })
    }
  },[])

  const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

  console.log("data reset password",data)

  const handleSubmit = async(e)=>{
    e.preventDefault()
    setLoading(true)

    // Validate password strength
    const passwordValidation = validatePassword(data.newPassword)
    if (!passwordValidation.isValid) {
        toast.error("Password is not strong enough! Please meet all criteria.")
        setLoading(false)
        return
    }

    ///optional 
    if(data.newPassword !== data.confirmPassword){
        toast.error("New password and confirm password must be same.")
        setLoading(false)
        return
    }

    try {
        const response = await Axios({
            ...SummaryApi.resetPassword, //change
            data : data
        })
        
        if(response.data.error){
            toast.error(response.data.message)
        }

        if(response.data.success){
            toast.success(response.data.message)
            navigate("/login")
            setData({
                email : "",
                newPassword : "",
                confirmPassword : ""
            })
        }

    } catch (error) {
        AxiosToastError(error)
    } finally {
        setLoading(false)
    }
}

  return (
    <section className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-md'>
        {/* Back Button */}
        <Link 
          to="/verification-otp" 
          className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 mb-6 group'
        >
          <FaArrowLeft className='group-hover:-translate-x-1 transition-transform duration-200' />
          <span className='font-medium'>Back</span>
        </Link>

        {/* Main Card */}
        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 relative overflow-hidden'>
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-5 dark:opacity-10'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full -translate-y-16 translate-x-16'></div>
            <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full translate-y-12 -translate-x-12'></div>
          </div>

          {/* Header Section */}
          <div className='text-center mb-8 relative z-10'>
            <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
              <FaKey className='text-2xl text-white' />
            </div>
            
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
              Reset Password
            </h1>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              Create a strong, secure password for your account
            </p>
          </div>

          {/* Form */}
          <form className='space-y-6 relative z-10' onSubmit={handleSubmit}>
            {/* New Password */}
            <div>
              <label htmlFor='newPassword' className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                New Password
              </label>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaLock className='h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200' />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id='newPassword'
                  className='w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                  name='newPassword'
                  value={data.newPassword}
                  onChange={handleChange}
                  placeholder='Enter your new password'
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)} 
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-500 transition-colors duration-200'
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              <div className='mt-3'>
                <PasswordStrengthIndicator 
                  password={data.newPassword} 
                  showIndicator={data.newPassword.length > 0}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                Confirm Password
              </label>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaCheckCircle className={`h-5 w-5 transition-colors duration-200 ${
                    data.confirmPassword && data.newPassword === data.confirmPassword 
                      ? 'text-green-500' 
                      : 'text-gray-400 group-focus-within:text-purple-500'
                  }`} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id='confirmPassword'
                  className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700/50 border rounded-xl outline-none focus:ring-2 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    data.confirmPassword && data.newPassword !== data.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : data.confirmPassword && data.newPassword === data.confirmPassword
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
                      : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20'
                  }`}
                  name='confirmPassword'
                  value={data.confirmPassword}
                  onChange={handleChange}
                  placeholder='Confirm your password'
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)} 
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-500 transition-colors duration-200'
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              
              {/* Confirmation Feedback */}
              {data.confirmPassword && (
                <div className='mt-2'>
                  {data.newPassword === data.confirmPassword ? (
                    <div className='flex items-center gap-2 text-green-600 dark:text-green-400 text-sm'>
                      <FaCheckCircle className='text-xs' />
                      <span>Passwords match</span>
                    </div>
                  ) : (
                    <div className='flex items-center gap-2 text-red-600 dark:text-red-400 text-sm'>
                      <span className='w-3 h-3 rounded-full bg-red-500'></span>
                      <span>Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={!valideValue || loading || data.newPassword !== data.confirmPassword} 
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                valideValue && !loading && data.newPassword === data.confirmPassword
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                  : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Updating Password...</span>
                </div>
              ) : (
                <div className='flex items-center justify-center gap-2'>
                  <FaKey className='text-sm' />
                  <span>Update Password</span>
                </div>
              )}
            </button>
          </form>

          {/* Security Tips */}
          <div className='mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 relative z-10'>
            <h4 className='font-medium text-purple-800 dark:text-purple-300 text-sm mb-2 flex items-center gap-2'>
              <FaLock className='text-xs' />
              Security Tips
            </h4>
            <ul className='text-purple-700 dark:text-purple-400 text-xs space-y-1'>
              <li>• Use a unique password you haven't used elsewhere</li>
              <li>• Make it at least 8 characters with mixed case, numbers & symbols</li>
              <li>• Avoid personal information like names or dates</li>
            </ul>
          </div>

          {/* Footer */}
          <div className='text-center mt-8 relative z-10'>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>
              Remember your password? {' '}
              <Link 
                to="/login" 
                className='font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200'
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResetPassword