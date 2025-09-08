import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { IoSearchOutline } from "react-icons/io5"
import { MdDelete, MdEdit, MdSecurity, MdRefresh } from "react-icons/md"
import { FaUser, FaUserShield, FaExclamationTriangle, FaUsers, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import toast from 'react-hot-toast'
import UserEditModal from '../components/UserEditModal'
import UserSecurityModal from '../components/UserSecurityModal'
import LoadingSpinner from '../components/LoadingSpinner'
import UserAvatar from '../components/UserAvatar'

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
        return role === 'ADMIN' ? <FaUserShield className='text-blue-600' /> : <FaUser className='text-gray-600' />
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
        <div className='min-h-screen bg-gray-50'>
            {/* Modern Header */}
            <div className='bg-white shadow-lg border-b border-gray-200'>
                <div className='px-6 py-4'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md'>
                                <FaUsers className='text-white text-lg' />
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-gray-900'>User Management</h1>
                                <p className='text-sm text-gray-600'>
                                    Manage registered users • Total: {totalUsers} users
                                </p>
                            </div>
                        </div>
                        
                        {/* Search Bar */}
                        <div className='flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 max-w-md w-full focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200'>
                            <IoSearchOutline className='text-xl text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search by name or email...'
                                className='flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500'
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className='p-6'>
                <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
                    {loading ? (
                        <div className='p-12 text-center'>
                            <div className='flex flex-col items-center gap-4'>
                                <LoadingSpinner size="xl" />
                                <p className='text-gray-600 font-medium'>Loading users...</p>
                            </div>
                        </div>
                    ) : users.length > 0 ? (
                        <>
                            {/* Table */}
                            <div className='overflow-x-auto'>
                                <table className='w-full text-sm'>
                                    <thead className='bg-gray-50'>
                                        <tr>
                                            <th className='px-6 py-4 text-left font-semibold text-gray-700'>User</th>
                                            <th className='px-6 py-4 text-left font-semibold text-gray-700'>Role</th>
                                            <th className='px-6 py-4 text-left font-semibold text-gray-700'>Status</th>
                                            <th className='px-6 py-4 text-left font-semibold text-gray-700'>Email Verified</th>
                                            <th className='px-6 py-4 text-left font-semibold text-gray-700'>Security</th>
                                            <th className='px-6 py-4 text-left font-semibold text-gray-700'>Last Login</th>
                                            <th className='px-6 py-4 text-left font-semibold text-gray-700'>Joined</th>
                                            <th className='px-6 py-4 text-center font-semibold text-gray-700'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200'>
                                        {users.map((user) => (
                                            <tr key={user._id} className='hover:bg-gray-50 transition-colors duration-150'>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-3'>
                                                        <UserAvatar user={user} size="md" />
                                                        <div>
                                                            <div className='font-semibold text-gray-900'>{user.name}</div>
                                                            <div className='text-gray-500 text-sm'>{user.email}</div>
                                                            {user.mobile && (
                                                                <div className='text-gray-500 text-sm'>{user.mobile}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-2'>
                                                        {getRoleIcon(user.role)}
                                                        <span className={`font-semibold ${user.role === 'ADMIN' ? 'text-blue-600 ' : 'text-gray-600 '}`}>
                                                            {user.role || 'USER'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                        user.verify_email 
                                                            ? 'text-green-700 bg-green-100 border border-green-200 ' 
                                                            : 'text-red-700 bg-red-100 border border-red-200 '
                                                    }`}>
                                                        {user.verify_email ? 'Verified' : 'Not Verified'}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-2'>
                                                        {hasSecurityIssues(user) && (
                                                            <div className='p-1 bg-red-100 rounded-full'>
                                                                <FaExclamationTriangle className='text-red-600 text-sm' title="Security Issues Detected" />
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => setSecurityUser(user)}
                                                            className='p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors duration-200 border border-orange-200'
                                                            title='View Security Details'
                                                        >
                                                            <MdSecurity size={16} />
                                                        </button>
                                                        {hasSecurityIssues(user) && (
                                                            <button
                                                                onClick={() => resetUserSecurity(user._id)}
                                                                className='p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200'
                                                                title='Reset Security Issues'
                                                            >
                                                                <MdRefresh size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 text-gray-600'>
                                                    {user.last_login_date ? formatDate(user.last_login_date) : (
                                                        <span className='text-gray-400 italic'>Never</span>
                                                    )}
                                                </td>
                                                <td className='px-6 py-4 text-gray-600'>
                                                    {formatDate(user.createdAt)}
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex justify-center gap-2'>
                                                        <button
                                                            onClick={() => setEditUser(user)}
                                                            className='p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200'
                                                            title='Edit User'
                                                        >
                                                            <MdEdit size={16} />
                                                        </button>
                                                        {user.role !== 'ADMIN' && (
                                                            <button
                                                                onClick={() => handleDeleteUser(user._id, user.name)}
                                                                className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 border border-red-200'
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
                            </div>
                            
                            {/* Enhanced Pagination */}
                            {totalPageCount > 1 && (
                                <div className='border-t border-gray-200 p-4'>
                                    <div className='flex items-center justify-between'>
                                        <button
                                            onClick={handlePrevious}
                                            disabled={page === 1}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                page === 1 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 :bg-blue-900/50 border border-blue-200 '
                                            }`}
                                        >
                                            <FaChevronLeft className='text-sm' />
                                            <span>Previous</span>
                                        </button>
                                        
                                        <div className='flex items-center gap-4'>
                                            <span className='text-sm text-gray-600'>
                                                Page {page} of {totalPageCount} • {totalUsers} total users
                                            </span>
                                        </div>
                                        
                                        <button
                                            onClick={handleNext}
                                            disabled={page === totalPageCount}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                page === totalPageCount 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 :bg-blue-900/50 border border-blue-200 '
                                            }`}
                                        >
                                            <span>Next</span>
                                            <FaChevronRight className='text-sm' />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='p-12 text-center'>
                            <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <FaUsers className='text-3xl text-gray-400' />
                            </div>
                            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                {search ? 'No Users Found' : 'No Users Available'}
                            </h3>
                            <p className='text-gray-600'>
                                {search 
                                    ? `No users match "${search}". Try a different search term.`
                                    : 'No users have registered yet.'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
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
        </div>
    )
}

export default UserManagement
