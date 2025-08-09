import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaShieldAlt, FaEnvelope, FaClock } from 'react-icons/fa'
import { HiOutlineRefresh } from 'react-icons/hi'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""])
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [timer, setTimer] = useState(600) // 10 minutes in seconds
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    console.log("location",location)

    useEffect(()=>{
        if(!location?.state?.email){
            navigate("/forgot-password")
        }
    },[])

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [timer])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const valideValue = data.every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setLoading(true)

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data : {
                    otp : data.join(""),
                    email : location?.state?.email
                }
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData(["","","","","",""])
                navigate("/reset-password",{
                    state : {
                        data : response.data,
                        email : location?.state?.email
                    }
                })
            }

        } catch (error) {
            console.log('error',error)
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleResendOTP = async () => {
        setResendLoading(true)
        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: { email: location?.state?.email }
            })
            
            if(response.data.success) {
                toast.success("OTP sent successfully!")
                setTimer(600) // Reset timer
                setData(["","","","","",""]) // Clear current OTP
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <section className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8'>
            <div className='w-full max-w-md'>
                {/* Back Button */}
                <Link 
                    to="/forgot-password" 
                    className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 mb-6 group'
                >
                    <FaArrowLeft className='group-hover:-translate-x-1 transition-transform duration-200' />
                    <span className='font-medium'>Back</span>
                </Link>

                {/* Main Card */}
                <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 relative overflow-hidden'>
                    {/* Background Pattern */}
                    <div className='absolute inset-0 opacity-5 dark:opacity-10'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full -translate-y-16 translate-x-16'></div>
                        <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-full translate-y-12 -translate-x-12'></div>
                    </div>

                    {/* Header Section */}
                    <div className='text-center mb-8 relative z-10'>
                        <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                            <FaShieldAlt className='text-2xl text-white' />
                        </div>
                        
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                            Verify Your Email
                        </h1>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed mb-4'>
                            We've sent a 6-digit verification code to
                        </p>
                        <div className='inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg'>
                            <FaEnvelope className='text-green-600 dark:text-green-400 text-sm' />
                            <span className='font-semibold text-green-700 dark:text-green-300 text-sm'>
                                {location?.state?.email}
                            </span>
                        </div>
                    </div>

                    {/* Timer */}
                    {timer > 0 && (
                        <div className='flex items-center justify-center gap-2 mb-6 relative z-10'>
                            <FaClock className='text-orange-500 text-sm' />
                            <span className='text-orange-600 dark:text-orange-400 font-medium text-sm'>
                                Code expires in {formatTime(timer)}
                            </span>
                        </div>
                    )}

                    {/* Form */}
                    <form className='space-y-6 relative z-10' onSubmit={handleSubmit}>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center'>
                                Enter Verification Code
                            </label>
                            <div className='flex items-center justify-center gap-3'>
                                {
                                    data.map((element,index)=>{
                                        return(
                                            <input
                                                key={"otp"+index}
                                                type='text'
                                                ref={(ref)=>{
                                                    inputRef.current[index] = ref
                                                    return ref 
                                                }}
                                                value={data[index]}
                                                onChange={(e)=>{
                                                    const value = e.target.value
                                                    
                                                    // Only allow numbers
                                                    if (!/^[0-9]*$/.test(value)) return
                                                    
                                                    const newData = [...data]
                                                    newData[index] = value
                                                    setData(newData)

                                                    if(value && index < 5){
                                                        inputRef.current[index+1].focus()
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !data[index] && index > 0) {
                                                        inputRef.current[index-1].focus()
                                                    }
                                                }}
                                                maxLength={1}
                                                className='w-12 h-12 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-center font-bold text-lg text-gray-900 dark:text-white transition-all duration-200'
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={!valideValue || loading} 
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                                valideValue && !loading
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                                    : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                            }`}
                        >
                            {loading ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <LoadingSpinner size="sm" color="white" />
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                <div className='flex items-center justify-center gap-2'>
                                    <FaShieldAlt className='text-sm' />
                                    <span>Verify Code</span>
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Resend Section */}
                    <div className='text-center mt-6 relative z-10'>
                        {timer > 0 ? (
                            <p className='text-gray-500 dark:text-gray-400 text-sm'>
                                Didn't receive the code? Please wait {formatTime(timer)}
                            </p>
                        ) : (
                            <button
                                onClick={handleResendOTP}
                                disabled={resendLoading}
                                className='inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 font-semibold text-sm'
                            >
                                {resendLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        <span>Resending...</span>
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineRefresh className='text-base' />
                                        <span>Resend Code</span>
                                    </>
                                )}
                            </button>
                        )}
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

export default OtpVerification


