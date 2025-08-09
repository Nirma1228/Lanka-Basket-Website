import { Router } from 'express'
import { forgotPasswordController, loginController, logoutController, refreshToken, registerUserController, resendVerificationEmailController, resetpassword, updateUserDetails, uploadAvatar, userDetails, verifyEmailController, verifyForgotPasswordOtp, getAllUsersController, deleteUserController, updateUserRoleController, resetUserSecurityController, getUserSecurityStatusController } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import upload, { handleMulterError } from '../middleware/multer.js'
import { admin } from '../middleware/Admin.js'
import { authRateLimit, sensitiveRateLimit, uploadRateLimit } from '../middleware/rateLimiting.js'
import { validateEmail } from '../middleware/inputSanitization.js'
import { validateObjectId } from '../middleware/mongoSecurity.js'

const userRouter = Router()

// Authentication routes with rate limiting
userRouter.post('/register', authRateLimit, validateEmail, registerUserController)
userRouter.post('/verify-email', sensitiveRateLimit, verifyEmailController)
userRouter.post('/resend-verification-email', sensitiveRateLimit, validateEmail, resendVerificationEmailController)
userRouter.post('/login', authRateLimit, validateEmail, loginController)
userRouter.get('/logout', auth, logoutController)

// Password management with enhanced security
userRouter.put('/forgot-password', sensitiveRateLimit, validateEmail, forgotPasswordController)
userRouter.put('/verify-forgot-password-otp', sensitiveRateLimit, validateEmail, verifyForgotPasswordOtp)
userRouter.put('/reset-password', sensitiveRateLimit, validateEmail, resetpassword)

// User profile management
userRouter.put('/upload-avatar', auth, uploadRateLimit, upload.single('avatar'), handleMulterError, uploadAvatar)
userRouter.put('/update-user', auth, validateEmail, updateUserDetails)
userRouter.get('/user-details', auth, userDetails)
userRouter.post('/refresh-token', refreshToken)

// Admin routes with enhanced validation and proper error handling
userRouter.post('/admin/get-all-users', auth, admin, getAllUsersController)
userRouter.delete('/admin/delete-user/:userId', auth, admin, validateObjectId('userId'), deleteUserController)
userRouter.put('/admin/update-user-role/:userId', auth, admin, validateObjectId('userId'), updateUserRoleController)
userRouter.put('/admin/reset-security/:userId', auth, admin, validateObjectId('userId'), resetUserSecurityController)
userRouter.get('/admin/security-status/:email', auth, admin, getUserSecurityStatusController)

export default userRouter