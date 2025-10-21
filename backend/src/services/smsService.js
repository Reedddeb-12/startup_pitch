/**
 * ParkEase Backend - SMS Service
 * SMS notifications using Twilio
 */

const twilio = require('twilio');

// Initialize Twilio client
const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

/**
 * Send SMS
 */
exports.sendSMS = async (to, message) => {
    if (!client) {
        console.warn('Twilio not configured. SMS not sent.');
        return null;
    }

    try {
        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });
        
        console.log('SMS sent:', result.sid);
        return result;
    } catch (error) {
        console.error('SMS sending failed:', error);
        throw new Error('Failed to send SMS');
    }
};

/**
 * Send booking confirmation SMS
 */
exports.sendBookingConfirmationSMS = async (phone, booking) => {
    const message = `ParkEase: Your parking at ${booking.parkingLot.name} is confirmed! Duration: ${booking.duration}hr, Amount: ₹${booking.amount}. QR: ${booking.qrCode}`;
    
    return await exports.sendSMS(phone, message);
};

/**
 * Send booking reminder SMS
 */
exports.sendBookingReminderSMS = async (phone, booking) => {
    const message = `ParkEase: Reminder - Your parking at ${booking.parkingLot.name} will expire in 30 minutes. QR: ${booking.qrCode}`;
    
    return await exports.sendSMS(phone, message);
};

/**
 * Send booking cancellation SMS
 */
exports.sendBookingCancellationSMS = async (phone, booking) => {
    const message = `ParkEase: Your booking at ${booking.parkingLot.name} has been cancelled. Refund will be processed within 5-7 business days.`;
    
    return await exports.sendSMS(phone, message);
};

/**
 * Send OTP SMS
 */
exports.sendOTPSMS = async (phone, otp) => {
    const message = `ParkEase: Your OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`;
    
    return await exports.sendSMS(phone, message);
};
