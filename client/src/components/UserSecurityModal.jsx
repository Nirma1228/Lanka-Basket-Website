import React, { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5"
import { MdRefresh, MdSecurity } from "react-icons/md"
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa"
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'

const UserSecurityModal = ({ user, close, onReset }) => {
    const [loading, setLoading] = useState(false)
    const [securityData, setSecurityData] = useState(null)
    const [resetLoading, setResetLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchSecurityData = async () => {
        try {
            setLoading(true)
            setError(null)
            console.log('Fetching security data for user:', user.email)
            const response = await Axios({
                ...SummaryApi.getUserSecurityStatus,
                url: `${SummaryApi.getUserSecurityStatus.url}/${encodeURIComponent(user.email)}`
            })

            console.log('Security data response:', response.data)

            if (response.data.success) {
                setSecurityData(response.data.data)
            } else {
                setError(response.data.message || 'Failed to fetch security data')
            }
        } catch (error) {
            console.error('Error fetching security data:', error)
            setError(error.response?.data?.message || error.message || 'Failed to fetch security data')
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSecurityData()
    }, [])

    const resetSecurity = async (type = 'all') => {
        try {
            setResetLoading(true)
            const response = await Axios({
                ...SummaryApi.resetUserSecurity,
                url: `${SummaryApi.resetUserSecurity.url}/${user._id}`,
                data: { type }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                fetchSecurityData() // Refresh data
                onReset() // Refresh main user list
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setResetLoading(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Never'
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getRemainingTime = (endTime) => {
        if (!endTime) return null
        const now = new Date()
        const end = new Date(endTime)
        const diff = end - now
        
        if (diff <= 0) return 'Expired'
        
        const minutes = Math.ceil(diff / (1000 * 60))
        const hours = Math.floor(minutes / 60)
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m remaining`
        }
        return `${minutes}m remaining`
    }

    const getResetTime = (resetDate) => {
        if (!resetDate) return 'Unknown'
        const reset = new Date(resetDate)
        const nextReset = new Date(reset.getTime() + 24 * 60 * 60 * 1000)
        return formatDate(nextReset)
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
                <div className='flex justify-between items-center p-4 border-b'>
                    <div className='flex items-center gap-2'>
                        <MdSecurity className="text-orange-600" size={20} />
                        <h2 className='text-lg font-semibold'>Security Status</h2>
                    </div>
                    <button
                        onClick={close}
                        className='p-1 hover:bg-gray-100 rounded'
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                <div className='p-4'>
                    {/* User Info */}
                    <div className='mb-4 p-3 bg-gray-50 rounded'>
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
                                <div className='font-medium'>{user.name}</div>
                                <div className='text-sm text-gray-600'>{user.email}</div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className='flex justify-center items-center h-32'>
                            <Loading />
                        </div>
                    ) : error ? (
                        <div className='text-center py-8'>
                            <div className='text-red-500 mb-2'>
                                <FaExclamationTriangle size={24} className="mx-auto" />
                            </div>
                            <p className='text-red-600 mb-2'>Error loading security data</p>
                            <p className='text-sm text-gray-600 mb-4'>{error}</p>
                            <button
                                onClick={fetchSecurityData}
                                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                            >
                                Retry
                            </button>
                        </div>
                    ) : securityData ? (
                        <div className='space-y-4'>
                            {/* Debug info */}
                            <div className='text-xs text-gray-500 p-2 bg-gray-100 rounded'>
                                Debug: Security data loaded successfully
                            </div>
                            
                            {/* Suspension Status */}
                            {securityData.isTemporarilySuspended ? (
                                <div className='p-4 bg-red-50 border border-red-200 rounded'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <FaExclamationTriangle className="text-red-500" />
                                        <h3 className='font-medium text-red-800'>Account Temporarily Suspended</h3>
                                    </div>
                                    <p className='text-red-700 text-sm mb-2'>{securityData.suspensionReason}</p>
                                    <p className='text-red-600 text-sm font-medium'>
                                        {getRemainingTime(securityData.suspensionEnd)}
                                    </p>
                                    <button
                                        onClick={() => resetSecurity('suspicious')}
                                        disabled={resetLoading}
                                        className='mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50'
                                    >
                                        {resetLoading ? 'Removing...' : 'Remove Suspension'}
                                    </button>
                                </div>
                            ) : (
                                <div className='p-4 bg-green-50 border border-green-200 rounded'>
                                    <div className='flex items-center gap-2'>
                                        <FaCheckCircle className="text-green-500" />
                                        <h3 className='font-medium text-green-800'>Account Active</h3>
                                    </div>
                                    <p className='text-green-700 text-sm'>No current suspensions</p>
                                </div>
                            )}

                            {/* Security Statistics */}
                            <div className='grid md:grid-cols-2 gap-4'>
                                <div className='p-4 border rounded'>
                                    <h4 className='font-medium mb-3'>Email Verification Attempts</h4>
                                    <div className='space-y-2'>
                                        <div className='flex justify-between'>
                                            <span className='text-sm text-gray-600'>Today's Attempts:</span>
                                            <span className={`font-medium ${securityData.verificationAttempts >= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                                                {securityData.verificationAttempts}/5
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-sm text-gray-600'>Resets at:</span>
                                            <span className='text-sm font-medium'>
                                                {getResetTime(securityData.verificationAttemptsReset)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => resetSecurity('verification')}
                                            disabled={resetLoading}
                                            className='w-full mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50'
                                        >
                                            Reset Verification Attempts
                                        </button>
                                    </div>
                                </div>

                                <div className='p-4 border rounded'>
                                    <h4 className='font-medium mb-3'>Password Reset Attempts</h4>
                                    <div className='space-y-2'>
                                        <div className='flex justify-between'>
                                            <span className='text-sm text-gray-600'>Today's Attempts:</span>
                                            <span className={`font-medium ${securityData.forgotPasswordAttempts >= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                                                {securityData.forgotPasswordAttempts}/5
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-sm text-gray-600'>Resets at:</span>
                                            <span className='text-sm font-medium'>
                                                {getResetTime(securityData.forgotPasswordAttemptsReset)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => resetSecurity('password')}
                                            disabled={resetLoading}
                                            className='w-full mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50'
                                        >
                                            Reset Password Attempts
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Suspicious Activity */}
                            <div className='p-4 border rounded'>
                                <h4 className='font-medium mb-3'>Suspicious Activity</h4>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <span className='text-sm text-gray-600'>Activity Count:</span>
                                        <span className={`ml-2 font-medium ${securityData.suspiciousActivityCount >= 3 ? 'text-red-600' : 'text-gray-900'}`}>
                                            {securityData.suspiciousActivityCount}/3
                                        </span>
                                    </div>
                                    {securityData.suspiciousActivityCount > 0 && (
                                        <button
                                            onClick={() => resetSecurity('suspicious')}
                                            disabled={resetLoading}
                                            className='px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50'
                                        >
                                            Clear Activity
                                        </button>
                                    )}
                                </div>
                                <p className='text-xs text-gray-500 mt-2'>
                                    Counts increase when requests are made with non-existent emails
                                </p>
                            </div>

                            {/* Reset All */}
                            <div className='pt-4 border-t'>
                                <button
                                    onClick={() => resetSecurity('all')}
                                    disabled={resetLoading}
                                    className='w-full py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2'
                                >
                                    <MdRefresh size={16} />
                                    {resetLoading ? 'Resetting...' : 'Reset All Security Data'}
                                </button>
                                <p className='text-xs text-gray-500 text-center mt-2'>
                                    This will reset all attempts and clear suspensions
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className='text-center py-8'>
                            <p className='text-gray-500'>Failed to load security data</p>
                            <button
                                onClick={fetchSecurityData}
                                className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserSecurityModal
