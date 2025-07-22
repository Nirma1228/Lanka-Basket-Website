import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';

const app = express();

// Configure CORS
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || 'http://localhost:8080'
}));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined'));

// Configure helmet with less restrictive settings
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
}));

const PORT = process.env.PORT || 8080;

// Root route
app.get("/", (request, response) => {
    try {
        response.status(200).json({
            message: `Hey! Server is Running on port ${PORT}`,
            status: "success",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error in root route:", error);
        response.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

// Health check route
app.get("/health", (request, response) => {
    response.status(200).json({
        status: "OK",
        message: "Server is healthy",
        port: PORT
    });
});

// Start server
const startServer = async () => {
    try {
        // Connect to database first
        await connectDB();
        
        // Then start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Access the server at: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();