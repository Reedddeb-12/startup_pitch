/**
 * ParkEase Backend - Email Service
 * Email notifications using Nodemailer
 */

const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Send email
 */
exports.sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `ParkEase <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send email');
    }
};

/**
 * Send booking confirmation email
 */
exports.sendBookingConfirmation = async (user, booking) => {
    const subject = 'Booking Confirmation - ParkEase';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3B82F6;">Booking Confirmed!</h2>
            <p>Dear ${user.name},</p>
            <p>Your parking booking has been confirmed.</p>
            
            <div style="background: #F1F5F9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Booking Details:</h3>
                <p><strong>Parking Lot:</strong> ${booking.parkingLot.name}</p>
                <p><strong>Address:</strong> ${booking.parkingLot.address}</p>
                <p><strong>Duration:</strong> ${booking.duration} hour(s)</p>
                <p><strong>Amount:</strong> ₹${booking.amount}</p>
                <p><strong>QR Code:</strong> ${booking.qrCode}</p>
                <p><strong>Start Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
                <p><strong>End Time:</strong> ${new Date(booking.endTime).toLocaleString()}</p>
            </div>
            
            <p>Please show this QR code at the parking entrance.</p>
            <p>Thank you for using ParkEase!</p>
        </div>
    `;

    await exports.sendEmail({
        to: user.email,
        subject,
        html
    });
};

/**
 * Send booking cancellation email
 */
exports.sendBookingCancellation = async (user, booking) => {
    const subject = 'Booking Cancelled - ParkEase';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #EF4444;">Booking Cancelled</h2>
            <p>Dear ${user.name},</p>
            <p>Your parking booking has been cancelled.</p>
            
            <div style="background: #F1F5F9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Cancelled Booking:</h3>
                <p><strong>Parking Lot:</strong> ${booking.parkingLot.name}</p>
                <p><strong>QR Code:</strong> ${booking.qrCode}</p>
                <p><strong>Cancellation Reason:</strong> ${booking.cancellationReason || 'User requested'}</p>
            </div>
            
            <p>If you have any questions, please contact our support team.</p>
            <p>Thank you for using ParkEase!</p>
        </div>
    `;

    await exports.sendEmail({
        to: user.email,
        subject,
        html
    });
};

/**
 * Send welcome email
 */
exports.sendWelcomeEmail = async (user) => {
    const subject = 'Welcome to ParkEase!';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3B82F6;">Welcome to ParkEase!</h2>
            <p>Dear ${user.name},</p>
            <p>Thank you for registering with ParkEase. We're excited to help you find and book parking spaces easily.</p>
            
            <div style="background: #F1F5F9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Getting Started:</h3>
                <ul>
                    <li>Search for parking lots near you</li>
                    <li>Book your spot in seconds</li>
                    <li>Pay securely online</li>
                    <li>Get instant confirmation</li>
                </ul>
            </div>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Happy parking!</p>
            <p>The ParkEase Team</p>
        </div>
    `;

    await exports.sendEmail({
        to: user.email,
        subject,
        html
    });
};
