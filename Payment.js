/**
 * ParkEase Backend - Payment Model
 * Payment schema and methods
 */

const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../config/constants');

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide amount']
    },
    currency: {
        type: String,
        default: 'INR'
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true
    },
    razorpayPaymentId: {
        type: String,
        unique: true,
        sparse: true
    },
    razorpaySignature: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.PENDING
    },
    method: {
        type: String
    },
    paidAt: {
        type: Date
    },
    refundedAt: {
        type: Date
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    failureReason: {
        type: String
    }
}, {
    timestamps: true
});

// Index for faster queries
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });

// Mark payment as successful
paymentSchema.methods.markSuccess = async function(paymentId, signature) {
    this.status = PAYMENT_STATUS.SUCCESS;
    this.razorpayPaymentId = paymentId;
    this.razorpaySignature = signature;
    this.paidAt = new Date();
    await this.save();
};

// Mark payment as failed
paymentSchema.methods.markFailed = async function(reason) {
    this.status = PAYMENT_STATUS.FAILED;
    this.failureReason = reason;
    await this.save();
};

// Process refund
paymentSchema.methods.processRefund = async function(amount) {
    this.status = PAYMENT_STATUS.REFUNDED;
    this.refundAmount = amount || this.amount;
    this.refundedAt = new Date();
    await this.save();
};

module.exports = mongoose.model('Payment', paymentSchema);