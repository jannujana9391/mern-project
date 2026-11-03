import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Supports both local MongoDB and MongoDB Atlas URI from .env
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/multivendor_ecommerce';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging indefinitely
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Connection Notice: ${error.message}`);
    console.warn(`[MongoDB] Running in offline DB mode for Phase 1. Database will be configured in Phase 3.`);
    return false;
  }
};

export default connectDB;

