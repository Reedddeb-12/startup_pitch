/**
 * ParkEase Backend - Authentication Middleware
 * JWT verification and authorization - UPDATED FOR PRODUCTION
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

/**
 * ✅ UPDATED: Protect routes - verify JWT token with better error handling
 */
exports.protect = async (req, res, next) => {
    try {
        let token;

        // ✅ UPDATED: Check for token in headers
        if (req.headers.authorization) {
            // Expected format: "Bearer <token>"
            const parts = req.headers.authorization.split(' ');
            
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid authorization header format'
                });
            }
        }

        // ✅ NEW: Check for token in cookies (optional)
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token provided'
            });
        }

        try {
            // ✅ UPDATED: Verify token with error handling
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // ✅ NEW: Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // ✅ NEW: Check if user is active
            if (!req.user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'User account is inactive'
                });
            }

            // ✅ NEW: Store token in request for later use
            req.token = token;
            
            next();

        } catch (tokenError) {
            // ✅ UPDATED: Better error messages for different token errors
            if (tokenError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired',
                    expiredAt: tokenError.expiredAt
                });
            } else if (tokenError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Token verification failed'
                });
            }
        }

    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

/**
 * ✅ UPDATED: Grant access to specific roles with better validation
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // ✅ NEW: Check if user has required role
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found in request'
            });
        }

        if (!roles.includes(req.user.role)) {
            console.warn(`Unauthorized access attempt - User: ${req.user.id}, Role: ${req.user.role}, Required: ${roles.join(', ')}`);
            
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized. Required roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};

/**
 * ✅ UPDATED: Check if user is admin with validation
 */
exports.isAdmin = (req, res, next) => {
    // ✅ NEW: Better error checking
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'User not found'
        });
    }

    if (req.user.role !== ROLES.ADMIN) {
        console.warn(`Admin access denied - User: ${req.user.id}`);
        
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }

    next();
};

/**
 * ✅ NEW: Optional authentication - doesn't fail if no token, but validates if present
 */
exports.optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
                req.token = token;
            } catch (error) {
                console.warn('Optional auth token invalid:', error.message);
                // Continue without user - it's optional
            }
        }

        next();

    } catch (error) {
        console.error('Optional auth error:', error);
        next();
    }
};

/**
 * ✅ NEW: Refresh token endpoint
 */
exports.refreshToken = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        const newToken = req.user.generateToken();

        res.status(200).json({
            success: true,
            message: 'Token refreshed',
            data: { token: newToken }
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            success: false,
            message: 'Token refresh failed'
        });
    }
};
