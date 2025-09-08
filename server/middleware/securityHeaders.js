import crypto from 'crypto'

// Enhanced security headers middleware
export const securityHeaders = (req, res, next) => {
    // Content Security Policy
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https: blob:; " +
        "connect-src 'self' https://api.stripe.com; " +
        "frame-src https://js.stripe.com https://checkout.stripe.com; " +
        "object-src 'none'; " +
        "base-uri 'self';"
    )
    
    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    
    // Remove server information
    res.removeHeader('X-Powered-By')
    res.setHeader('Server', 'Lanka-Basket')
    
    next()
}

// Simple CSRF protection for state-changing operations
export const csrfProtection = (req, res, next) => {
    // Skip CSRF for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next()
    }
    
    // Check for CSRF token in header
    const csrfToken = req.headers['x-csrf-token'] || req.headers['csrf-token']
    const sessionToken = req.headers['x-session-token']
    
    if (!csrfToken || !sessionToken) {
        return res.status(403).json({
            message: "CSRF token required",
            error: true,
            success: false
        })
    }
    
    // Validate CSRF token (simple implementation)
    // In production, use a more sophisticated CSRF library
    const expectedToken = crypto
        .createHmac('sha256', process.env.CSRF_SECRET || 'default-secret')
        .update(sessionToken)
        .digest('hex')
    
    if (csrfToken !== expectedToken) {
        return res.status(403).json({
            message: "Invalid CSRF token",
            error: true,
            success: false
        })
    }
    
    next()
}

// Generate CSRF token for client
export const generateCSRFToken = (sessionToken) => {
    return crypto
        .createHmac('sha256', process.env.CSRF_SECRET || 'default-secret')
        .update(sessionToken)
        .digest('hex')
}

export default {
    securityHeaders,
    csrfProtection,
    generateCSRFToken
}
