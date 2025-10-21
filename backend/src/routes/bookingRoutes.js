/**
 * ParkEase Backend - Booking Routes
 * Booking management endpoints
 */

const express = require('express');
const router = express.Router();

const {
    getUserBookings,
    getBooking,
    createBooking,
    updateBooking,
    cancelBooking,
    getActiveBookings,
    getBookingHistory,
    getAllBookings
} = require('../controllers/bookingController');

const { protect, isAdmin } = require('../middleware/auth');
const {
    validateBooking,
    validateMongoId,
    handleValidationErrors
} = require('../middleware/validator');

// All routes require authentication
router.use(protect);

// User routes
router.route('/')
    .get(getUserBookings)
    .post(validateBooking, handleValidationErrors, createBooking);

router.get('/active', getActiveBookings);
router.get('/history', getBookingHistory);

router.route('/:id')
    .get(validateMongoId, handleValidationErrors, getBooking)
    .put(validateMongoId, handleValidationErrors, updateBooking)
    .delete(validateMongoId, handleValidationErrors, cancelBooking);

// Admin routes
router.get('/admin/all', isAdmin, getAllBookings);

module.exports = router;
