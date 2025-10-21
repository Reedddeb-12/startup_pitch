/**
 * ParkEase Backend - User Controller
 * User profile and statistics management
 */

const User = require('../models/User');
const Booking = require('../models/Booking');
const { BOOKING_STATUS } = require('../config/constants');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone } = req.body;

        const fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (phone) fieldsToUpdate.phone = phone;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get all bookings for user
        const bookings = await Booking.find({ user: userId });

        // Calculate statistics
        const stats = {
            total: bookings.length,
            active: bookings.filter(b => b.status === BOOKING_STATUS.ACTIVE).length,
            completed: bookings.filter(b => b.status === BOOKING_STATUS.COMPLETED).length,
            cancelled: bookings.filter(b => b.status === BOOKING_STATUS.CANCELLED).length,
            totalSpent: bookings
                .filter(b => b.status !== BOOKING_STATUS.CANCELLED)
                .reduce((sum, b) => sum + b.amount, 0),
            totalHours: bookings
                .filter(b => b.status !== BOOKING_STATUS.CANCELLED)
                .reduce((sum, b) => sum + b.duration, 0)
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
exports.deleteAccount = async (req, res, next) => {
    try {
        // Soft delete - mark as inactive
        await User.findByIdAndUpdate(req.user.id, { isActive: false });

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};