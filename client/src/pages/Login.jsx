import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye, FaGoogle, FaApple } from "react-icons/fa6";
import { IoMail, IoLockClosed, IoShield } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showResendVerification, setShowResendVerification] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)


    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
                
                // Check if the error is due to unverified email
                if(response.data.message.includes("Your Account is Not Activated please verify your mail")){
                    setShowResendVerification(true)
                }
            }

            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accesstoken',response.data.data.accesstoken)
                localStorage.setItem('refreshToken',response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email : "",
                    password : "",
                })
                setShowResendVerification(false)
                navigate("/")
            }

        } catch (error) {
            AxiosToastError(error)
            // Check if the error is due to unverified email
            if(error.response?.data?.message?.includes("Your Account is Not Activated please verify your mail")){
                setShowResendVerification(true)
            }
        }
    }

    const handleResendVerification = async () => {
        if (!data.email) {
            toast.error('Please enter your email address')
            return
        }

        try {
            setResendLoading(true)
            const response = await Axios({
                ...SummaryApi.resendVerificationEmail,
                data: { email: data.email }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setShowResendVerification(false)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setResendLoading(false)
        }
    }
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            {/* Background Elements */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-float'></div>
                <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-float-delayed'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl'></div>
            </div>

            <div className='relative w-full max-w-md'>
                {/* Header */}
                <div className='text-center mb-8 animate-fade-in'>
                    <div className='flex justify-center mb-4'>
                        <div className='w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-in'>
                            <BsCart4 className='text-white text-2xl' />
                        </div>
                    </div>
                    <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent'>
                        Welcome Back
                    </h1>
                    <p className='text-gray-600 mt-2'>
                        Sign in to your Lanka Basket account
                    </p>
                </div>

                {/* Login Card */}
                <div className='bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl p-8 animate-slide-in-up'>
                    {/* Social Login Buttons */}
                    <div className='space-y-3 mb-8'>
                        <button className='w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 group shadow-md hover:shadow-lg'>
                            <FaGoogle className='text-red-500 text-lg group-hover:scale-110 transition-transform' />
                            <span className='font-medium text-gray-700'>Continue with Google</span>
                        </button>
                        <button className='w-full flex items-center justify-center gap-3 px-6 py-3 bg-black border border-gray-800 rounded-xl hover:bg-gray-800 transition-all duration-300 group shadow-md hover:shadow-lg'>
                            <FaApple className='text-white text-lg group-hover:scale-110 transition-transform' />
                            <span className='font-medium text-white'>Continue with Apple</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className='relative mb-8'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='px-4 bg-white/80 text-gray-500 font-medium'>
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <form className='space-y-6' onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className='animate-fade-in' style={{ animationDelay: '200ms' }}>
                            <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <IoMail className='h-5 w-5 text-gray-400' />
                                </div>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    value={data.email}
                                    onChange={handleChange}
                                    className='w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-500'
                                    placeholder='Enter your email address'
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className='animate-fade-in' style={{ animationDelay: '300ms' }}>
                            <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-2'>
                                Password
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <IoLockClosed className='h-5 w-5 text-gray-400' />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    name='password'
                                    value={data.password}
                                    onChange={handleChange}
                                    className='w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-500'
                                    placeholder='Enter your password'
                                />
                                <div className='absolute inset-y-0 right-0 pr-4 flex items-center'>
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className='text-gray-400 hover:text-gray-600 transition-colors'
                                    >
                                        {showPassword ? <FaRegEye className='h-5 w-5' /> : <FaRegEyeSlash className='h-5 w-5' />}
                                    </button>
                                </div>
                            </div>
                            <div className='flex justify-end mt-2'>
                                <Link 
                                    to="/forgot-password" 
                                    className='text-sm text-green-600 hover:text-green-700 font-medium transition-colors'
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type='submit'
                            disabled={!valideValue}
                            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl animate-fade-in ${
                                valideValue
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg animate-pulse-glow'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            style={{ animationDelay: '400ms' }}
                        >
                            {valideValue ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <IoShield className='text-xl' />
                                    Sign In Securely
                                </span>
                            ) : (
                                'Please fill in all fields'
                            )}
                        </button>

                        {/* Verification Resend */}
                        {showResendVerification && (
                            <div className='mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl animate-bounce-in'>
                                <div className='flex items-center gap-3 mb-3'>
                                    <div className='w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center'>
                                        <IoMail className='text-yellow-800 text-sm' />
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-yellow-800'>Email Verification Required</h3>
                                        <p className='text-sm text-yellow-700'>
                                            Please check your email for the 6-digit verification code
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleResendVerification}
                                    disabled={resendLoading || !data.email}
                                    className='w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]'
                                >
                                    {resendLoading ? (
                                        <span className='flex items-center justify-center gap-2'>
                                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Resend Verification Code'
                                    )}
                                </button>
                                <Link 
                                    to="/verify-email" 
                                    state={{ email: data.email }}
                                    className='mt-3 w-full block text-center bg-blue-100 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-200 transition-all duration-300'
                                >
                                    Enter Verification Code
                                </Link>
                            </div>
                        )}
                    </form>

                    {/* Sign Up Link */}
                    <div className='mt-8 text-center animate-fade-in' style={{ animationDelay: '500ms' }}>
                        <p className='text-gray-600'>
                            Don't have an account?{' '}
                            <Link 
                                to="/register" 
                                className='font-semibold text-green-600 hover:text-green-700 transition-colors hover:underline'
                            >
                                Create one here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security Badge */}
                <div className='mt-6 flex items-center justify-center gap-2 text-gray-500 animate-fade-in' style={{ animationDelay: '600ms' }}>
                    <IoShield className='text-green-500' />
                    <span className='text-sm'>Your data is protected with 256-bit SSL encryption</span>
                </div>
            </div>
        </div>
    )
}

export default Login