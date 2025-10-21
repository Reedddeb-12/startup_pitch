/**
 * ParkEase Backend - Booking Controller
 * Booking management operations
 */

const Booking = require('../models/Booking');
const ParkingLot = require('../models/ParkingLot');
const { BOOKING_STATUS, QR_CODE_PREFIX } = require('../config/constants');
const { generateQRCode } = require('../utils/helpers');

// @desc    Get all user bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('parkingLot')
            .populate('payment')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('parkingLot')
            .populate('payment')
            .populate('user', 'name email phone');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking belongs to user (unless admin)
        if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
    try {
        const { parkingLotId, duration } = req.body;

        // Find parking lot
        const parkingLot = await ParkingLot.findById(parkingLotId);

        if (!parkingLot) {
            return res.status(404).json({
                success: false,
                message: 'Parking lot not found'
            });
        }

        // Check if parking lot is active
        if (!parkingLot.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Parking lot is not active'
            });
        }

        // Check availability
        if (!parkingLot.hasAvailableSlots()) {
            return res.status(400).json({
                success: false,
                message: 'No available slots'
            });
        }

        // Calculate amount
        const amount = parkingLot.pricePerHour * duration;

        // Generate unique QR code
        const qrCode = `${QR_CODE_PREFIX}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            parkingLot: parkingLotId,
            duration,
            amount,
            qrCode,
            status: BOOKING_STATUS.PENDING
        });

        // Populate parking lot details
        await booking.populate('parkingLot');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking belongs to user
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this booking'
            });
        }

        // Only allow updates for pending bookings
        if (booking.status !== BOOKING_STATUS.PENDING) {
            return res.status(400).json({
                success: false,
                message: 'Cannot update booking after payment'
            });
        }

        const { duration } = req.body;

        if (duration) {
            const parkingLot = await ParkingLot.findById(booking.parkingLot);
            booking.duration = duration;
            booking.amount = parkingLot.pricePerHour * duration;
            booking.endTime = new Date(booking.startTime.getTime() + duration * 60 * 60 * 1000);
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking updated successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking belongs to user
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        // Check if booking can be cancelled
        if (booking.status === BOOKING_STATUS.CANCELLED) {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        if (booking.status === BOOKING_STATUS.COMPLETED) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel completed booking'
            });
        }

        // Cancel booking
        await booking.cancel(req.body.reason || 'User cancelled');

        // Restore parking lot availability if booking was active
        if (booking.status === BOOKING_STATUS.ACTIVE) {
            const parkingLot = await ParkingLot.findById(booking.parkingLot);
            await parkingLot.updateAvailability(true);
        }

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get active bookings
// @route   GET /api/bookings/active
// @access  Private
exports.getActiveBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            user: req.user.id,
            status: BOOKING_STATUS.ACTIVE
        })
            .populate('parkingLot')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get booking history
// @route   GET /api/bookings/history
// @access  Private
exports.getBookingHistory = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            user: req.user.id,
            status: { $in: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED] }
        })
            .populate('parkingLot')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email phone')
            .populate('parkingLot', 'name address')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};
