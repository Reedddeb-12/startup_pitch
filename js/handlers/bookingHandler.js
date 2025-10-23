/**
 * ParkEase - Booking Handler (Frontend-Only)
 * Handles booking creation, updates, and cancellation
 */

/**
 * Create a new booking
 */
function createBooking(lot, duration) {
    const user = getUser();
    const { date, time, fullDate } = getCurrentDateTime();

    const booking = {
        id: generateId(),
        userId: user.id,
        lot: cloneObject(lot),
        parkingLot: cloneObject(lot),
        duration: parseInt(duration),
        amount: lot.pricePerHour * duration,
        date,
        time,
        startTime: fullDate,
        endTime: addHours(fullDate, duration),
        fullDate,
        qrCode: generateQRCode(),
        status: 'pending',
        createdAt: fullDate
    };

    setState({ booking });
    return booking;
}

/**
 * Update booking duration and amount
 */
function updateBookingDuration(duration) {
    const booking = getStateProperty('booking');
    if (!booking) return null;

    const updatedBooking = {
        ...booking,
        duration: parseInt(duration),
        amount: booking.lot.pricePerHour * duration
    };

    setState({ booking: updatedBooking });
    return updatedBooking;
}

/**
 * Cancel booking
 */
async function cancelBooking(bookingId) {
    try {
        // Cancel via API
        const response = await window.API.booking.cancel(bookingId);
        
        if (response.success) {
            // Update local state
            const bookings = getStateProperty('bookings');
            const bookingIndex = bookings.findIndex(b => b.id === bookingId || b._id === bookingId);

            if (bookingIndex !== -1) {
                bookings[bookingIndex].status = 'cancelled';
                bookings[bookingIndex].cancelledAt = getCurrentDateTime().fullDate;

                // Restore available slots
                const lot = bookings[bookingIndex].lot || bookings[bookingIndex].parkingLot;
                const parkingLots = getStateProperty('parkingLots');
                const lotIndex = parkingLots.findIndex(l => l.id === lot.id);

                if (lotIndex !== -1) {
                    parkingLots[lotIndex].availableSlots += 1;
                }

                setState({ parkingLots, bookings });
            }
            
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return false;
    }
}

/**
 * Get user's bookings from API
 */
async function getUserBookings() {
    try {
        const response = await window.API.booking.getAll();
        if (response.success) {
            return response.data || [];
        }
        return [];
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        return [];
    }
}

/**
 * Get booking details
 */
function getBookingDetails(bookingId) {
    return getStateProperty('bookings').find(b => b.id === bookingId || b._id === bookingId);
}

/**
 * Get active bookings (non-cancelled)
 */
function getActiveBookings() {
    return getStateProperty('bookings').filter(b => b.status !== 'cancelled');
}

/**
 * Calculate total spent on bookings
 */
function calculateTotalSpent(bookings = null) {
    const bookingsList = bookings || getStateProperty('bookings');
    return bookingsList.reduce((total, booking) => {
        if (booking.status !== 'cancelled') {
            return total + booking.amount;
        }
        return total;
    }, 0);
}

/**
 * Get booking statistics
 */
function getBookingStats() {
    const userBookings = getStateProperty('bookings');
    const activeBookings = userBookings.filter(b => b.status === 'active');
    const completedBookings = userBookings.filter(b => b.status === 'completed');
    const cancelledBookings = userBookings.filter(b => b.status === 'cancelled');

    return {
        total: userBookings.length,
        active: activeBookings.length,
        completed: completedBookings.length,
        cancelled: cancelledBookings.length,
        totalSpent: calculateTotalSpent(userBookings),
        totalHours: userBookings.reduce((sum, b) => sum + (b.duration || 0), 0)
    };
}

/**
 * Validate booking creation
 */
function validateBooking(lot, duration) {
    const errors = [];

    if (!lot) {
        errors.push('Parking lot not selected');
    }

    if (!duration || duration < 1 || duration > 12) {
        errors.push('Duration must be between 1 and 12 hours');
    }

    if (lot && lot.availableSlots <= 0) {
        errors.push('No available slots at this parking lot');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Save booking to API after payment
 */
async function saveBookingToAPI(booking) {
    try {
        const response = await window.API.booking.create(booking);
        if (response.success) {
            console.log('✅ Booking saved to API:', response.data);
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Error saving booking:', error);
        return null;
    }
}
