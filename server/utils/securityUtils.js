import UserModel from '../models/user.model.js'

// Constants for security limits
const MAX_DAILY_ATTEMPTS = 5
const SUSPENSION_DURATION_HOURS = 1
const SUSPICIOUS_ACTIVITY_THRESHOLD = 3

// Check if user is temporarily suspended
export const checkTemporarySuspension = async (email) => {
    const user = await UserModel.findOne({ email })
    
    if (!user) return { suspended: false, user: null }
    
    if (user.temporary_suspension_until && user.temporary_suspension_until > new Date()) {
        return {
            suspended: true,
            user,
            suspensionEnds: user.temporary_suspension_until,
            reason: user.suspension_reason
        }
    }
    
    // Clear suspension if expired
    if (user.temporary_suspension_until && user.temporary_suspension_until <= new Date()) {
        await UserModel.updateOne(
            { _id: user._id },
            {
                $unset: {
                    temporary_suspension_until: 1,
                    suspension_reason: 1
                },
                suspicious_activity_count: 0
            }
        )
    }
    
    return { suspended: false, user }
}

// Check and increment verification email attempts
export const checkVerificationEmailLimits = async (email) => {
    const user = await UserModel.findOne({ email })
    
    if (!user) {
        // For non-existent users, we still track attempts to prevent enumeration
        return await handleSuspiciousActivity(email, 'verification_email')
    }
    
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    // Reset daily counter if 24 hours have passed
    if (user.email_verification_attempts_reset < oneDayAgo) {
        await UserModel.updateOne(
            { _id: user._id },
            {
                email_verification_attempts: 0,
                email_verification_attempts_reset: now
            }
        )
        user.email_verification_attempts = 0
    }
    
    // Check if user has exceeded daily limit
    if (user.email_verification_attempts >= MAX_DAILY_ATTEMPTS) {
        return {
            allowed: false,
            reason: 'daily_limit_exceeded',
            attemptsRemaining: 0,
            resetTime: new Date(user.email_verification_attempts_reset.getTime() + 24 * 60 * 60 * 1000)
        }
    }
    
    // Increment attempt counter
    await UserModel.updateOne(
        { _id: user._id },
        {
            $inc: { email_verification_attempts: 1 }
        }
    )
    
    return {
        allowed: true,
        attemptsRemaining: MAX_DAILY_ATTEMPTS - (user.email_verification_attempts + 1),
        user
    }
}

// Check and increment forgot password attempts
export const checkForgotPasswordLimits = async (email) => {
    const user = await UserModel.findOne({ email })
    
    if (!user) {
        // For non-existent users, we still track attempts to prevent enumeration
        return await handleSuspiciousActivity(email, 'forgot_password')
    }
    
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    // Reset daily counter if 24 hours have passed
    if (user.forgot_password_attempts_reset < oneDayAgo) {
        await UserModel.updateOne(
            { _id: user._id },
            {
                forgot_password_attempts: 0,
                forgot_password_attempts_reset: now
            }
        )
        user.forgot_password_attempts = 0
    }
    
    // Check if user has exceeded daily limit
    if (user.forgot_password_attempts >= MAX_DAILY_ATTEMPTS) {
        return {
            allowed: false,
            reason: 'daily_limit_exceeded',
            attemptsRemaining: 0,
            resetTime: new Date(user.forgot_password_attempts_reset.getTime() + 24 * 60 * 60 * 1000)
        }
    }
    
    // Increment attempt counter
    await UserModel.updateOne(
        { _id: user._id },
        {
            $inc: { forgot_password_attempts: 1 }
        }
    )
    
    return {
        allowed: true,
        attemptsRemaining: MAX_DAILY_ATTEMPTS - (user.forgot_password_attempts + 1),
        user
    }
}

// Handle suspicious activity (fake email attempts)
export const handleSuspiciousActivity = async (email, activityType) => {
    // For non-existent emails, we create a temporary record to track suspicious activity
    // But we don't actually create a user account
    
    // Try to find existing user first
    let user = await UserModel.findOne({ email })
    
    if (user) {
        // Increment suspicious activity counter
        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id,
            {
                $inc: { suspicious_activity_count: 1 }
            },
            { new: true }
        )
        
        // If user has reached suspicious activity threshold, suspend them
        if (updatedUser.suspicious_activity_count >= SUSPICIOUS_ACTIVITY_THRESHOLD) {
            const suspensionEnd = new Date(Date.now() + SUSPENSION_DURATION_HOURS * 60 * 60 * 1000)
            
            await UserModel.updateOne(
                { _id: user._id },
                {
                    temporary_suspension_until: suspensionEnd,
                    suspension_reason: `Suspicious activity detected: Multiple attempts with invalid ${activityType} requests`,
                    status: 'Suspended'
                }
            )
            
            return {
                allowed: false,
                reason: 'user_suspended',
                suspensionEnd,
                suspensionReason: `Account temporarily suspended due to suspicious activity`
            }
        }
    }
    
    // For non-existent users, we still deny the request but don't reveal that the email doesn't exist
    return {
        allowed: false,
        reason: 'user_not_found',
        message: 'If this email exists in our system, we will send the requested email.'
    }
}

// Reset user attempts (for admin use or after successful operations)
export const resetUserAttempts = async (userId, type = 'all') => {
    const updateFields = {}
    let unsetFields = {}
    
    if (type === 'all' || type === 'verification') {
        updateFields.email_verification_attempts = 0
        updateFields.email_verification_attempts_reset = new Date()
    }
    
    if (type === 'all' || type === 'password') {
        updateFields.forgot_password_attempts = 0
        updateFields.forgot_password_attempts_reset = new Date()
    }
    
    if (type === 'all' || type === 'suspicious') {
        updateFields.suspicious_activity_count = 0
        unsetFields.temporary_suspension_until = 1
        unsetFields.suspension_reason = 1
        
        // Also set status to Active if it was suspended
        const user = await UserModel.findById(userId)
        if (user && user.status === 'Suspended') {
            updateFields.status = 'Active'
        }
    }
    
    const updateOperation = { ...updateFields }
    if (Object.keys(unsetFields).length > 0) {
        updateOperation.$unset = unsetFields
    }
    
    await UserModel.updateOne({ _id: userId }, updateOperation)
}

// Get security status for a user (for admin dashboard)
export const getUserSecurityStatus = async (email) => {
    const user = await UserModel.findOne({ email })
    
    if (!user) return null
    
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    return {
        email: user.email,
        verificationAttempts: user.email_verification_attempts || 0,
        verificationAttemptsReset: user.email_verification_attempts_reset,
        forgotPasswordAttempts: user.forgot_password_attempts || 0,
        forgotPasswordAttemptsReset: user.forgot_password_attempts_reset,
        suspiciousActivityCount: user.suspicious_activity_count || 0,
        isTemporarilySuspended: user.temporary_suspension_until && user.temporary_suspension_until > now,
        suspensionEnd: user.temporary_suspension_until,
        suspensionReason: user.suspension_reason,
        status: user.status
    }
}

export default {
    checkTemporarySuspension,
    checkVerificationEmailLimits,
    checkForgotPasswordLimits,
    handleSuspiciousActivity,
    resetUserAttempts,
    getUserSecurityStatus
}
