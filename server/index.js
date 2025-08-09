import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '.env') })

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'

// Security middlewares (simplified for now)
// import { generalRateLimit } from './middleware/rateLimiting.js'
// import { securityHeaders } from './middleware/securityHeaders.js'
// import { mongoSanitize, preventParameterPollution } from './middleware/mongoSecurity.js'
// import { sanitizeInput, preventNoSQLInjection } from './middleware/inputSanitization.js'
// import { requestSizeLimit, validateOrigin, validateUserAgent, validateHttpMethods } from './middleware/apiSecurity.js'
// import { securityMonitoring, bruteForceProtection } from './middleware/securityLogging.js'
// import { sessionSecurity } from './middleware/sessionSecurity.js'

const app = express()
const frontendUrl = process.env.FRONTEND_URL || 'https://lively-river-02e6bc000.1.azurestaticapps.net';

// Basic security middlewares (simplified for now)
// Security middlewares temporarily disabled for debugging
// app.use(validateHttpMethods) // Validate HTTP methods first
// app.use(requestSizeLimit) // Limit request size
// app.use(validateOrigin) // Validate request origin
// app.use(validateUserAgent) // Check user agent
// app.use(securityHeaders) // Set security headers

app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false // We're handling CSP in securityHeaders
}))

// Rate limiting - temporarily disabled
// app.use(generalRateLimit)
// app.use(bruteForceProtection)

// Security monitoring - temporarily disabled
// app.use(securityMonitoring)

// CORS configuration
app.use(cors({
    credentials: true,
    origin: frontendUrl,
    optionsSuccessStatus: 200
}))

// Body parsing with security
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Input sanitization and validation - temporarily disabled
// app.use(mongoSanitize)
// app.use(preventParameterPollution)
// app.use(sanitizeInput)
// app.use(preventNoSQLInjection)

// Session security - temporarily disabled
// app.use(sessionSecurity)

// Logging
app.use(morgan('combined'))

const PORT = process.env.PORT || 8080

app.get("/", (request, response) => {
    ///server to client
    response.json({
        message: "Server is running " + PORT
    })
})

app.use('/api/user', userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address", addressRouter)
app.use('/api/order', orderRouter)

const startServer = async () => {
    try {
        // Import connectDB after dotenv is configured
        const { default: connectDB } = await import('./config/connectDB.js');

        // Connect to database first
        await connectDB();
        console.log("Database connected successfully");

        // Then start the server
        app.listen(PORT, () => {
            console.log("Server is running on port", PORT);
            console.log(`Access the server at: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
