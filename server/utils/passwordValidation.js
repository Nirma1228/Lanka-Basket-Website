// Server-side password validation utility
export const validatePasswordStrength = (password) => {
    const errors = []
    
    // Minimum length check
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long")
    }
    
    // Uppercase letter check
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter (A-Z)")
    }
    
    // Lowercase letter check
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter (a-z)")
    }
    
    // Number check
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number (0-9)")
    }
    
    // Special character check
    if (!/[!@#$%^&*()\-_+=[\]{}|;:,.<>?]/.test(password)) {
        errors.push("Password must contain at least one special character (!@#$%^&*()-_+=)")
    }
    
    // No spaces check
    if (/\s/.test(password)) {
        errors.push("Password must not contain spaces")
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    }
}

export default validatePasswordStrength
