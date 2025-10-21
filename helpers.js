/**
 * ParkEase Backend - Helper Functions
 * Utility functions used across the application
 */

const { QR_CODE_PREFIX } = require('../config/constants');

/**
 * Generate unique QR code
 */
exports.generateQRCode = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${QR_CODE_PREFIX}-${timestamp}-${random}`;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees) => {
    return degrees * (Math.PI / 180);
};

/**
 * Format currency
 */
exports.formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
};

/**
 * Generate random string
 */
exports.generateRandomString = (length = 10) => {
    return Math.random().toString(36).substr(2, length);
};

/**
 * Parse pagination parameters
 */
exports.parsePagination = (query) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    return { page, limit, skip };
};

/**
 * Format response with pagination
 */
exports.paginatedResponse = (data, page, limit, total) => {
    return {
        success: true,
        count: data.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data
    };
};

/**
 * Sanitize user object (remove sensitive data)
 */
exports.sanitizeUser = (user) => {
    const sanitized = user.toObject();
    delete sanitized.password;
    return sanitized;
};

/**
 * Check if date is in the past
 */
exports.isPastDate = (date) => {
    return new Date(date) < new Date();
};

/**
 * Add hours to date
 */
exports.addHours = (date, hours) => {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
};

/**
 * Format date to readable string
 */
exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Format time to readable string
 */
exports.formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Validate email format
 */
exports.isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Validate phone number (10 digits)
 */
exports.isValidPhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
};

/**
 * Create success response
 */
exports.successResponse = (data, message = 'Success') => {
    return {
        success: true,
        message,
        data
    };
};

/**
 * Create error response
 */
exports.errorResponse = (message = 'Error occurred', statusCode = 500) => {
    return {
        success: false,
        message,
        statusCode
    };
};