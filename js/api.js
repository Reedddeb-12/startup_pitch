/**
 * ParkEase - API Module
 * Centralized API client with authentication
 */

class ParkEaseAPI {
    constructor() {
        // Use environment variable or fallback to localhost
        this.API_BASE_URL = window.location.hostname === 'localhost' 
            ? 'http://localhost:5000/api'
            : 'https://your-backend-url.com/api';
        
        this.AUTH_TOKEN_KEY = 'parkease_auth_token';
        this.endpoints = {
            auth: '/auth',
            parkingLot: '/parking-lots',
            booking: '/bookings',
            user: '/users'
        };
    }

    /**
     * Get stored auth token
     */
    getAuthToken() {
        try {
            return localStorage.getItem(this.AUTH_TOKEN_KEY);
        } catch (e) {
            console.warn('localStorage not available:', e);
            return null;
        }
    }

    /**
     * Set auth token
     */
    setAuthToken(token) {
        try {
            if (token) {
                localStorage.setItem(this.AUTH_TOKEN_KEY, token);
            }
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    }

    /**
     * Clear auth token
     */
    clearAuthToken() {
        try {
            localStorage.removeItem(this.AUTH_TOKEN_KEY);
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    }

    /**
     * Generic fetch wrapper with error handling
     */
    async request(method, endpoint, body = null) {
        const url = `${this.API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json'
        };

        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                const error = new Error(data.message || 'API Error');
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error) {
            console.error(`API Error [${method} ${endpoint}]:`, error);
            throw error;
        }
    }

    /**
     * Authentication APIs
     */
    auth = {
        register: async (userData) => {
            return this.request('POST', `${this.endpoints.auth}/register`, userData);
        },
        
        login: async (credentials) => {
            const response = await this.request('POST', `${this.endpoints.auth}/login`, credentials);
            if (response.data?.token) {
                this.setAuthToken(response.data.token);
            }
            return response;
        },
        
        logout: async () => {
            this.clearAuthToken();
            return { success: true };
        },
        
        getMe: async () => {
            return this.request('GET', `${this.endpoints.auth}/me`);
        }
    };

    /**
     * Parking Lot APIs
     */
    parkingLot = {
        getAll: async () => {
            try {
                return await this.request('GET', this.endpoints.parkingLot);
            } catch (error) {
                console.warn('Failed to fetch parking lots from backend, using mock data:', error);
                // Return mock data for demo/offline testing
                return {
                    success: true,
                    data: [
                        {
                            id: 1,
                            name: 'Downtown Parking',
                            address: '123 Main St, City Center',
                            lat: 22.5726,
                            lon: 88.3639,
                            distance: '0.5 km',
                            rating: 4.5,
                            pricePerHour: 50,
                            totalSlots: 50,
                            availableSlots: 12,
                            amenities: ['CCTV', 'EV Charging', '24/7 Security']
                        },
                        {
                            id: 2,
                            name: 'Mall Parking',
                            address: '456 Shopping Ave, Mall District',
                            lat: 22.5650,
                            lon: 88.3750,
                            distance: '1.2 km',
                            rating: 4.2,
                            pricePerHour: 40,
                            totalSlots: 100,
                            availableSlots: 35,
                            amenities: ['Free WiFi', 'CCTV', 'Covered Parking']
                        }
                    ]
                };
            }
        },
        
        getById: async (id) => {
            return this.request('GET', `${this.endpoints.parkingLot}/${id}`);
        },
        
        create: async (lotData) => {
            return this.request('POST', this.endpoints.parkingLot, lotData);
        },
        
        update: async (id, lotData) => {
            return this.request('PUT', `${this.endpoints.parkingLot}/${id}`, lotData);
        },
        
        delete: async (id) => {
            return this.request('DELETE', `${this.endpoints.parkingLot}/${id}`);
        }
    };

    /**
     * Booking APIs
     */
    booking = {
        getAll: async () => {
            return this.request('GET', this.endpoints.booking);
        },
        
        getById: async (id) => {
            return this.request('GET', `${this.endpoints.booking}/${id}`);
        },
        
        create: async (bookingData) => {
            return this.request('POST', this.endpoints.booking, bookingData);
        },
        
        update: async (id, bookingData) => {
            return this.request('PUT', `${this.endpoints.booking}/${id}`, bookingData);
        },
        
        cancel: async (id) => {
            return this.request('POST', `${this.endpoints.booking}/${id}/cancel`);
        }
    };

    /**
     * User APIs
     */
    user = {
        getProfile: async () => {
            return this.request('GET', `${this.endpoints.user}/profile`);
        },
        
        updateProfile: async (userData) => {
            return this.request('PUT', `${this.endpoints.user}/profile`, userData);
        }
    };
}

// Initialize and expose to window
window.API = new ParkEaseAPI();
console.log('✅ API Module initialized');
console.log('API Base URL:', window.API.API_BASE_URL);
