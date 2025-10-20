/**
 * ParkEase - Razorpay Configuration
 * Payment gateway setup
 */

const RAZORPAY_CONFIG = {
    // Use environment variables in production
    KEY_ID: process.env?.RAZORPAY_KEY_ID || 'rzp_test_ILzaLVLAtji6G9',
    
    // Payment options
    CURRENCY: 'INR',
    TIMEOUT: 60 * 5, // 5 minutes
    
    // Prefill options
    PREFILL_ENABLED: true,
    
    // Theme
    THEME: {
        color: '#3B82F6',
        backdrop: true
    },
    
    // Callbacks
    HANDLER: 'handlePaymentSuccess',
    ERROR_HANDLER: 'handlePaymentFailure'
};

/**
 * Create Razorpay order options
 */
function createRazorpayOptions(booking, user) {
    return {
        key: RAZORPAY_CONFIG.KEY_ID,
        amount: booking.amount * 100, // Convert to paise
        currency: RAZORPAY_CONFIG.CURRENCY,
        name: 'ParkEase',
        description: `Parking at ${booking.lot.name}`,
        image: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=P',
        order_id: booking.id.toString(),
        prefill: {
            name: user.name || 'Guest User',
            email: user.email || 'guest@parkease.com',
            contact: user.phone || '9999999999'
        },
        notes: {
            parking_lot_id: booking.lot.id,
            booking_id: booking.id,
            duration: booking.duration
        },
        theme: RAZORPAY_CONFIG.THEME,
        timeout: RAZORPAY_CONFIG.TIMEOUT,
        modal: {
            ondismiss: function() {
                console.log('Payment modal dismissed');
            }
        },
        handler: function(response) {
            handlePaymentSuccess(response);
        }
    };
}