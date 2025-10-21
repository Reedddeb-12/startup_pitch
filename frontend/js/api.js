/**
 * ParkEase Frontend - API Integration
 * Handles all API calls to the backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Store token in memory
let authToken = null;

/**
 * Set authentication token
 */
function setAuthToken(token) {
    authToken = token;
    localStorage.setItem('parkease_token', token);
}

/**
 * Get authentication token
 */
function getAuthToken() {
    if (!authToken) {
        authToken = localStorage.getItem('parkease_token');
    }
    return authToken;
}

/**
 * Clear authentication token
 */
function clearAuthToken() {
    authToken = null;
    localStorage.removeItem('parkease_token');
}

/**
 * Make API request
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Authentication APIs
 */
const authAPI = {
    async register(userData) {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        if (response.data.token) {
            setAuthToken(response.data.token);
        }
        return response;
    },

    async login(credentials) {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        if (response.data.token) {
            setAuthToken(response.data.token);
        }
        return response;
    },

    async getMe() {
        return await apiRequest('/auth/me');
    },

    async updatePassword(passwordData) {
        return await apiRequest('/auth/updatepassword', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    },

    async logout() {
        const response = await apiRequest('/auth/logout', {
            method: 'POST'
        });
        clearAuthToken();
        return response;
    }
};

/**
 * User APIs
 */
const userAPI = {
    async getProfile() {
        return await apiRequest('/users/profile');
    },

    async updateProfile(userData) {
        return await apiRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    async getStats() {
        return await apiRequest('/users/stats');
    },

    async deleteAccount() {
        const response = await apiRequest('/users/profile', {
            method: 'DELETE'
        });
        clearAuthToken();
        return response;
    }
};

/**
 * Parking Lot APIs
 */
const parkingLotAPI = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/parking-lots${queryString ? '?' + queryString : ''}`);
    },

    async getById(id) {
        return await apiRequest(`/parking-lots/${id}`);
    },

    async getNearby(lat, lon, maxDistance = 10000) {
        return await apiRequest(`/parking-lots/nearby?lat=${lat}&lon=${lon}&maxDistance=${maxDistance}`);
    },

    async create(lotData) {
        return await apiRequest('/parking-lots', {
            method: 'POST',
            body: JSON.stringify(lotData)
        });
    },

    async update(id, lotData) {
        return await apiRequest(`/parking-lots/${id}`, {
            method: 'PUT',
            body: JSON.stringify(lotData)
        });
    },

    async delete(id) {
        return await apiRequest(`/parking-lots/${id}`, {
            method: 'DELETE'
        });
    },

    async getStats(id) {
        return await apiRequest(`/parking-lots/${id}/stats`);
    }
};

/**
 * Booking APIs
 */
const bookingAPI = {
    async getAll() {
        return await apiRequest('/bookings');
    },

    async getById(id) {
        return await apiRequest(`/bookings/${id}`);
    },

    async create(bookingData) {
        return await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    },

    async update(id, bookingData) {
        return await apiRequest(`/bookings/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookingData)
        });
    },

    async cancel(id, reason = '') {
        return await apiRequest(`/bookings/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ reason })
        });
    },

    async getActive() {
        return await apiRequest('/bookings/active');
    },

    async getHistory() {
        return await apiRequest('/bookings/history');
    },

    async getAllBookings() {
        return await apiRequest('/bookings/admin/all');
    }
};

/**
 * Payment APIs
 */
const paymentAPI = {
    async createOrder(bookingId) {
        return await apiRequest('/payments/create-order', {
            method: 'POST',
            body: JSON.stringify({ bookingId })
        });
    },

    async verifyPayment(paymentData) {
        return await apiRequest('/payments/verify', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    },

    async getById(id) {
        return await apiRequest(`/payments/${id}`);
    },

    async getUserPayments() {
        return await apiRequest('/payments/user/all');
    },

    async processRefund(id, amount) {
        return await apiRequest(`/payments/${id}/refund`, {
            method: 'POST',
            body: JSON.stringify({ amount })
        });
    },

    async getAllPayments() {
        return await apiRequest('/payments/admin/all');
    }
};

/**
 * Export APIs
 */
window.API = {
    auth: authAPI,
    user: userAPI,
    parkingLot: parkingLotAPI,
    booking: bookingAPI,
    payment: paymentAPI,
    setAuthToken,
    getAuthToken,
    clearAuthToken
};
