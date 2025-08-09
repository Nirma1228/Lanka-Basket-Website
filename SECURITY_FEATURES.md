# Security Features Implementation

This document outlines the security features implemented to protect against abuse of email verification and forgot password services.

## Features Implemented

### 1. Rate Limiting
- **Email Verification**: Limited to 5 attempts per email address per day
- **Forgot Password**: Limited to 5 attempts per email address per day
- **Reset Schedule**: Limits reset every 24 hours automatically

### 2. Suspicious Activity Detection
- Tracks attempts made with non-existent email addresses
- After 3 suspicious attempts, the user account gets temporarily suspended
- Suspension duration: 1 hour

### 3. Temporary Account Suspension
- Users with suspicious activity are suspended for 1 hour
- Suspended users cannot:
  - Login to their account
  - Request email verification
  - Request password reset
- Suspension automatically expires after 1 hour

### 4. Enhanced Security Logging
New fields added to user model:
- `email_verification_attempts`: Daily counter for verification requests
- `email_verification_attempts_reset`: Timestamp for counter reset
- `forgot_password_attempts`: Daily counter for password reset requests
- `forgot_password_attempts_reset`: Timestamp for counter reset
- `suspicious_activity_count`: Counter for suspicious activities
- `temporary_suspension_until`: Timestamp until suspension ends
- `suspension_reason`: Reason for suspension

## API Endpoints

### User Endpoints (Protected by Security)
- `POST /api/user/resend-verification-email` - Enhanced with rate limiting
- `PUT /api/user/forgot-password` - Enhanced with rate limiting
- `POST /api/user/login` - Enhanced with suspension check

### Admin Endpoints
- `POST /api/user/admin/get-all-users` - Get all users with security info
- `PUT /api/user/admin/reset-security/:userId` - Reset user security attempts
- `GET /api/user/admin/security-status/:email` - Get user security status

## Frontend Components

### 1. User Management Dashboard
- View all registered users
- Display security status indicators
- Quick access to security controls

### 2. User Security Modal
- Detailed security information for each user
- Real-time suspension status
- Reset controls for different security aspects

### 3. Enhanced User Edit Modal
- Role management (USER/ADMIN)
- Status management (Active/Inactive/Suspended)
- Automatic suspension clearance when activating users

## Security Utils

### `securityUtils.js`
Main utility file containing:
- `checkTemporarySuspension()` - Check if user is suspended
- `checkVerificationEmailLimits()` - Rate limit verification emails
- `checkForgotPasswordLimits()` - Rate limit password reset requests
- `handleSuspiciousActivity()` - Handle fake email attempts
- `resetUserAttempts()` - Reset security counters (admin function)
- `getUserSecurityStatus()` - Get security status for admin dashboard

## Usage Examples

### For Regular Users
1. **Email Verification**: Users can request verification emails up to 5 times per day
2. **Password Reset**: Users can request password reset up to 5 times per day
3. **Fake Email Protection**: Attempts with non-existent emails count as suspicious activity

### For Administrators
1. **Monitor Security**: View security status in user management dashboard
2. **Reset Limits**: Clear security attempts for users who have been helped
3. **Handle Suspensions**: Remove temporary suspensions when appropriate

## Error Messages

### Rate Limiting
- `"Daily limit of 5 verification email requests exceeded. Try again after [timestamp]"`
- `"Daily limit of 5 password reset requests exceeded. Try again after [timestamp]"`

### Suspension
- `"Account temporarily suspended. Try again in [X] minutes."`
- `"Account temporarily suspended due to suspicious activity"`

### Generic (Security)
- `"If this email exists in our system, we will send the requested email."` (Used to prevent email enumeration)

## Configuration

### Security Constants (in `securityUtils.js`)
- `MAX_DAILY_ATTEMPTS = 5` - Maximum attempts per day
- `SUSPENSION_DURATION_HOURS = 1` - Suspension duration
- `SUSPICIOUS_ACTIVITY_THRESHOLD = 3` - Threshold for suspension

## Database Changes

### User Model Updates
```javascript
// New security fields added to user schema
email_verification_attempts: Number (default: 0)
email_verification_attempts_reset: Date (default: now)
forgot_password_attempts: Number (default: 0)
forgot_password_attempts_reset: Date (default: now)
suspicious_activity_count: Number (default: 0)
temporary_suspension_until: Date (default: null)
suspension_reason: String (default: "")
```

## Benefits

1. **Prevents Email Bombing**: Limits the number of emails that can be sent per user
2. **Reduces Server Load**: Prevents excessive email sending requests
3. **Detects Abuse**: Identifies users trying to enumerate email addresses
4. **Automatic Recovery**: Suspensions and limits reset automatically
5. **Admin Control**: Administrators can manually reset limits when needed
6. **User Privacy**: Doesn't reveal whether email addresses exist in the system

## Best Practices

1. **Monitor Logs**: Keep track of suspicious activities
2. **Regular Cleanup**: Old security data is automatically cleaned up
3. **Admin Intervention**: Use admin controls to help legitimate users
4. **User Communication**: Clear error messages help users understand limits

This security implementation provides robust protection against common email-based attacks while maintaining a good user experience for legitimate users.
