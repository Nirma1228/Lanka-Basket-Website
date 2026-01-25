import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

const storage = multer.memoryStorage()

// File filter for security
const fileFilter = (req, file, cb) => {
    // Define allowed file types
    const allowedTypes = {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/gif': ['.gif'],
        'image/webp': ['.webp']
    }
    
    // Check MIME type
    if (!allowedTypes[file.mimetype]) {
        return cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false)
    }
    
    // Check file extension
    const fileExt = path.extname(file.originalname).toLowerCase()
    if (!allowedTypes[file.mimetype].includes(fileExt)) {
        return cb(new Error('File extension does not match MIME type.'), false)
    }
    
    // Generate secure filename
    const timestamp = Date.now()
    const randomString = crypto.randomBytes(8).toString('hex')
    file.originalname = `secure_${timestamp}_${randomString}${fileExt}`
    
    cb(null, true)
}

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1, // Only 1 file per request
        fields: 10, // Limit number of non-file fields
        fieldNameSize: 100, // Limit field name size
        fieldSize: 1024 * 1024 // 1MB limit for field values
    }
})

// Error handling middleware for multer
export const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File too large. Maximum size is 5MB.',
                error: true,
                success: false
            })
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                message: 'Too many files. Only 1 file allowed.',
                error: true,
                success: false
            })
        }
        return res.status(400).json({
            message: 'File upload error: ' + error.message,
            error: true,
            success: false
        })
    }
    
    if (error.message.includes('Invalid file type') || error.message.includes('File extension')) {
        return res.status(400).json({
            message: error.message,
            error: true,
            success: false
        })
    }
    
    next(error)
}

export default upload