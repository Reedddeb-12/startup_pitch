/**
 * ParkEase Backend - Rate Limiter Middleware
 * Prevent API abuse
 */

const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../config/constants');

const rateLimiter = rateLimit({
    windowMs: RATE_LIMIT.WINDOW_MS,
    max: RATE_LIMIT.MAX_REQUESTS,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = rateLimiter;
