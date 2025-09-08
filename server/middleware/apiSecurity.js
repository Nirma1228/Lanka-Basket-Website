import validator from 'validator'

// Request size limiting
export const requestSizeLimit = (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || '0')
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (contentLength > maxSize) {
        return res.status(413).json({
            message: 'Request entity too large',
            error: true,
            success: false
        })
    }

    next()
}

// API key validation (for future API access)
export const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']
    const validApiKeys = process.env.VALID_API_KEYS ? process.env.VALID_API_KEYS.split(',') : []

    // Skip API key validation for browser requests (with cookies)
    if (req.cookies.accessToken || !req.headers['x-api-key']) {
        return next()
    }

    if (!apiKey || !validApiKeys.includes(apiKey)) {
        return res.status(401).json({
            message: 'Invalid or missing API key',
            error: true,
            success: false
        })
    }

    next()
}

// Validate request origin
export const validateOrigin = (req, res, next) => {
    const origin = req.get('Origin') || req.get('Referer')
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:3000',
        'https://lively-river-02e6bc000.1.azurestaticapps.net'
    ]

    // Allow requests without origin (mobile apps, Postman, etc.)
    if (!origin) {
        return next()
    }

    const isAllowed = allowedOrigins.some(allowed => 
        origin.startsWith(allowed) || origin === allowed
    )

    if (!isAllowed) {
        return res.status(403).json({
            message: 'Origin not allowed',
            error: true,
            success: false
        })
    }

    next()
}

// User-Agent validation to block suspicious requests
export const validateUserAgent = (req, res, next) => {
    const userAgent = req.get('User-Agent')
    
    // Block requests without User-Agent
    if (!userAgent) {
        return res.status(400).json({
            message: 'User-Agent header required',
            error: true,
            success: false
        })
    }

    // Block known malicious user agents
    const maliciousPatterns = [
        /sqlmap/i,
        /nikto/i,
        /masscan/i,
        /netsparker/i,
        /acunetix/i,
        /burpsuite/i,
        /havij/i,
        /w3af/i
    ]

    const isMalicious = maliciousPatterns.some(pattern => 
        pattern.test(userAgent)
    )

    if (isMalicious) {
        // Log the attempt
        console.warn(`Blocked malicious User-Agent: ${userAgent} from IP: ${req.ip}`)
        
        return res.status(403).json({
            message: 'Access denied',
            error: true,
            success: false
        })
    }

    next()
}

// Request method validation
export const validateHttpMethods = (req, res, next) => {
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
    
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).json({
            message: 'Method not allowed',
            error: true,
            success: false
        })
    }
    
    next()
}

export default {
    requestSizeLimit,
    validateApiKey,
    validateOrigin,
    validateUserAgent,
    validateHttpMethods
}
