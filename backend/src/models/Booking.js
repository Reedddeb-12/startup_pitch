/**
 * ParkEase Backend - Booking Model
 * Booking schema and methods
 */

const mongoose = require('mongoose');
const { BOOKING_STATUS } = require('../config/constants');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parkingLot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingLot',
        required: true
    },
    duration: {
        type: Number,
        required: [true, 'Please provide duration'],
        min: [1, 'Duration must be at least 1 hour'],
        max: [12, 'Duration cannot exceed 12 hours']
    },
    amount: {
        type: Number,
        required: [true, 'Please provide amount']
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    endTime: {
        type: Date,
        required: true
    },
    qrCode: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(BOOKING_STATUS),
        default: BOOKING_STATUS.PENDING
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    cancelledAt: {
        type: Date
    },
    cancellationReason: {
        type: String
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ parkingLot: 1, status: 1 });
bookingSchema.index({ qrCode: 1 });

// Calculate end time before saving
bookingSchema.pre('save', function(next) {
    if (this.isNew && !this.endTime) {
        this.endTime = new Date(this.startTime.getTime() + this.duration * 60 * 60 * 1000);
    }
    next();
});

// Check if booking is active
bookingSchema.methods.isActive = function() {
    return this.status === BOOKING_STATUS.ACTIVE && new Date() < this.endTime;
};

// Check if booking has expired
bookingSchema.methods.hasExpired = function() {
    return new Date() > this.endTime;
};

// Cancel booking
bookingSchema.methods.cancel = async function(reason = '') {
    this.status = BOOKING_STATUS.CANCELLED;
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
    await this.save();
};

// Complete booking
bookingSchema.methods.complete = async function() {
    this.status = BOOKING_STATUS.COMPLETED;
    this.completedAt = new Date();
    await this.save();
};

module.exports = mongoose.model('Booking', bookingSchema);
