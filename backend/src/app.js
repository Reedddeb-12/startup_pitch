/**
 * ParkEase Backend - Express Application
 * Main application configuration - UPDATED FOR PRODUCTION
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const parkingLotRoutes = require('./routes/parkingLotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Security middleware
app.use(helmet());

// ✅ UPDATED: CORS configuration with production URLs
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://reedddeb-12.github.io',  // ✅ ADD THIS
    process.env.CLIENT_URL
];
            'https://parkease-frontend.vercel.app' // Example: update with your actual URL
        ].filter(Boolean);

        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
    maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Body parser - ✅ UPDATED: Added size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging - ✅ UPDATED: Different logging for dev/prod
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined')); // Detailed logs for production
}

// Rate limiting - ✅ UPDATED: More granular rate limiting
app.use('/api', rateLimiter);

// ✅ NEW: Trust proxy for Vercel
app.set('trust proxy', 1);

// ✅ NEW: Request timeout
app.use((req, res, next) => {
    req.setTimeout(30000); // 30 seconds
    next();
});

// Health check endpoint - ✅ UPDATED: More detailed
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ParkEase API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
    });
});

// ✅ NEW: API version endpoint
app.get('/api/version', (req, res) => {
    res.status(200).json({
        success: true,
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/parking-lots', parkingLotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// ✅ UPDATED: Better 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.path}`,
        timestamp: new Date().toISOString()
    });
});

// ✅ UPDATED: Global error handler (must be last)
app.use((err, req, res, next) => {
    // Log error with more context
    console.error('Global Error Handler:', {
        message: err.message,
        status: err.status || 500,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Call the error handler middleware
    errorHandler(err, req, res, next);
});

module.exports = app;

