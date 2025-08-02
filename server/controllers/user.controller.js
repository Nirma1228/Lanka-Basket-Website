import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import genertedRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageClodinary from '../utils/uploadImageClodinary.js'
import generatedOtp from '../utils/generatedOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import jwt from 'jsonwebtoken'
import validatePasswordStrength from '../utils/passwordValidation.js'
import generateVerificationToken from '../utils/generateVerificationToken.js'

export async function registerUserController(request,response){
    try {
        const { name, email , password } = request.body

        if(!name || !email || !password){
            return response.status(400).json({
                message : "provide email, name, password",
                error : true,
                success : false
            })
        }

        // Validate password strength
        const passwordValidation = validatePasswordStrength(password)
        if (!passwordValidation.isValid) {
            return response.status(400).json({
                message : `Password is not strong enough: ${passwordValidation.errors.join(', ')}`,
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(user){
            return response.json({
                message : "Already register email",
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)

        // Generate verification token
        const verificationToken = generateVerificationToken()
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

        const payload = {
            name,
            email,
            password : hashPassword,
            verify_email_token: verificationToken,
            verify_email_token_expiry: verificationTokenExpiry
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`

        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify your email - Lanka Basket",
            html : verifyEmailTemplate({
                name,
                url : VerifyEmailUrl
            })
        })

        // Check if email sending failed
        if (verifyEmail && verifyEmail.error) {
            console.error('Verification email sending failed:', verifyEmail.error);
            return response.status(500).json({
                message : "Failed to send verification email. Please try again later.",
                error : true,
                success : false
            })
        }

        return response.json({
            message : "User registered successfully. Please check your email to verify your account.",
            error : false,
            success : true,
            data : {
                id: save._id,
                name: save.name,
                email: save.email,
                verify_email: save.verify_email
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function verifyEmailController(request,response){
    try {
        const { token } = request.body

        if(!token){
            return response.status(400).json({
                message : "Verification token is required",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ 
            verify_email_token: token,
            verify_email_token_expiry: { $gt: new Date() } // Token not expired
        })

        if(!user){
            return response.status(400).json({
                message : "Invalid or expired verification token",
                error : true,
                success : false
            })
        }

        // Check if already verified
        if(user.verify_email){
            return response.status(400).json({
                message : "Email is already verified",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.updateOne({ _id : user._id },{
            verify_email : true,
            verify_email_token: "",
            verify_email_token_expiry: null
        })

        return response.json({
            message : "Email verified successfully! You can now login to your account.",
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//resend verification email
export async function resendVerificationEmailController(request,response){
    try {
        const { email } = request.body

        if(!email){
            return response.status(400).json({
                message : "Email is required",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "User not found with this email",
                error : true,
                success : false
            })
        }

        if(user.verify_email){
            return response.status(400).json({
                message : "Email is already verified",
                error : true,
                success : false
            })
        }

        // Generate new verification token
        const verificationToken = generateVerificationToken()
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

        await UserModel.updateOne({ _id: user._id }, {
            verify_email_token: verificationToken,
            verify_email_token_expiry: verificationTokenExpiry
        })

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`

        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify your email - Lanka Basket",
            html : verifyEmailTemplate({
                name: user.name,
                url : VerifyEmailUrl
            })
        })

        // Check if email sending failed
        if (verifyEmail && verifyEmail.error) {
            console.error('Resend verification email failed:', verifyEmail.error);
            return response.status(500).json({
                message : "Failed to send verification email. Please try again later.",
                error : true,
                success : false
            })
        }

        return response.json({
            message : "Verification email sent successfully. Please check your email.",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//login controller
export async function loginController(request,response){
    try {
        const { email , password } = request.body


        if(!email || !password){
            return response.status(400).json({
                message : "provide email, password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "User not register",
                error : true,
                success : false
            })
        }

        if(user.status !== "Active"){
            return response.status(400).json({
                message : "Contact to Admin",
                error : true,
                success : false
            })
        }

        // Check if email is verified
        if(!user.verify_email){
            return response.status(400).json({
                message : "Your Account is Not Activated please verify your mail",
                error : true,
                success : false
            })
        }

        const checkPassword = await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return response.status(400).json({
                message : "Check your password",
                error : true,
                success : false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await genertedRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.cookie('accessToken',accesstoken,cookiesOption)
        response.cookie('refreshToken',refreshToken,cookiesOption)

        return response.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//logout controller
export async function logoutController(request,response){
    try {
        const userid = request.userId //middleware

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.clearCookie("accessToken",cookiesOption)
        response.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return response.json({
            message : "Logout successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//upload user avatar
export async  function uploadAvatar(request,response){
    try {
        const userId = request.userId // auth middlware
        const image = request.file  // multer middleware

        const upload = await uploadImageClodinary(image)
        
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })

        return response.json({
            message : "upload profile",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update user details
export async function updateUserDetails(request,response){
    try {
        const userId = request.userId //auth middleware
        const { name, email, mobile, password } = request.body 

        let hashPassword = ""

        if(password){
            // Validate password strength when updating password
            const passwordValidation = validatePasswordStrength(password)
            if (!passwordValidation.isValid) {
                return response.status(400).json({
                    message : `Password is not strong enough: ${passwordValidation.errors.join(', ')}`,
                    error : true,
                    success : false
                })
            }

            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password,salt)
        }

        const updateUser = await UserModel.updateOne({ _id : userId},{
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && { mobile : mobile }),
            ...(password && { password : hashPassword })
        })

        return response.json({
            message : "Updated successfully",
            error : false,
            success : true,
            data : updateUser
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//forgot password not login
export async function forgotPasswordController(request,response) {
    try {
        const { email } = request.body 

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000 // 1hr

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        const emailResult = await sendEmail({
            sendTo : email,
            subject : "Forgot password from Lanka Basket",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        console.log('Email send result:', emailResult);

        // Check if email sending failed
        if (emailResult && emailResult.error) {
            console.error('Email sending failed:', emailResult.error);
            return response.status(500).json({
                message : "Failed to send email. Please try again later.",
                error : true,
                success : false
            })
        }

        // Check if email was sent successfully
        if (!emailResult || !emailResult.success) {
            console.error('Email sending failed - no success response');
            return response.status(500).json({
                message : "Failed to send email. Please try again later.",
                error : true,
                success : false
            })
        }

        return response.json({
            message : "Check your email for the OTP code",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//verify forgot password otp
export async function verifyForgotPasswordOtp(request,response){
    try {
        const { email , otp }  = request.body

        if(!email || !otp){
            return response.status(400).json({
                message : "Provide required field email, otp.",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime  ){
            return response.status(400).json({
                message : "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
        
        return response.json({
            message : "Verify otp successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//reset the password
export async function resetpassword(request,response){
    try {
        const { email , newPassword, confirmPassword } = request.body 

        if(!email || !newPassword || !confirmPassword){
            return response.status(400).json({
                message : "provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email is not available",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message : "newPassword and confirmPassword must be same.",
                error : true,
                success : false,
            })
        }

        // Validate password strength
        const passwordValidation = validatePasswordStrength(newPassword)
        if (!passwordValidation.isValid) {
            return response.status(400).json({
                message : `Password is not strong enough: ${passwordValidation.errors.join(', ')}`,
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return response.json({
            message : "Password updated successfully.",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//refresh token controler
export async function refreshToken(request,response){
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.cookie('accessToken',newAccessToken,cookiesOption)

        return response.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//get login user details
export async function userDetails(request,response){
    try {
        const userId  = request.userId

        console.log(userId)

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}