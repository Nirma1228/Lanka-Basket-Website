import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import ResendVerificationEmail from '../components/ResendVerificationEmail';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';


const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit,setProfileAvatarEdit] = useState(false)
    const [userData,setUserData] = useState({
        name : user.name,
        email : user.email,
        mobile : user.mobile,
    })
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        setUserData({
            name : user.name,
            email : user.email,
            mobile : user.mobile,
        })
    },[user])

    const handleOnChange  = (e)=>{
        const { name, value} = e.target 

        setUserData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data : userData
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally{
            setLoading(false)
        }

    }
  return (
    <div className='p-4'>

        {/**profile upload and display image */}
        <div className='w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
            {
                user.avatar ? (
                    <img 
                      alt={user.name}
                      src={user.avatar}
                      className='w-full h-full'
                    />
                ) : (
                    <FaRegUserCircle size={65}/>
                )
            }
        </div>
        <button onClick={()=>setProfileAvatarEdit(true)} className='text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3'>Edit</button>
        
        {
            openProfileAvatarEdit && (
                <UserProfileAvatarEdit close={()=>setProfileAvatarEdit(false)}/>
            )
        }

        {/**name, mobile , email, change password */}
        <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
            <div className='grid'>
                <label>Name</label>
                <input
                    type='text'
                    placeholder='Enter your name' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.name}
                    name='name'
                    onChange={handleOnChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='email'>Email</label>
                <div className='relative'>
                    <input
                        type='email'
                        id='email'
                        placeholder='Enter your email' 
                        className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded w-full'
                        value={userData.email}
                        name='email'
                        onChange={handleOnChange}
                        required
                    />
                    {user.verify_email ? (
                        <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center'>
                            <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1'>
                                <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                </svg>
                                Verified
                            </span>
                        </div>
                    ) : (
                        <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center'>
                            <span className='bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1'>
                                <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                </svg>
                                Not Verified
                            </span>
                        </div>
                    )}
                </div>
                {!user.verify_email && (
                    <div>
                        <p className='text-sm text-yellow-600 mt-1'>
                            Please verify your email address to secure your account.
                        </p>
                        <ResendVerificationEmail email={userData.email} />
                    </div>
                )}
            </div>
            <div className='grid'>
                <label htmlFor='mobile'>Mobile</label>
                <input
                    type='text'
                    id='mobile'
                    placeholder='Enter your mobile' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.mobile}
                    name='mobile'
                    onChange={handleOnChange}
                    required
                />
            </div>

            <button className='border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 hover:text-neutral-800 rounded'>
                {
                    loading ? "Loading..." : "Submit"
                }
            </button>
        </form>
    </div>
  )
}

export default Profile
