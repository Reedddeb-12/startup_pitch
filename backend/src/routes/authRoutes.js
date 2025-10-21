/**
 * ParkEase Backend - Auth Routes
 * Authentication endpoints
 */

const express = require('express');
const router = express.Router();

const {
    register,
    login,
    getMe,
    updatePassword,
    logout
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
    validateRegister,
    validateLogin,
    handleValidationErrors
} = require('../middleware/validator');

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
