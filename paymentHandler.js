/**
 * ParkEase - Payment Handler
 * Handles Razorpay payment integration
 */

/**
 * Initialize payment
 */
function handlePayment() {
    const booking = getStateProperty('booking');
    const user = getUser();
    const payButton = document.getElementById('payButton');

    if (!booking) {
        showError('Booking information not found');
        return;
    }

    payButton.disabled = true;
    payButton.innerText = 'Processing...';

    const options = {
        key: 'rzp_test_ILzaLVLAtji6G9', // Move to environment variable
        amount: booking.amount * 100, // Convert to paise
        currency: 'INR',
        name: 'ParkEase',
        description: `Parking for ${booking.lot.name}`,
        image: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=P',
        handler: function(response) {
            handlePaymentSuccess(response);
        },
        prefill: {
            name: user.name || 'Demo User',
            email: user.email || 'demo@example.com',
            contact: user.phone || '9999999999'
        },
        theme: {
            color: '#3B82F6'
        },
        modal: {
            ondismiss: function() {
                handlePaymentDismiss(payButton);
            }
        }
    };

    try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function(response) {
            handlePaymentFailure(response, payButton);
        });
        rzp.open();
    } catch (error) {
        console.error('Razorpay error:', error);
        showError('Payment gateway error. Please try again.');
        payButton.disabled = false;
        payButton.innerText = `Pay Securely ${formatCurrency(booking.amount)}`;
    }
}

/**
 * Handle successful payment
 */
function handlePaymentSuccess(response) {
    const booking = getStateProperty('booking');

    // Update booking with payment details
    booking.paymentId = response.razorpay_payment_id;
    booking.status = 'completed';
    booking.completedAt = getCurrentDateTime().fullDate;

    // Update lot availability
    const lot = booking.lot;
    const lotIndex = getStateProperty('parkingLots').findIndex(l => l.id === lot.id);
    if (lotIndex !== -1) {
        const lots = getStateProperty('parkingLots');
        lots[lotIndex] = {
            ...lots[lotIndex],
            availableSlots: Math.max(0, lots[lotIndex].availableSlots - 1)
        };
        setState({ parkingLots: lots });
    }

    // Add booking to state
    addBooking(booking);

    console.log('Payment successful:', response);
    setView('ticket');
}

/**
 * Handle payment failure
 */
function handlePaymentFailure(response, payButton) {
    const booking = getStateProperty('booking');
    const errorMessage = response.error.reason || 'Payment failed';

    console.error('Payment failed:', response.error);
    showError(`Payment Failed: ${errorMessage}`);

    payButton.disabled = false;
    payButton.innerText = `Pay Securely ${formatCurrency(booking.amount)}`;
}

/**
 * Handle payment modal dismiss
 */
function handlePaymentDismiss(payButton) {
    const booking = getStateProperty('booking');

    payButton.disabled = false;
    payButton.innerText = `Pay Securely ${formatCurrency(booking.amount)}`;

    console.log('Payment modal dismissed');
}

/**
 * Validate payment amount
 */
function validatePaymentAmount(amount) {
    return amount > 0 && !isNaN(amount);
}

/**
 * Format amount for display
 */
function formatPaymentAmount(amount) {
    return `${formatCurrency(amount)}`;
}