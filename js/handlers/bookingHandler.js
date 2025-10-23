/**
 * ParkEase - Booking Handler
 * Handles booking creation, updates, and cancellation
 */

/**
 * Create a new booking - CORRECTED
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
function cancelBooking(bookingId) {
    const bookings = getStateProperty('bookings');
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);

    if (bookingIndex === -1) {
        console.warn('Booking not found:', bookingId);
        return false;
    }

    // Mark as cancelled
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
    return true;
}

/**
 * Get user's bookings
 */
function getUserBookings() {
    const user = getUser();
    if (!user) return [];

    return getStateProperty('bookings').filter(b => b.userId === user.id);
}

/**
 * Get booking details
 */
function getBookingDetails(bookingId) {
    return getStateProperty('bookings').find(b => b.id === bookingId);
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
    const bookingsList = bookings || getUserBookings();
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
    const userBookings = getUserBookings();
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
