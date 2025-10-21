/**
 * ParkEase Backend - Server Entry Point
 * Main server configuration and startup - UPDATED FOR PRODUCTION
 */

const dotenv = require('dotenv');
const path = require('path');

// ✅ UPDATED: Load environment variables with better error handling
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.warn('⚠️ No .env file found, using environment variables');
}

// ✅ NEW: Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

const app = require('./src/app');
const connectDB = require('./src/config/database');

// ✅ UPDATED: Enhanced database connection with retry logic
async function initializeServer() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await connectDB();
        console.log('✅ Database connected successfully');

        const PORT = process.env.PORT || 5000;
        const NODE_ENV = process.env.NODE_ENV || 'development';

        const server = app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════╗
║         🅿️  ParkEase Server             ║
╠════════════════════════════════════════╣
║  🚀 Status: Running                    ║
║  📍 Port: ${PORT.toString().padEnd(28)}║
║  🌍 Environment: ${NODE_ENV.padEnd(23)}║
║  🔗 API Base: http://localhost:${PORT.toString().padEnd(7)}║
║  🔒 CORS: Enabled                      ║
╚════════════════════════════════════════╝
            `);
        });

        // ✅ UPDATED: Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error('❌ Unhandled Rejection:', {
                message: err.message,
                stack: err.stack,
                timestamp: new Date().toISOString()
            });
            server.close(() => process.exit(1));
        });

        // ✅ UPDATED: Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
            console.error('❌ Uncaught Exception:', {
                message: err.message,
                stack: err.stack,
                timestamp: new Date().toISOString()
            });
            process.exit(1);
        });

        // ✅ UPDATED: Graceful shutdown with timeout
        process.on('SIGTERM', () => {
            console.log('👋 SIGTERM received. Shutting down gracefully...');
            
            // Give 30 seconds to close connections
            const timeout = setTimeout(() => {
                console.error('⚠️ Force closing server after timeout');
                process.exit(1);
            }, 30000);

            server.close(() => {
                clearTimeout(timeout);
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('👋 SIGINT received. Shutting down gracefully...');
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Server initialization failed:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        process.exit(1);
    }
}

// Start server
initializeServer();
