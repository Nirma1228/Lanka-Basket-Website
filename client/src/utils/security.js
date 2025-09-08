// Frontend security utility for preventing XSS and other attacks

// Content Security Policy helper
export const CSP = {
    nonce: null,
    
    generateNonce() {
        this.nonce = btoa(Math.random().toString()).slice(0, 16)
        return this.nonce
    },
    
    addMetaTag() {
        if (typeof document !== 'undefined') {
            const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
            if (existingMeta) {
                existingMeta.remove()
            }
            
            const meta = document.createElement('meta')
            meta.setAttribute('http-equiv', 'Content-Security-Policy')
            meta.setAttribute('content', `
                default-src 'self'; 
                script-src 'self' 'nonce-${this.nonce}' https://js.stripe.com https://checkout.stripe.com; 
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
                img-src 'self' data: https: blob:; 
                font-src 'self' https://fonts.gstatic.com;
                connect-src 'self' https://api.stripe.com;
                frame-src https://js.stripe.com https://checkout.stripe.com;
                object-src 'none';
            `)
            document.head.appendChild(meta)
        }
    }
}

// Input sanitization for frontend
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input
    
    // Remove HTML tags
    const div = document.createElement('div')
    div.textContent = input
    let sanitized = div.innerHTML
    
    // Remove potentially dangerous characters
    sanitized = sanitized
        .replace(/[<>\"']/g, '') // Remove dangerous HTML characters
        .replace(/javascript:/gi, '') // Remove javascript: URLs
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim()
    
    return sanitized
}

// Validate email format
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Validate phone number (Sri Lankan format)
export const isValidPhone = (phone) => {
    const phoneRegex = /^(\+94|0)[1-9]\d{8}$/
    return phoneRegex.test(phone)
}

// XSS Protection for dynamic content
export const sanitizeHTML = (html) => {
    if (typeof DOMPurify !== 'undefined') {
        return DOMPurify.sanitize(html)
    }
    
    // Fallback sanitization
    const div = document.createElement('div')
    div.textContent = html
    return div.innerHTML
}

// Secure data storage
export const secureStorage = {
    setItem(key, value, encrypt = false) {
        try {
            let dataToStore = value
            
            if (encrypt) {
                // Simple encryption - in production use proper encryption
                dataToStore = btoa(JSON.stringify(value))
            }
            
            // Use sessionStorage for sensitive data
            if (key.includes('token') || key.includes('auth')) {
                sessionStorage.setItem(key, JSON.stringify(dataToStore))
            } else {
                localStorage.setItem(key, JSON.stringify(dataToStore))
            }
        } catch (error) {
            console.error('Failed to store data securely:', error)
        }
    },
    
    getItem(key, encrypted = false) {
        try {
            let data = sessionStorage.getItem(key) || localStorage.getItem(key)
            
            if (!data) return null
            
            data = JSON.parse(data)
            
            if (encrypted) {
                data = JSON.parse(atob(data))
            }
            
            return data
        } catch (error) {
            console.error('Failed to retrieve data securely:', error)
            return null
        }
    },
    
    removeItem(key) {
        sessionStorage.removeItem(key)
        localStorage.removeItem(key)
    },
    
    clear() {
        sessionStorage.clear()
        localStorage.clear()
    }
}

// Form validation with security checks
export const validateForm = (formData, rules) => {
    const errors = []
    
    for (const [field, rule] of Object.entries(rules)) {
        const value = formData[field]
        
        if (rule.required && (!value || value.trim() === '')) {
            errors.push(`${field} is required`)
        }
        
        if (value && rule.type === 'email' && !isValidEmail(value)) {
            errors.push(`${field} must be a valid email`)
        }
        
        if (value && rule.type === 'phone' && !isValidPhone(value)) {
            errors.push(`${field} must be a valid phone number`)
        }
        
        if (value && rule.minLength && value.length < rule.minLength) {
            errors.push(`${field} must be at least ${rule.minLength} characters`)
        }
        
        if (value && rule.maxLength && value.length > rule.maxLength) {
            errors.push(`${field} must not exceed ${rule.maxLength} characters`)
        }
        
        if (value && rule.pattern && !rule.pattern.test(value)) {
            errors.push(`${field} format is invalid`)
        }
    }
    
    return errors
}

// Security headers for fetch requests
export const getSecureHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
    }
    
    // Add CSRF token if available
    const sessionToken = secureStorage.getItem('sessionToken')
    if (sessionToken) {
        headers['X-Session-Token'] = sessionToken
        // Generate CSRF token (simple implementation)
        headers['X-CSRF-Token'] = btoa(sessionToken + Date.now())
    }
    
    return headers
}

// Monitor for suspicious activity
export const securityMonitor = {
    suspiciousActivity: [],
    
    log(type, details) {
        const timestamp = new Date().toISOString()
        this.suspiciousActivity.push({
            type,
            details,
            timestamp,
            url: window.location.href,
            userAgent: navigator.userAgent
        })
        
        // Keep only last 100 entries
        if (this.suspiciousActivity.length > 100) {
            this.suspiciousActivity = this.suspiciousActivity.slice(-100)
        }
        
        // Report to server if too many suspicious activities
        if (this.suspiciousActivity.length > 10) {
            this.reportSuspiciousActivity()
        }
    },
    
    async reportSuspiciousActivity() {
        try {
            await fetch('/api/security/report', {
                method: 'POST',
                headers: getSecureHeaders(),
                body: JSON.stringify({
                    activities: this.suspiciousActivity
                })
            })
            
            this.suspiciousActivity = [] // Clear after reporting
        } catch (error) {
            console.error('Failed to report suspicious activity:', error)
        }
    }
}

export default {
    CSP,
    sanitizeInput,
    sanitizeHTML,
    isValidEmail,
    isValidPhone,
    secureStorage,
    validateForm,
    getSecureHeaders,
    securityMonitor
}
