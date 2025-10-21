/**
 * ParkEase - Admin Handler
 * Handles admin operations like adding/removing parking lots
 */

/**
 * Initialize add lot modal
 */
function initAddLotModal() {
    const addLotForm = document.getElementById('addLotForm');
    const closeAddLotModal = document.getElementById('closeAddLotModal');
    const showAddLotModal = document.getElementById('showAddLotModal');

    if (closeAddLotModal) {
        closeAddLotModal.addEventListener('click', closeAddLotModalHandler);
    }

    if (showAddLotModal) {
        showAddLotModal.addEventListener('click', openAddLotModalHandler);
    }

    if (addLotForm) {
        addLotForm.addEventListener('submit', handleAddLot);
    }
}

/**
 * Open add lot modal
 */
function openAddLotModalHandler() {
    const modal = document.getElementById('addLotModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Close add lot modal
 */
function closeAddLotModalHandler() {
    const modal = document.getElementById('addLotModal');
    if (modal) {
        modal.style.display = 'none';
    }
    resetForm('addLotForm');
}

/**
 * Handle adding a new parking lot
 */
async function handleAddLot(e) {
    e.preventDefault();
    const formData = getFormData('addLotForm');

    if (!formData) {
        showError('Form not found');
        return;
    }

    const formValues = {
        name: formData.get('name').trim(),
        address: formData.get('address').trim(),
        distance: formData.get('distance').trim(),
        totalSlots: parseInt(formData.get('totalSlots'), 10),
        pricePerHour: parseFloat(formData.get('pricePerHour')),
        lat: parseFloat(formData.get('lat')),
        lon: parseFloat(formData.get('lon')),
        amenities: formData.get('amenities')
            .split(',')
            .map(a => a.trim())
            .filter(a => a)
    };

    // Validate parking lot data
    const validation = validateParkingLot(formValues);
    if (!validation.isValid) {
        showError(validation.errors.join(', '));
        return;
    }

    try {
        // Call API to create parking lot
        const response = await window.API.parkingLot.create(formValues);
        
        if (response.success) {
            showSuccess('Parking lot added successfully!');
            resetForm('addLotForm');
            closeAddLotModalHandler();
            
            // Reload parking lots
            const lotsResponse = await window.API.parkingLot.getAll();
            if (lotsResponse.success) {
                setState({ parkingLots: lotsResponse.data });
            }
            
            render();
        }
    } catch (error) {
        console.error('Error adding parking lot:', error);
        showError(error.message || 'Failed to add parking lot');
    }
}

/**
 * Handle deleting a parking lot
 */
async function handleDeleteLot(lotId) {
    if (confirm('Are you sure you want to delete this parking lot?')) {
        try {
            const response = await window.API.parkingLot.delete(lotId);
            
            if (response.success) {
                showSuccess('Parking lot deleted successfully!');
                
                // Reload parking lots
                const lotsResponse = await window.API.parkingLot.getAll();
                if (lotsResponse.success) {
                    setState({ parkingLots: lotsResponse.data });
                }
                
                render();
            }
        } catch (error) {
            console.error('Error deleting parking lot:', error);
            showError(error.message || 'Failed to delete parking lot');
        }
    }
}

/**
 * Validate parking lot data
 */
function validateParkingLot(lot) {
    const errors = [];

    if (!lot.name || lot.name.length < 3) {
        errors.push('Parking lot name must be at least 3 characters');
    }

    if (!lot.address || lot.address.length < 5) {
        errors.push('Address must be at least 5 characters');
    }

    if (lot.totalSlots <= 0) {
        errors.push('Total slots must be greater than 0');
    }

    if (lot.pricePerHour <= 0) {
        errors.push('Price per hour must be greater than 0');
    }

    if (isNaN(lot.lat) || isNaN(lot.lon)) {
        errors.push('Invalid latitude or longitude');
    }

    if (lot.lat < -90 || lot.lat > 90) {
        errors.push('Latitude must be between -90 and 90');
    }

    if (lot.lon < -180 || lot.lon > 180) {
        errors.push('Longitude must be between -180 and 180');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Get admin dashboard statistics
 */
function getAdminStats() {
    const parkingLots = getStateProperty('parkingLots');
    const bookings = getStateProperty('bookings');

    const totalSlots = parkingLots.reduce((sum, lot) => sum + (lot.totalSlots || 0), 0);
    const occupiedSlots = totalSlots - parkingLots.reduce((sum, lot) => sum + (lot.availableSlots || 0), 0);
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? (b.amount || 0) : 0), 0);
    const totalBookings = bookings.filter(b => b.status !== 'cancelled').length;
    const activeBookings = bookings.filter(b => b.status === 'active').length;

    return {
        totalLots: parkingLots.length,
        totalSlots,
        occupiedSlots,
        availableSlots: totalSlots - occupiedSlots,
        occupancyRate: totalSlots > 0 ? ((occupiedSlots / totalSlots) * 100).toFixed(1) : 0,
        totalRevenue,
        totalBookings,
        activeBookings,
        completedBookings: bookings.filter(b => b.status === 'completed').length
    };
}

/**
 * Get lot with detailed statistics
 */
function getLotStats(lotId) {
    const lot = getParkingLot(lotId);
    if (!lot) return null;

    const bookings = getStateProperty('bookings')
        .filter(b => b.lot && b.lot.id === lotId && b.status !== 'cancelled');

    return {
        ...lot,
        totalBookings: bookings.length,
        revenue: bookings.reduce((sum, b) => sum + (b.amount || 0), 0),
        occupancyRate: lot.totalSlots > 0 ? ((lot.totalSlots - lot.availableSlots) / lot.totalSlots * 100).toFixed(1) : 0
    };
}

/**
 * Export data for admin reporting
 */
function exportAdminData() {
    const stats = getAdminStats();
    const lots = getStateProperty('parkingLots');
    const bookings = getStateProperty('bookings');

    const data = {
        exportDate: new Date().toLocaleString(),
        statistics: stats,
        parkingLots: lots,
        bookings: bookings.filter(b => b.status !== 'cancelled')
    };

    return data;
}
