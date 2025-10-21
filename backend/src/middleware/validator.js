/**
 * ParkEase Backend - Validator Middleware
 * Request validation using express-validator
 */

const { body, param, query, validationResult } = require('express-validator');
const { VALIDATION } = require('../config/constants');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// User registration validation
exports.validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: VALIDATION.MIN_PASSWORD_LENGTH })
        .withMessage(`Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`),
    body('phone')
        .optional()
        .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number')
];

// Login validation
exports.validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Parking lot validation
exports.validateParkingLot = [
    body('name')
        .trim()
        .notEmpty().withMessage('Parking lot name is required')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('address')
        .trim()
        .notEmpty().withMessage('Address is required'),
    body('lat')
        .notEmpty().withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('lon')
        .notEmpty().withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
    body('totalSlots')
        .notEmpty().withMessage('Total slots is required')
        .isInt({ min: 1 }).withMessage('Total slots must be at least 1'),
    body('pricePerHour')
        .notEmpty().withMessage('Price per hour is required')
        .isFloat({ min: 0 }).withMessage('Price cannot be negative')
];

// Booking validation
exports.validateBooking = [
    body('parkingLotId')
        .notEmpty().withMessage('Parking lot ID is required')
        .isMongoId().withMessage('Invalid parking lot ID'),
    body('duration')
        .notEmpty().withMessage('Duration is required')
        .isInt({ min: VALIDATION.MIN_DURATION, max: VALIDATION.MAX_DURATION })
        .withMessage(`Duration must be between ${VALIDATION.MIN_DURATION} and ${VALIDATION.MAX_DURATION} hours`)
];

// MongoDB ID validation
exports.validateMongoId = [
    param('id')
        .isMongoId().withMessage('Invalid ID format')
];

// Pagination validation
exports.validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];
