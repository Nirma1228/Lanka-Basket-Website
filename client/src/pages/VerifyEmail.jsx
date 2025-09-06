import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoMail, IoShield, IoCheckmarkCircle, IoTimeOutline } from 'react-icons/io5'
import { BsCart4 } from 'react-icons/bs'

const VerifyEmail = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [verificationData, setVerificationData] = useState({
        email: location.state?.email || '',
        otp: ''
    })
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)

    const handleChange = (e) => {
        const { name, value } = e.target
        // Only allow numbers for OTP and limit to 6 digits
        if (name === 'otp' && (!/^\d*$/.test(value) || value.length > 6)) {
            return
        }
        setVerificationData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        
        if (!verificationData.email || !verificationData.otp) {
            toast.error('Please enter both email and OTP')
            return
        }

        if (verificationData.otp.length !== 6) {
            toast.error('OTP must be 6 digits')
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.verifyEmailOtp,
                data: verificationData
            })

            if (response.data.success) {
                toast.success(response.data.message)
                // Redirect to login after successful verification
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (!verificationData.email) {
            toast.error('Please enter your email address')
            return
        }

        try {
            setResendLoading(true)
            const response = await Axios({
                ...SummaryApi.resendVerificationEmail,
                data: { email: verificationData.email }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                // Start countdown for next resend
                setCountdown(60)
                const timer = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(timer)
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)
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
                <div className='absolute top-1/4 right-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-float'></div>
                <div className='absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-float-delayed'></div>
                <div className='absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl'></div>
            </div>

            <div className='relative w-full max-w-lg'>
                {/* Header */}
                <div className='text-center mb-8 animate-fade-in'>
                    <div className='flex justify-center mb-4'>
                        <div className='w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-in'>
                            <BsCart4 className='text-white text-2xl' />
                        </div>
                    </div>
                    <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent'>
                        Verify Your Email
                    </h1>
                    <p className='text-gray-600 mt-2'>
                        Enter the 6-digit code sent to your email address
                    </p>
                </div>

                {/* OTP Verification Card */}
                <div className='bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl p-8 animate-slide-in-up'>
                    {/* Email Info */}
                    <div className='mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50'>
                        <div className='flex items-center gap-3'>
                            <IoMail className='text-blue-500 text-xl' />
                            <div>
                                <p className='text-sm font-medium text-blue-800'>
                                    We sent a verification code to:
                                </p>
                                <p className='text-blue-600 font-semibold'>
                                    {verificationData.email || 'your email address'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleVerifyOtp} className='space-y-6'>
                        {/* Email Field */}
                        <div>
                            <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    value={verificationData.email}
                                    onChange={handleChange}
                                    className='w-full px-4 py-4 bg-gray-50/50 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-500'
                                    placeholder='Enter your email address'
                                    required
                                />
                            </div>
                        </div>

                        {/* OTP Field */}
                        <div>
                            <label htmlFor='otp' className='block text-sm font-semibold text-gray-700 mb-2'>
                                Verification Code
                            </label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    id='otp'
                                    name='otp'
                                    value={verificationData.otp}
                                    onChange={handleChange}
                                    className='w-full px-4 py-4 bg-gray-50/50 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 text-center text-2xl font-bold tracking-widest'
                                    placeholder='000000'
                                    maxLength={6}
                                    required
                                />
                                <div className='absolute inset-y-0 right-0 pr-4 flex items-center'>
                                    <IoTimeOutline className='text-gray-400 text-xl' />
                                </div>
                            </div>
                            <p className='mt-2 text-sm text-gray-500'>
                                Enter the 6-digit code (expires in 15 minutes)
                            </p>
                        </div>

                        {/* Verify Button */}
                        <button
                            type='submit'
                            disabled={loading || verificationData.otp.length !== 6}
                            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
                                loading || verificationData.otp.length !== 6
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg'
                            }`}
                        >
                            {loading ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                    Verifying...
                                </span>
                            ) : (
                                <span className='flex items-center justify-center gap-2'>
                                    <IoCheckmarkCircle className='text-xl' />
                                    Verify Email
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Resend Section */}
                    <div className='mt-8 pt-6 border-t border-gray-200'>
                        <div className='text-center space-y-4'>
                            <p className='text-gray-600 text-sm'>
                                Didn't receive the code?
                            </p>
                            <button
                                onClick={handleResendOtp}
                                disabled={resendLoading || countdown > 0}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                                    resendLoading || countdown > 0
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                }`}
                            >
                                {resendLoading ? (
                                    'Sending...'
                                ) : countdown > 0 ? (
                                    `Resend in ${countdown}s`
                                ) : (
                                    'Resend Code'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className='mt-6 text-center space-x-4'>
                        <Link 
                            to="/register" 
                            className='text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors'
                        >
                            Back to Register
                        </Link>
                        <span className='text-gray-400'>|</span>
                        <Link 
                            to="/login" 
                            className='text-green-600 hover:text-green-700 text-sm font-medium transition-colors'
                        >
                            Login
                        </Link>
                    </div>
                </div>

                {/* Security Badge */}
                <div className='mt-6 flex items-center justify-center gap-2 text-gray-500 animate-fade-in' style={{ animationDelay: '700ms' }}>
                    <IoShield className='text-green-500' />
                    <span className='text-sm'>Your data is protected with 256-bit SSL encryption</span>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail
