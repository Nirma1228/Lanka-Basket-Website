import React from 'react'
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText } from '../utils/passwordValidation'

const PasswordStrengthIndicator = ({ password, showIndicator = true }) => {
    if (!password || !showIndicator) return null

    const validation = validatePassword(password)
    const strengthColor = getPasswordStrengthColor(validation.strengthScore, validation.totalCriteria)
    const strengthText = getPasswordStrengthText(validation.strengthScore, validation.totalCriteria)

    return (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Password Strength:</span>
                <span className={`text-sm font-bold ${strengthColor}`}>
                    {strengthText} ({validation.strengthScore}/{validation.totalCriteria})
                </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                        validation.strengthScore < 3 ? 'bg-red-500' :
                        validation.strengthScore < 5 ? 'bg-yellow-500' :
                        'bg-green-500'
                    }`}
                    style={{ 
                        width: `${(validation.strengthScore / validation.totalCriteria) * 100}%` 
                    }}
                ></div>
            </div>

            {/* Criteria list */}
            <div className="space-y-1">
                {validation.criteria.map((criterion) => (
                    <div 
                        key={criterion.key} 
                        className={`flex items-center text-xs ${
                            criterion.passed ? 'text-green-600' : 'text-red-500'
                        }`}
                    >
                        <span className="mr-2">
                            {criterion.passed ? '✅' : '❌'}
                        </span>
                        <span>{criterion.message}</span>
                    </div>
                ))}
            </div>

            {!validation.isValid && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                    <strong>Password is not strong enough!</strong> Please ensure all criteria are met.
                </div>
            )}
        </div>
    )
}

export default PasswordStrengthIndicator
