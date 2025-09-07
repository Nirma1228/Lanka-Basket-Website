import mongoose from 'mongoose'
import UserModel from './models/user.model.js'
import { config } from 'dotenv'

// Load environment variables
config()

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB')

        // Find the user we created and make them admin
        const user = await UserModel.findOne({ email: 'admin@test.com' })
        
        if (!user) {
            console.log('User not found')
            return
        }

        // Update user to be admin and verified
        const updated = await UserModel.updateOne(
            { _id: user._id },
            { 
                role: 'ADMIN',
                verify_email: true,
                status: 'Active'
            }
        )

        console.log('User updated to admin:', updated)
        console.log('Admin user created successfully!')

        // Also create a test regular user for testing security features
        const testUser = await UserModel.findOne({ email: 'test@test.com' })
        if (!testUser) {
            // Test user was created earlier, just check if it needs updating
            const existingTestUser = await UserModel.findOne({ email: 'test@test.com' })
            if (existingTestUser) {
                await UserModel.updateOne(
                    { _id: existingTestUser._id },
                    { verify_email: true, status: 'Active' }
                )
                console.log('Test user verified')
            }
        }

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await mongoose.disconnect()
        console.log('Disconnected from MongoDB')
    }
}

createAdmin()
