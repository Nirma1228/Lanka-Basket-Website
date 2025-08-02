import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
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
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='email'>Email :</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='password'>Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                        <Link to={"/forgot-password"} className='block ml-auto hover:text-primary-200'>Forgot password ?</Link>
                    </div>
    
                    <button disabled={!valideValue} className={` ${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500" }    text-white py-2 rounded font-semibold my-3 tracking-wide`}>Login</button>

                    {showResendVerification && (
                        <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded'>
                            <p className='text-sm text-yellow-800 mb-3'>
                                Your account is not verified. Please check your email for the verification link or resend it.
                            </p>
                            <button
                                onClick={handleResendVerification}
                                disabled={resendLoading || !data.email}
                                className='w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm'
                            >
                                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                            </button>
                        </div>
                    )}

                </form>

                <p>
                    Don't have account? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>Register</Link>
                </p>
            </div>
        </section>
    )
}

export default Login