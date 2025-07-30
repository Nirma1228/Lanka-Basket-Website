import mongoose from "mongoose";

if(!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not defined please provide MONGODB_URI in .env file"
)
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB Connected Successfully");
    } catch(error) {
        console.log("MongoDB Connect error:", error)
        process.exit(1)
    }
}

export default connectDB