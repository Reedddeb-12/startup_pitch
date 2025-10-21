/**
 * ParkEase Backend - JWT Utilities
 * JWT token generation and verification
 */

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 */
exports.generateToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn
    });
};

/**
 * Verify JWT token
 */
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Decode JWT token without verification
 */
exports.decodeToken = (token) => {
    return jwt.decode(token);
};

/**
 * Extract token from request headers
 */
exports.extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};