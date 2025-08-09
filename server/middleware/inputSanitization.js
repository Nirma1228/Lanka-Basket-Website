import validator from 'validator'
import DOMPurify from 'isomorphic-dompurify'

// Input sanitization middleware
export const sanitizeInput = (req, res, next) => {
    try {
        // Ensure req.body and req.query exist
        if (!req.body) req.body = {}
        if (!req.query) req.query = {}
        
        // Sanitize all string inputs in body
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                // Remove HTML tags and potentially harmful content
                req.body[key] = DOMPurify.sanitize(req.body[key], { ALLOWED_TAGS: [] })
                
                // Trim whitespace
                req.body[key] = req.body[key].trim()
                
                // Escape HTML entities
                req.body[key] = validator.escape(req.body[key])
            }
        }
        
        // Sanitize query parameters
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = DOMPurify.sanitize(req.query[key], { ALLOWED_TAGS: [] })
                req.query[key] = req.query[key].trim()
                req.query[key] = validator.escape(req.query[key])
            }
        }
        
        next()
    } catch (error) {
        return res.status(400).json({
            message: "Invalid input data",
            error: true,
            success: false
        })
    }
}

// Email validation middleware
export const validateEmail = (req, res, next) => {
    const { email } = req.body
    
    if (email && !validator.isEmail(email)) {
        return res.status(400).json({
            message: "Invalid email format",
            error: true,
            success: false
        })
    }
    
    next()
}

// MongoDB injection protection
export const preventNoSQLInjection = (req, res, next) => {
    try {
        // Check for MongoDB operators in request body
        const checkForInjection = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (Array.isArray(obj[key])) {
                        obj[key].forEach(checkForInjection)
                    } else {
                        checkForInjection(obj[key])
                    }
                } else if (typeof obj[key] === 'string') {
                    // Check for MongoDB operators
                    if (key.startsWith('$') || obj[key].includes('$where') || obj[key].includes('$regex')) {
                        throw new Error('Potential NoSQL injection detected')
                    }
                }
            }
        }
        
        checkForInjection(req.body)
        checkForInjection(req.query)
        checkForInjection(req.params)
        
        next()
    } catch (error) {
        return res.status(400).json({
            message: "Invalid request format",
            error: true,
            success: false
        })
    }
}

export default {
    sanitizeInput,
    validateEmail,
    preventNoSQLInjection
}
