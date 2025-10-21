/**
 * ParkEase Backend - Payment Controller
 * Razorpay payment integration
 */

const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const ParkingLot = require('../models/ParkingLot');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../config/constants');

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { bookingId } = req.body;

        // Find booking
        const booking = await Booking.findById(bookingId).populate('parkingLot');

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
                message: 'Not authorized'
            });
        }

        // Check if booking is pending
        if (booking.status !== BOOKING_STATUS.PENDING) {
            return res.status(400).json({
                success: false,
                message: 'Booking is not in pending status'
            });
        }

        // Create Razorpay order
        const options = {
            amount: booking.amount * 100, // Convert to paise
            currency: 'INR',
            receipt: `booking_${bookingId}`,
            notes: {
                bookingId: bookingId,
                userId: req.user.id,
                parkingLotId: booking.parkingLot._id.toString()
            }
        };

        const order = await razorpay.orders.create(options);

        // Create payment record
        const payment = await Payment.create({
            booking: bookingId,
            user: req.user.id,
            amount: booking.amount,
            razorpayOrderId: order.id,
            status: PAYMENT_STATUS.PENDING
        });

        res.status(201).json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                payment,
                booking
            }
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        next(error);
    }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

        // Verify signature
        const sign = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpaySignature !== expectedSign) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Find payment
        const payment = await Payment.findOne({ razorpayOrderId });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Update payment
        await payment.markSuccess(razorpayPaymentId, razorpaySignature);

        // Find and update booking
        const booking = await Booking.findById(bookingId).populate('parkingLot');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Update booking status
        booking.status = BOOKING_STATUS.ACTIVE;
        booking.payment = payment._id;
        await booking.save();

        // Update parking lot availability
        const parkingLot = await ParkingLot.findById(booking.parkingLot._id);
        await parkingLot.updateAvailability(false);

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                payment,
                booking
            }
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        next(error);
    }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('booking')
            .populate('user', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Check if payment belongs to user (unless admin)
        if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user payments
// @route   GET /api/payments/user/all
// @access  Private
exports.getUserPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({ user: req.user.id })
            .populate('booking')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Process refund
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
exports.processRefund = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        if (payment.status !== PAYMENT_STATUS.SUCCESS) {
            return res.status(400).json({
                success: false,
                message: 'Only successful payments can be refunded'
            });
        }

        const { amount } = req.body;
        const refundAmount = amount || payment.amount;

        // Create refund with Razorpay
        const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
            amount: refundAmount * 100 // Convert to paise
        });

        // Update payment
        await payment.processRefund(refundAmount);

        res.status(200).json({
            success: true,
            message: 'Refund processed successfully',
            data: {
                payment,
                refund
            }
        });
    } catch (error) {
        console.error('Refund error:', error);
        next(error);
    }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments/admin/all
// @access  Private/Admin
exports.getAllPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find()
            .populate('user', 'name email')
            .populate('booking')
            .sort({ createdAt: -1 });

        const stats = {
            total: payments.length,
            totalAmount: payments
                .filter(p => p.status === PAYMENT_STATUS.SUCCESS)
                .reduce((sum, p) => sum + p.amount, 0),
            successful: payments.filter(p => p.status === PAYMENT_STATUS.SUCCESS).length,
            failed: payments.filter(p => p.status === PAYMENT_STATUS.FAILED).length,
            refunded: payments.filter(p => p.status === PAYMENT_STATUS.REFUNDED).length
        };

        res.status(200).json({
            success: true,
            count: payments.length,
            stats,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};
