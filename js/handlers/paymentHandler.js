/**
 * ParkEase - Payment Handler (Frontend-Only)
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

    const lot = booking.lot || booking.parkingLot;

    const options = {
        key: 'rzp_test_ILzaLVLAtji6G9',
        amount: booking.amount * 100,
        currency: 'INR',
        name: 'ParkEase',
        description: `Parking at ${lot?.name || 'Parking Lot'}`,
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
                handlePaymentDismiss(payButton, booking);
            }
        }
    };

    try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function(response) {
            handlePaymentFailure(response, payButton, booking);
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
async function handlePaymentSuccess(response) {
    const booking = getStateProperty('booking');

    // Update booking with payment details
    booking.paymentId = response.razorpay_payment_id;
    booking.orderId = response.razorpay_order_id;
    booking.signature = response.razorpay_signature;
    booking.status = 'completed';
    booking.completedAt = getCurrentDateTime().fullDate;
    booking.paymentStatus = 'paid';

    // Update lot availability in localStorage
    const lot = booking.lot || booking.parkingLot;
    if (lot) {
        const parkingLots = getStateProperty('parkingLots');
        const lotIndex = parkingLots.findIndex(l => l.id === lot.id);
        
        if (lotIndex !== -1) {
            parkingLots[lotIndex] = {
                ...parkingLots[lotIndex],
                availableSlots: Math.max(0, parkingLots[lotIndex].availableSlots - 1)
            };
            setState({ parkingLots });
            
            // Update in API/localStorage
            try {
                await window.API.parkingLot.update(lot.id, {
                    availableSlots: parkingLots[lotIndex].availableSlots
                });
            } catch (error) {
                console.warn('Failed to update parking lot:', error);
            }
        }
    }

    // Save booking to API/localStorage
    try {
        const savedBooking = await saveBookingToAPI(booking);
        if (savedBooking) {
            // Update local state with saved booking
            booking._id = savedBooking._id || savedBooking.id;
            addBooking(booking);
            
            console.log('✅ Payment successful and booking saved:', response);
            setView('ticket');
        } else {
            // Fallback: just add to local state
            addBooking(booking);
            console.log('✅ Payment successful (local only):', response);
            setView('ticket');
        }
    } catch (error) {
        console.error('Error saving booking:', error);
        // Still show ticket even if save fails
        addBooking(booking);
        setView('ticket');
    }
}

/**
 * Handle payment failure
 */
function handlePaymentFailure(response, payButton, booking) {
    const errorMessage = response.error.reason || 'Payment failed';

    console.error('Payment failed:', response.error);
    showError(`Payment Failed: ${errorMessage}`);

    payButton.disabled = false;
    payButton.innerText = `Pay Securely ${formatCurrency(booking.amount)}`;
}

/**
 * Handle payment modal dismiss
 */
function handlePaymentDismiss(payButton, booking) {
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
