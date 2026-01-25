import mongoose from 'mongoose'

// MongoDB injection protection middleware
export const mongoSanitize = (req, res, next) => {
    // Recursively remove any keys that start with '$' or contain '.'
    const sanitize = (payload) => {
        if (payload && typeof payload === 'object') {
            for (const key in payload) {
                if (/^\$/.test(key) || /\./.test(key)) {
                    delete payload[key]
                } else if (typeof payload[key] === 'object') {
                    sanitize(payload[key])
                }
            }
        }
    }

    sanitize(req.body)
    sanitize(req.query)
    sanitize(req.params)
    
    next()
}

// Validate MongoDB ObjectIds
export const validateObjectId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName] || req.body[paramName]
        
        if (id && !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: `Invalid ${paramName} format`,
                error: true,
                success: false
            })
        }
        
        next()
    }
}

// Prevent parameter pollution
export const preventParameterPollution = (req, res, next) => {
    try {
        // Convert arrays to single values for specific parameters
        const singleValueParams = ['email', 'id', 'userId', 'token', 'otp']
        
        // Ensure req.query and req.body exist
        if (!req.query) req.query = {}
        if (!req.body) req.body = {}
        
        for (const param of singleValueParams) {
            if (req.query && req.query[param] && Array.isArray(req.query[param])) {
                req.query[param] = req.query[param][0] // Take only the first value
            }
            if (req.body && req.body[param] && Array.isArray(req.body[param])) {
                req.body[param] = req.body[param][0] // Take only the first value
            }
        }
        
        next()
    } catch (error) {
        console.error('Parameter pollution prevention error:', error)
        next() // Continue even if there's an error
    }
}

export default {
    mongoSanitize,
    validateObjectId,
    preventParameterPollution
}
