import React, { useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const ResendVerificationEmail = ({ email }) => {
    const [loading, setLoading] = useState(false)

    const handleResendVerification = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.resendVerificationEmail,
                data: { email }
            })

            if (response.data.success) {
                toast.success(response.data.message)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='mt-2'>
            <button
                onClick={handleResendVerification}
                disabled={loading}
                className='text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>
        </div>
    )
}

export default ResendVerificationEmail
