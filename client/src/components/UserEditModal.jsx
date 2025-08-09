import React, { useState } from 'react'
import { IoClose } from "react-icons/io5"
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const UserEditModal = ({ user, close, onUpdate }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        role: user.role || 'USER',
        status: user.status || 'Active'
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserRole,
                url: `${SummaryApi.updateUserRole.url}/${user._id}`,
                data: formData
            })

            if (response.data.success) {
                toast.success(response.data.message)
                onUpdate() // Refresh the user list
                close() // Close the modal
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg w-full max-w-md'>
                <div className='flex justify-between items-center p-4 border-b'>
                    <h2 className='text-lg font-semibold'>Edit User</h2>
                    <button
                        onClick={close}
                        className='p-1 hover:bg-gray-100 rounded'
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='p-4'>
                    {/* User Info Display */}
                    <div className='mb-4 p-3 bg-gray-50 rounded'>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='w-10 h-10 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center'>
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className='w-full h-full object-cover' />
                                ) : (
                                    <span className='text-primary-200 font-semibold text-lg'>
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className='font-medium'>{user.name}</div>
                                <div className='text-sm text-gray-600'>{user.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Role
                        </label>
                        <select
                            name='role'
                            value={formData.role}
                            onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary-200'
                            required
                        >
                            <option value='USER'>USER</option>
                            <option value='ADMIN'>ADMIN</option>
                        </select>
                        <p className='text-xs text-gray-500 mt-1'>
                            Admin users have full access to admin panel
                        </p>
                    </div>

                    {/* Status Selection */}
                    <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Status
                        </label>
                        <select
                            name='status'
                            value={formData.status}
                            onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary-200'
                            required
                        >
                            <option value='Active'>Active</option>
                            <option value='Inactive'>Inactive</option>
                            <option value='Suspended'>Suspended</option>
                        </select>
                        <p className='text-xs text-gray-500 mt-1'>
                            Inactive/Suspended users cannot login
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-3'>
                        <button
                            type='button'
                            onClick={close}
                            className='flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50'
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='flex-1 py-2 px-4 bg-primary-100 text-white rounded hover:bg-primary-200 disabled:opacity-50'
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserEditModal
