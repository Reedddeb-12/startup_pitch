/**
 * ParkEase Backend - Database Configuration
 * MongoDB connection setup - UPDATED FOR PRODUCTION
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // ✅ UPDATED: Check if MongoDB URI exists
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        // ✅ UPDATED: Enhanced connection options
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Fail fast if server unavailable
            socketTimeoutMS: 45000, // Socket timeout
            retryWrites: true, // Retry writes for Vercel environment
            w: 'majority' // Wait for majority of replicas
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);

        // ✅ NEW: Connection event handlers
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', {
                message: err.message,
                code: err.code,
                timestamp: new Date().toISOString()
            });
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

        // ✅ NEW: Handle Vercel cold starts
        mongoose.connection.on('reconnectFailed', () => {
            console.error('❌ MongoDB reconnection failed');
        });

        return conn;

    } catch (error) {
        console.error('❌ MongoDB connection failed:', {
            message: error.message,
            code: error.code,
            timestamp: new Date().toISOString()
        });
        
        // ✅ UPDATED: Better error logging for debugging
        if (error.name === 'MongoNetworkError') {
            console.error('💡 Hint: Check MongoDB IP whitelist and connection string');
        } else if (error.name === 'MongoAuthenticationError') {
            console.error('💡 Hint: Check database credentials in MONGODB_URI');
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;
