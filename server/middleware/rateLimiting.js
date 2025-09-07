import rateLimit, { MemoryStore } from 'express-rate-limit'
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

// Enhanced rate limiting for sensitive operations (password resets, email verification)
export const sensitiveRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window (reduced from 1 hour)
  max: 5, // Allow 5 requests per 15 minutes for OTP operations
  message: {
    error: true,
    message: "Too many requests for this operation, please try again in 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests from the count
  skipSuccessfulRequests: true,
  // Store in memory (upgrade to Redis for production)
  store: new MemoryStore()
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
