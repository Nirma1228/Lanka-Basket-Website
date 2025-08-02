import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [verificationStatus, setVerificationStatus] = useState('verifying') // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [resendLoading, setResendLoading] = useState(false)
    const [userEmail, setUserEmail] = useState('')

    const token = searchParams.get('token')

    const verifyEmail = async () => {
        if (!token) {
            setVerificationStatus('error')
            setMessage('Invalid verification link. Token is missing.')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.verifyEmail,
                data: { token }
            })

            if (response.data.success) {
                setVerificationStatus('success')
                setMessage(response.data.message)
                toast.success(response.data.message)
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            }
        } catch (error) {
            setVerificationStatus('error')
            if (error.response?.data?.message) {
                setMessage(error.response.data.message)
            } else {
                setMessage('Verification failed. Please try again.')
            }
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleResendEmail = async () => {
        if (!userEmail) {
            toast.error('Please enter your email address')
            return
        }

        try {
            setResendLoading(true)
            const response = await Axios({
                ...SummaryApi.resendVerificationEmail,
                data: { email: userEmail }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setUserEmail('')
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setResendLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            verifyEmail()
        } else {
            setVerificationStatus('error')
            setMessage('Invalid verification link.')
            setLoading(false)
        }
    }, [token])

    if (loading && verificationStatus === 'verifying') {
        return (
            <section className='w-full container mx-auto px-2'>
                <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                    <div className='flex flex-col items-center justify-center'>
                        <Loading />
                        <p className='text-center mt-4'>Verifying your email...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <div className='text-center'>
                    <div className='mb-6'>
                        {verificationStatus === 'success' ? (
                            <div className='text-green-600'>
                                <div className='text-6xl mb-4'>✅</div>
                                <h2 className='text-2xl font-semibold mb-2'>Email Verified!</h2>
                            </div>
                        ) : (
                            <div className='text-red-600'>
                                <div className='text-6xl mb-4'>❌</div>
                                <h2 className='text-2xl font-semibold mb-2'>Verification Failed</h2>
                            </div>
                        )}
                    </div>

                    <p className='text-gray-600 mb-6'>{message}</p>

                    {verificationStatus === 'success' ? (
                        <div>
                            <p className='text-sm text-gray-500 mb-4'>
                                Redirecting to login page in 3 seconds...
                            </p>
                            <Link 
                                to="/login" 
                                className='bg-primary-200 text-white px-6 py-2 rounded hover:bg-primary-100 transition-colors'
                            >
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <div>
                                <p className='text-sm text-gray-600 mb-4'>
                                    Didn't receive the verification email or link expired?
                                </p>
                                <div className='space-y-3'>
                                    <input
                                        type='email'
                                        placeholder='Enter your email address'
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        className='w-full p-3 border rounded focus:border-primary-200 outline-none'
                                    />
                                    <button
                                        onClick={handleResendEmail}
                                        disabled={resendLoading}
                                        className='w-full bg-primary-200 text-white py-2 rounded hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                                    </button>
                                </div>
                            </div>
                            
                            <div className='border-t pt-4'>
                                <Link 
                                    to="/register" 
                                    className='text-primary-200 hover:text-primary-100 text-sm'
                                >
                                    Back to Register
                                </Link>
                                <span className='mx-2 text-gray-400'>|</span>
                                <Link 
                                    to="/login" 
                                    className='text-primary-200 hover:text-primary-100 text-sm'
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default VerifyEmail
