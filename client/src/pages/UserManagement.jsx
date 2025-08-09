import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import { IoSearchOutline } from "react-icons/io5"
import { MdDelete, MdEdit, MdSecurity, MdRefresh } from "react-icons/md"
import { FaUser, FaUserShield, FaExclamationTriangle } from "react-icons/fa"
import toast from 'react-hot-toast'
import UserEditModal from '../components/UserEditModal'
import UserSecurityModal from '../components/UserSecurityModal'

const UserManagement = () => {
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPageCount, setTotalPageCount] = useState(1)
    const [search, setSearch] = useState("")
    const [editUser, setEditUser] = useState(null)
    const [securityUser, setSecurityUser] = useState(null)
    const [totalUsers, setTotalUsers] = useState(0)

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getAllUsers,
                data: {
                    page: page,
                    limit: 10,
                    search: search
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setUsers(responseData.data.users)
                setTotalPageCount(responseData.data.totalPages)
                setTotalUsers(responseData.data.totalUsers)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [page, search])

    const handleNext = () => {
        if (page < totalPageCount) {
            setPage(page + 1)
        }
    }

    const handlePrevious = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const handleSearch = (e) => {
        const value = e.target.value
        setSearch(value)
        setPage(1)
    }

    const handleDeleteUser = async (userId, userName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)
        
        if (confirmDelete) {
            try {
                const response = await Axios({
                    ...SummaryApi.deleteUser,
                    url: `${SummaryApi.deleteUser.url}/${userId}`
                })

                if (response.data.success) {
                    toast.success(response.data.message)
                    fetchUsers()
                }
            } catch (error) {
                AxiosToastError(error)
            }
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'text-green-600 bg-green-100'
            case 'Inactive':
                return 'text-gray-600 bg-gray-100'
            case 'Suspended':
                return 'text-red-600 bg-red-100'
            default:
                return 'text-gray-600 bg-gray-100'
        }
    }

    const getRoleIcon = (role) => {
        return role === 'ADMIN' ? <FaUserShield className="text-blue-600" /> : <FaUser className="text-gray-600" />
    }

    const hasSecurityIssues = (user) => {
        return user.temporary_suspension_until && new Date(user.temporary_suspension_until) > new Date()
    }

    const resetUserSecurity = async (userId, type = 'all') => {
        const confirmReset = window.confirm(`Are you sure you want to reset security attempts for this user?`)
        
        if (confirmReset) {
            try {
                const response = await Axios({
                    ...SummaryApi.resetUserSecurity,
                    url: `${SummaryApi.resetUserSecurity.url}/${userId}`,
                    data: { type }
                })

                if (response.data.success) {
                    toast.success(response.data.message)
                    fetchUsers()
                }
            } catch (error) {
                AxiosToastError(error)
            }
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <section className='p-4'>
            <div className='bg-white shadow-md rounded'>
                <div className='p-4 border-b'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div>
                            <h1 className='font-semibold text-lg'>User Management</h1>
                            <p className='text-sm text-gray-600'>Manage registered users - Total: {totalUsers}</p>
                        </div>
                        
                        <div className='w-full max-w-md relative'>
                            <IoSearchOutline size={25} className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search by name or email...'
                                className='w-full bg-blue-50 pl-10 pr-4 py-2 rounded outline-none border focus-within:border-primary-200'
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    {loading ? (
                        <div className='flex justify-center items-center h-64'>
                            <Loading />
                        </div>
                    ) : (
                        <div className='min-w-full'>
                            {users.length > 0 ? (
                                <>
                                    <table className='w-full text-sm'>
                                        <thead className='bg-gray-50'>
                                            <tr>
                                                <th className='px-4 py-3 text-left font-medium text-gray-700'>User</th>
                                                <th className='px-4 py-3 text-left font-medium text-gray-700'>Role</th>
                                                <th className='px-4 py-3 text-left font-medium text-gray-700'>Status</th>
                                                <th className='px-4 py-3 text-left font-medium text-gray-700'>Email Verified</th>
                                                <th className='px-4 py-3 text-left font-medium text-gray-700'>Security</th>
                                                <th className='px-4 py-3 text-left font-medium text-gray-700'>Last Login</th>
                                                <th className='px-4 py-3 text-left font-medium text-gray-700'>Joined</th>
                                                <th className='px-4 py-3 text-center font-medium text-gray-700'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200'>
                                            {users.map((user) => (
                                                <tr key={user._id} className='hover:bg-gray-50'>
                                                    <td className='px-4 py-3'>
                                                        <div className='flex items-center gap-3'>
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
                                                                <div className='font-medium text-gray-900'>{user.name}</div>
                                                                <div className='text-gray-500 text-sm'>{user.email}</div>
                                                                {user.mobile && (
                                                                    <div className='text-gray-500 text-sm'>{user.mobile}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-4 py-3'>
                                                        <div className='flex items-center gap-2'>
                                                            {getRoleIcon(user.role)}
                                                            <span className={`font-medium ${user.role === 'ADMIN' ? 'text-blue-600' : 'text-gray-600'}`}>
                                                                {user.role || 'USER'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className='px-4 py-3'>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className='px-4 py-3'>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            user.verify_email ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                                                        }`}>
                                                            {user.verify_email ? 'Verified' : 'Not Verified'}
                                                        </span>
                                                    </td>
                                                    <td className='px-4 py-3'>
                                                        <div className='flex items-center gap-2'>
                                                            {hasSecurityIssues(user) && (
                                                                <FaExclamationTriangle className="text-red-500" title="Security Issues Detected" />
                                                            )}
                                                            <button
                                                                onClick={() => setSecurityUser(user)}
                                                                className='p-1 text-orange-600 hover:bg-orange-100 rounded transition-colors text-sm'
                                                                title='View Security Details'
                                                            >
                                                                <MdSecurity size={14} />
                                                            </button>
                                                            {hasSecurityIssues(user) && (
                                                                <button
                                                                    onClick={() => resetUserSecurity(user._id)}
                                                                    className='p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors text-sm'
                                                                    title='Reset Security Issues'
                                                                >
                                                                    <MdRefresh size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className='px-4 py-3 text-gray-600'>
                                                        {user.last_login_date ? formatDate(user.last_login_date) : 'Never'}
                                                    </td>
                                                    <td className='px-4 py-3 text-gray-600'>
                                                        {formatDate(user.createdAt)}
                                                    </td>
                                                    <td className='px-4 py-3'>
                                                        <div className='flex justify-center gap-2'>
                                                            <button
                                                                onClick={() => setEditUser(user)}
                                                                className='p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors'
                                                                title='Edit User'
                                                            >
                                                                <MdEdit size={16} />
                                                            </button>
                                                            {user.role !== 'ADMIN' && (
                                                                <button
                                                                    onClick={() => handleDeleteUser(user._id, user.name)}
                                                                    className='p-2 text-red-600 hover:bg-red-100 rounded transition-colors'
                                                                    title='Delete User'
                                                                >
                                                                    <MdDelete size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    <div className='flex justify-between items-center p-4 border-t'>
                                        <button
                                            onClick={handlePrevious}
                                            disabled={page === 1}
                                            className={`px-4 py-2 rounded ${
                                                page === 1 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'border border-primary-200 hover:bg-primary-200'
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        <span className='text-sm text-gray-600'>
                                            Page {page} of {totalPageCount}
                                        </span>
                                        <button
                                            onClick={handleNext}
                                            disabled={page === totalPageCount}
                                            className={`px-4 py-2 rounded ${
                                                page === totalPageCount 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'border border-primary-200 hover:bg-primary-200'
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className='text-center py-12'>
                                    <p className='text-gray-500'>No users found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {editUser && (
                <UserEditModal
                    user={editUser}
                    close={() => setEditUser(null)}
                    onUpdate={fetchUsers}
                />
            )}

            {securityUser && (
                <UserSecurityModal
                    user={securityUser}
                    close={() => setSecurityUser(null)}
                    onReset={fetchUsers}
                />
            )}
        </section>
    )
}

export default UserManagement
