import React, { useState } from 'react'
import { FaEnvelope, FaArrowLeft, FaKey, FaShieldAlt } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

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
        setLoading(true)

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/verification-otp",{
                  state : data
                })
                setData({
                    email : "",
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
                    to="/login" 
                    className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 mb-6 group'
                >
                    <FaArrowLeft className='group-hover:-translate-x-1 transition-transform duration-200' />
                    <span className='font-medium'>Back to Login</span>
                </Link>

                {/* Main Card */}
                <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 relative overflow-hidden'>
                    {/* Background Pattern */}
                    <div className='absolute inset-0 opacity-5 dark:opacity-10'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-full -translate-y-16 translate-x-16'></div>
                        <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full translate-y-12 -translate-x-12'></div>
                    </div>

                    {/* Header Section */}
                    <div className='text-center mb-8 relative z-10'>
                        <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                            <FaKey className='text-2xl text-white' />
                        </div>
                        
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                            Forgot Password?
                        </h1>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                            No worries! Enter your email address and we'll send you a verification code to reset your password.
                        </p>
                    </div>

                    {/* Form */}
                    <form className='space-y-6 relative z-10' onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor='email' className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                                Email Address
                            </label>
                            <div className='relative group'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <HiOutlineMail className='h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200' />
                                </div>
                                <input
                                    type='email'
                                    id='email'
                                    className='w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                                    name='email'
                                    value={data.email}
                                    onChange={handleChange}
                                    placeholder='Enter your email address'
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={!valideValue || loading} 
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                                valideValue && !loading
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                                    : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                            }`}
                        >
                            {loading ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <LoadingSpinner size="sm" color="white" />
                                    <span>Sending OTP...</span>
                                </div>
                            ) : (
                                <div className='flex items-center justify-center gap-2'>
                                    <FaEnvelope className='text-sm' />
                                    <span>Send Verification Code</span>
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Security Note */}
                    <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 relative z-10'>
                        <div className='flex items-start gap-3'>
                            <FaShieldAlt className='text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
                            <div>
                                <h4 className='font-medium text-blue-800 dark:text-blue-300 text-sm mb-1'>
                                    Security Information
                                </h4>
                                <p className='text-blue-700 dark:text-blue-400 text-xs leading-relaxed'>
                                    For your security, we'll send a 6-digit verification code to your email. 
                                    The code will expire in 10 minutes.
                                </p>
                            </div>
                        </div>
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

export default ForgotPassword
