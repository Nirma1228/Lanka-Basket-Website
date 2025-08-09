import rateLimit from 'express-rate-limit'
// Temporarily disable MongoDB store to fix connection issues
// import MongoStore from 'rate-limit-mongo'

// General API rate limiting (using memory store for now)
export const generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        message: "Too many requests from this IP, please try again later",
        error: true,
        success: false
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Using memory store instead of MongoDB for now
    // store: new MongoStore({
    //     uri: process.env.MONGODB_URI,
    //     collectionName: 'rate_limits',
    //     expireTimeMs: 15 * 60 * 1000
    // })
})

// Strict rate limiting for authentication endpoints (using memory store)
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per 15 minutes
    message: {
        message: "Too many login attempts, please try again in 15 minutes",
        error: true,
        success: false
    },
    skipSuccessfulRequests: true,
    // Using memory store instead of MongoDB for now
    // store: new MongoStore({
    //     uri: process.env.MONGODB_URI,
    //     collectionName: 'auth_rate_limits',
    //     expireTimeMs: 15 * 60 * 1000
    // })
})

// Rate limiting for sensitive operations (password reset, email verification)
export const sensitiveRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 requests per hour
    message: {
        message: "Too many requests for this operation, please try again in an hour",
        error: true,
        success: false
    },
    // Using memory store instead of MongoDB for now
    // store: new MongoStore({
    //     uri: process.env.MONGODB_URI,
    //     collectionName: 'sensitive_rate_limits',
    //     expireTimeMs: 60 * 60 * 1000
    // })
})

// Rate limiting for file uploads
export const uploadRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 uploads per hour
    message: {
        message: "Upload limit exceeded, please try again later",
        error: true,
        success: false
    },
    // Using memory store instead of MongoDB for now
    // store: new MongoStore({
    //     uri: process.env.MONGODB_URI,
    //     collectionName: 'upload_rate_limits',
    //     expireTimeMs: 60 * 60 * 1000
    // })
})

export default {
    generalRateLimit,
    authRateLimit,
    sensitiveRateLimit,
    uploadRateLimit
}
