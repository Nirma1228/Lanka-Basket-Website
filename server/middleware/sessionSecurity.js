import crypto from 'crypto'
import jwt from 'jsonwebtoken'

// Enhanced session security
export const sessionSecurity = async (req, res, next) => {
    try {
        // Check for valid session
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1]
        
        if (!token) {
            return next() // Let auth middleware handle this
        }

        // Verify token integrity
        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
        
        // Add session fingerprint validation
        const userFingerprint = generateFingerprint(req)
        req.sessionFingerprint = userFingerprint
        
        // Check for session hijacking indicators
        const suspiciousActivity = detectSessionAnomaly(req, decoded)
        if (suspiciousActivity) {
            // Log suspicious activity
            console.warn(`Session anomaly detected for user ${decoded.id}:`, suspiciousActivity)
            
            // Invalidate session
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            
            return res.status(401).json({
                message: 'Session security violation detected. Please login again.',
                error: true,
                success: false
            })
        }

        next()
    } catch (error) {
        next() // Let other middleware handle token errors
    }
}

// Generate browser fingerprint
const generateFingerprint = (req) => {
    const components = [
        req.get('User-Agent') || '',
        req.get('Accept-Language') || '',
        req.get('Accept-Encoding') || '',
        req.ip || ''
    ]
    
    return crypto
        .createHash('sha256')
        .update(components.join('|'))
        .digest('hex')
}

// Detect session anomalies
const detectSessionAnomaly = (req, decoded) => {
    const anomalies = []
    
    // Check for rapid IP changes (basic check)
    const currentIP = req.ip
    const tokenTime = decoded.iat * 1000 // Convert to milliseconds
    const timeSinceIssue = Date.now() - tokenTime
    
    // If token is very recent but from different location, flag it
    if (timeSinceIssue < 5 * 60 * 1000) { // 5 minutes
        // This is a basic check - in production, use more sophisticated geolocation
        if (req.get('x-forwarded-for') && req.get('x-forwarded-for') !== req.ip) {
            anomalies.push('IP_CHANGE_DETECTED')
        }
    }
    
    // Check for unusual user agent changes
    const expectedUA = req.get('User-Agent')
    if (!expectedUA || expectedUA.length < 10) {
        anomalies.push('INVALID_USER_AGENT')
    }
    
    // Check for suspicious headers
    const suspiciousHeaders = [
        'x-originating-ip',
        'x-remote-ip',
        'x-remote-addr'
    ]
    
    for (const header of suspiciousHeaders) {
        if (req.get(header)) {
            anomalies.push('SUSPICIOUS_HEADERS')
            break
        }
    }
    
    return anomalies.length > 0 ? anomalies : null
}

// Secure session creation
export const createSecureSession = (userId, req) => {
    const fingerprint = generateFingerprint(req)
    
    const sessionData = {
        userId,
        fingerprint,
        createdAt: Date.now(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
    }
    
    // In production, store session data in Redis or database
    // For now, we'll encode it in the JWT payload
    return sessionData
}

// Middleware to check concurrent sessions
export const concurrentSessionLimit = async (req, res, next) => {
    const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1]
    
    if (!token) {
        return next()
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
        const userId = decoded.id
        
        // In production, implement Redis-based session tracking
        // For now, we'll use a simple in-memory approach
        
        // Check if user has too many active sessions
        // This is a placeholder - implement proper session tracking
        
        next()
    } catch (error) {
        next()
    }
}

export default {
    sessionSecurity,
    createSecureSession,
    concurrentSessionLimit,
    generateFingerprint
}
