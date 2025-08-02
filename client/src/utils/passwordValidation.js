// Password validation utility with comprehensive checks
export const validatePassword = (password) => {
    const criteria = {
        minLength: {
            test: password.length >= 8,
            message: "Minimum Length: At least 8 characters",
            emoji: "✅"
        },
        uppercase: {
            test: /[A-Z]/.test(password),
            message: "Uppercase Letter: Include at least one uppercase letter (A–Z)",
            emoji: "🔤"
        },
        lowercase: {
            test: /[a-z]/.test(password),
            message: "Lowercase Letter: Include at least one lowercase letter (a–z)",
            emoji: "🔡"
        },
        number: {
            test: /[0-9]/.test(password),
            message: "Number: Include at least one number (0–9)",
            emoji: "🔢"
        },
        specialChar: {
            test: /[!@#$%^&*()\-_+=[\]{}|;:,.<>?]/.test(password),
            message: "Special Character: Include at least one symbol (e.g., !@#$%^&*()-_+=)",
            emoji: "🔣"
        },
        noSpaces: {
            test: !/\s/.test(password),
            message: "No Spaces: Password must not contain spaces",
            emoji: "🚫"
        }
    }

    const results = Object.keys(criteria).map(key => ({
        key,
        ...criteria[key],
        passed: criteria[key].test
    }))

    const allPassed = results.every(result => result.passed)
    
    return {
        isValid: allPassed,
        criteria: results,
        strengthScore: results.filter(r => r.passed).length,
        totalCriteria: results.length
    }
}

export const getPasswordStrengthColor = (strengthScore, totalCriteria) => {
    const percentage = (strengthScore / totalCriteria) * 100
    
    if (percentage < 50) return 'text-red-500'
    if (percentage < 80) return 'text-yellow-500'
    return 'text-green-500'
}

export const getPasswordStrengthText = (strengthScore, totalCriteria) => {
    const percentage = (strengthScore / totalCriteria) * 100
    
    if (percentage < 50) return 'Weak Password'
    if (percentage < 80) return 'Medium Password'
    return 'Strong Password'
}
