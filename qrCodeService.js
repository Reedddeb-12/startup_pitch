/**
 * ParkEase Backend - QR Code Service
 * QR code generation for bookings
 */

const QRCode = require('qrcode');

/**
 * Generate QR code as data URL
 */
exports.generateQRCodeDataURL = async (data) => {
    try {
        const qrCodeDataURL = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        return qrCodeDataURL;
    } catch (error) {
        throw new Error('Failed to generate QR code');
    }
};

/**
 * Generate QR code as buffer
 */
exports.generateQRCodeBuffer = async (data) => {
    try {
        const buffer = await QRCode.toBuffer(data, {
            errorCorrectionLevel: 'H',
            type: 'png',
            quality: 0.92,
            margin: 1
        });
        return buffer;
    } catch (error) {
        throw new Error('Failed to generate QR code buffer');
    }
};

/**
 * Generate QR code for booking
 */
exports.generateBookingQRCode = async (booking) => {
    const qrData = JSON.stringify({
        bookingId: booking._id,
        qrCode: booking.qrCode,
        parkingLot: booking.parkingLot.name,
        amount: booking.amount,
        duration: booking.duration,
        timestamp: new Date().toISOString()
    });

    return await exports.generateQRCodeDataURL(qrData);
};