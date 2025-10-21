/**
 * ParkEase Backend - Payment Routes
 * Payment processing endpoints
 */

const express = require('express');
const router = express.Router();

const {
    createOrder,
    verifyPayment,
    getPayment,
    getUserPayments,
    processRefund,
    getAllPayments
} = require('../controllers/paymentController');

const { protect, isAdmin } = require('../middleware/auth');
const {
    validateMongoId,
    handleValidationErrors
} = require('../middleware/validator');

// All routes require authentication
router.use(protect);

// User routes
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/user/all', getUserPayments);
router.get('/:id', validateMongoId, handleValidationErrors, getPayment);

// Admin routes
router.post('/:id/refund', isAdmin, validateMongoId, handleValidationErrors, processRefund);
router.get('/admin/all', isAdmin, getAllPayments);

module.exports = router;