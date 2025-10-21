/**
 * ParkEase Frontend - API Integration
 * Production-ready API integration with error handling
 */

// Get API base URL from environment or use default
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://parkease-backend.vercel.app/api'; // Replace with your backend URL

let authToken = null;

/**
 * Safe localStorage access
 */
function canUseStorage() {
    try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Set authentication token
 */
function setAuthToken(token) {
    authToken = token;
    if (canUseStorage()) {
        localStorage.setItem('parkease_token', token);
    }
}

/**
 * Get authentication token
 */
function getAuthToken() {
    if (!authToken && canUseStorage()) {
        authToken = localStorage.getItem('parkease_token');
    }
    return authToken;
}

/**
 * Clear authentication token
 */
function clearAuthToken() {
    authToken = null;
    if (canUseStorage()) {
        localStorage.removeItem('parkease_token');
    }
}

/**
 * Make API request with error handling
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

    try {
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
            ...options
        });

        // Handle 401 Unauthorized
        if (response.status === 401) {
            clearAuthToken();
            if (typeof setView === 'function') {
                setView('login');
            }
        }

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || `HTTP ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
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
        try {
            const response = await apiRequest('/auth/register', {
                method: 'POST',
                body: userData
            });
            if (response.data?.token) {
                setAuthToken(response.data.token);
            }
            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async login(credentials) {
        try {
            const response = await apiRequest('/auth/login', {
                method: 'POST',
                body: credentials
            });
            if (response.data?.token) {
                setAuthToken(response.data.token);
            }
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async getMe() {
        return await apiRequest('/auth/me');
    },

    async updatePassword(passwordData) {
        return await apiRequest('/auth/updatepassword', {
            method: 'PUT',
            body: passwordData
        });
    },

    async logout() {
        try {
            const response = await apiRequest('/auth/logout', {
                method: 'POST'
            });
            clearAuthToken();
            return response;
        } catch (error) {
            clearAuthToken();
            return { success: true };
        }
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
            body: userData
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
        const endpoint = `/parking-lots${queryString ? '?' + queryString : ''}`;
        return await apiRequest(endpoint);
    },

    async getById(id) {
        return await apiRequest(`/parking-lots/${id}`);
    },

    async getNearby(lat, lon, maxDistance = 10000) {
        return await apiRequest(
            `/parking-lots/nearby?lat=${lat}&lon=${lon}&maxDistance=${maxDistance}`
        );
    },

    async create(lotData) {
        return await apiRequest('/parking-lots', {
            method: 'POST',
            body: lotData
        });
    },

    async update(id, lotData) {
        return await apiRequest(`/parking-lots/${id}`, {
            method: 'PUT',
            body: lotData
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
            body: bookingData
        });
    },

    async update(id, bookingData) {
        return await apiRequest(`/bookings/${id}`, {
            method: 'PUT',
            body: bookingData
        });
    },

    async cancel(id, reason = '') {
        return await apiRequest(`/bookings/${id}`, {
            method: 'DELETE',
            body: { reason }
        });
    },

    async getActive() {
        return await apiRequest('/bookings/active');
    },

    async getHistory() {
        return await apiRequest('/bookings/history');
    }
};

/**
 * Payment APIs
 */
const paymentAPI = {
    async createOrder(bookingId) {
        return await apiRequest('/payments/create-order', {
            method: 'POST',
            body: { bookingId }
        });
    },

    async verifyPayment(paymentData) {
        return await apiRequest('/payments/verify', {
            method: 'POST',
            body: paymentData
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
            body: { amount }
        });
    }
};

/**
 * Export APIs for global use
 */
window.API = {
    auth: authAPI,
    user: userAPI,
    parkingLot: parkingLotAPI,
    booking: bookingAPI,
    payment: paymentAPI,
    setAuthToken,
    getAuthToken,
    clearAuthToken,
    API_BASE_URL
};
