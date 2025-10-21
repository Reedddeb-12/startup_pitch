/**
 * ParkEase Backend - User Routes
 * User profile endpoints
 */

const express = require('express');
const router = express.Router();

const {
    getProfile,
    updateProfile,
    getUserStats,
    deleteAccount
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/profile')
    .get(getProfile)
    .put(updateProfile)
    .delete(deleteAccount);

router.get('/stats', getUserStats);

module.exports = router;