import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs')
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
}

// Security event logger
export const securityLogger = {
    log: (level, message, metadata = {}) => {
        const timestamp = new Date().toISOString()
        const logEntry = {
            timestamp,
            level,
            message,
            ...metadata
        }

        // Write to appropriate log file
        const logFile = path.join(logsDir, `security-${new Date().toISOString().split('T')[0]}.log`)
        const logLine = JSON.stringify(logEntry) + '\n'
        
        fs.appendFile(logFile, logLine, (err) => {
            if (err) console.error('Failed to write to security log:', err)
        })

        // Also log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[SECURITY ${level}] ${message}`, metadata)
        }
    },

    info: (message, metadata) => securityLogger.log('INFO', message, metadata),
    warn: (message, metadata) => securityLogger.log('WARN', message, metadata),
    error: (message, metadata) => securityLogger.log('ERROR', message, metadata),
    critical: (message, metadata) => securityLogger.log('CRITICAL', message, metadata)
}

// Security monitoring middleware
export const securityMonitoring = (req, res, next) => {
    const startTime = Date.now()

    // Log suspicious patterns
    const suspiciousPatterns = [
        // SQL injection attempts
        /'|--|union|select|insert|update|delete|drop|create|alter/i,
        // XSS attempts
        /<script|javascript:|on\w+\s*=/i,
        // Path traversal attempts
        /\.\.\/|\.\.\\|\.\.\%2f|\.\.\%5c/i,
        // Command injection attempts
        /;|\||&|`|\$\(|\${/
    ]

    const requestData = JSON.stringify({
        body: req.body || {},
        query: req.query || {},
        params: req.params || {}
    })

    const isSuspicious = suspiciousPatterns.some(pattern => 
        pattern.test(requestData)
    )

    if (isSuspicious) {
        securityLogger.critical('Suspicious request pattern detected', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            method: req.method,
            url: req.originalUrl,
            body: req.body,
            query: req.query,
            headers: req.headers
        })
    }

    // Log authentication attempts
    if (req.originalUrl.includes('/login') || req.originalUrl.includes('/register')) {
        securityLogger.info('Authentication attempt', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            method: req.method,
            url: req.originalUrl,
            email: req.body && req.body.email ? req.body.email : 'unknown'
        })
    }

    // Monitor response for errors
    const originalSend = res.send
    res.send = function(data) {
        const responseTime = Date.now() - startTime

        try {
            const responseData = JSON.parse(data)
            if (responseData.error) {
                securityLogger.warn('Request resulted in error', {
                    ip: req.ip,
                    method: req.method,
                    url: req.originalUrl,
                    responseTime,
                    errorMessage: responseData.message,
                    statusCode: res.statusCode
                })
            }
        } catch (e) {
            // Data is not JSON, skip parsing
        }

        originalSend.call(this, data)
    }

    next()
}

// Brute force detection
const ipAttempts = new Map()

export const bruteForceProtection = (req, res, next) => {
    const ip = req.ip
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const maxAttempts = 10

    // Clean old entries
    for (const [key, data] of ipAttempts.entries()) {
        if (now - data.firstAttempt > windowMs) {
            ipAttempts.delete(key)
        }
    }

    // Check current IP
    if (ipAttempts.has(ip)) {
        const data = ipAttempts.get(ip)
        if (now - data.firstAttempt < windowMs && data.attempts >= maxAttempts) {
            securityLogger.critical('Brute force attack detected', {
                ip,
                attempts: data.attempts,
                userAgent: req.get('User-Agent'),
                url: req.originalUrl
            })

            return res.status(429).json({
                message: 'Too many requests from this IP. Please try again later.',
                error: true,
                success: false,
                retryAfter: Math.ceil((windowMs - (now - data.firstAttempt)) / 1000)
            })
        }
    }

    next()
}

// Track failed requests
export const trackFailedRequest = (req) => {
    const ip = req.ip
    const now = Date.now()

    if (ipAttempts.has(ip)) {
        const data = ipAttempts.get(ip)
        data.attempts++
        data.lastAttempt = now
    } else {
        ipAttempts.set(ip, {
            attempts: 1,
            firstAttempt: now,
            lastAttempt: now
        })
    }
}

export default {
    securityLogger,
    securityMonitoring,
    bruteForceProtection,
    trackFailedRequest
}
