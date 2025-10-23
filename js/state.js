/**
 * ParkEase - Global State Management
 * Centralized state for the entire application
 */

let state = {
    currentView: 'login',
    selectedLot: null,
    booking: null,
    searchQuery: '',
    user: null,
    parkingLots: [],
    bookings: [],
    isLoading: false,
    error: null,
    isAuthenticated: false,
    adminStats: null
};

let mapInstance = null;

/**
 * Get current state
 */
function getState() {
    return { ...state };
}

/**
 * Update state
 */
function setState(updates) {
    state = { ...state, ...updates };
    return state;
}

/**
 * Get specific state property
 */
function getStateProperty(key) {
    return state[key];
}

/**
 * Reset state (for logout/reset scenarios)
 */
function resetState() {
    state = {
        currentView: 'login',
        selectedLot: null,
        booking: null,
        searchQuery: '',
        user: null,
        parkingLots: state.parkingLots,
        bookings: [],
        isLoading: false,
        error: null,
        isAuthenticated: false,
        adminStats: null
    };
    return state;
}

/**
 * Manage map instance
 */
function setMapInstance(instance) {
    mapInstance = instance;
}

function getMapInstance() {
    return mapInstance;
}

function clearMapInstance() {
    if (mapInstance) {
        try {
            mapInstance.remove();
        } catch (e) {
            console.warn('Error removing map:', e);
        }
        mapInstance = null;
    }
}

/**
 * Parking lots operations
 */
function addParkingLot(lot) {
    state.parkingLots.push(lot);
    return lot;
}

function removeParkingLot(lotId) {
    state.parkingLots = state.parkingLots.filter(lot => lot.id !== lotId);
}

function getParkingLot(lotId) {
    return state.parkingLots.find(lot => lot.id === lotId);
}

function updateParkingLot(lotId, updates) {
    const index = state.parkingLots.findIndex(lot => lot.id === lotId);
    if (index !== -1) {
        state.parkingLots[index] = { ...state.parkingLots[index], ...updates };
    }
}

/**
 * Bookings operations
 */
function addBooking(booking) {
    state.bookings.push(booking);
    return booking;
}

function getBooking(bookingId) {
    return state.bookings.find(b => b.id === bookingId);
}

function getBookingsByUser(userId) {
    return state.bookings.filter(b => b.userId === userId);
}

/**
 * User operations
 */
function setUser(user) {
    state.user = user;
    state.isAuthenticated = true;
}

function getUser() {
    return state.user;
}

function clearUser() {
    state.user = null;
    state.isAuthenticated = false;
}

function isUserLoggedIn() {
    return state.user !== null;
}
