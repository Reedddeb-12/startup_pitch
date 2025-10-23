/**
 * ParkEase - Frontend-Only API Module
 * All data stored in memory and localStorage (no backend required)
 */

class ParkEaseAPI {
    constructor() {
        this.AUTH_TOKEN_KEY = 'parkease_auth_token';
        this.USER_DATA_KEY = 'parkease_user_data';
        this.BOOKINGS_KEY = 'parkease_bookings';
        this.PARKING_LOTS_KEY = 'parkease_parking_lots';
        
        console.log('🔧 API initialized in FRONTEND-ONLY MODE');
        this.initializeMockData();
    }

    /**
     * Initialize empty data structures in localStorage if not present
     */
    initializeMockData() {
        // Initialize empty parking lots array if not present
        const existingLots = this.getLocalStorage(this.PARKING_LOTS_KEY);
        if (!existingLots) {
            this.setLocalStorage(this.PARKING_LOTS_KEY, []);
            console.log('📦 Initialized empty parking lots array');
        }

        // Initialize empty bookings array if not present
        const existingBookings = this.getLocalStorage(this.BOOKINGS_KEY);
        if (!existingBookings) {
            this.setLocalStorage(this.BOOKINGS_KEY, []);
            console.log('📦 Initialized empty bookings array');
        }
    }

    /**
     * LocalStorage helpers
     */
    getLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('localStorage read error:', e);
            return null;
        }
    }

    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('localStorage write error:', e);
            return false;
        }
    }

    removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('localStorage remove error:', e);
        }
    }

    /**
     * Get stored auth token
     */
    getAuthToken() {
        return this.getLocalStorage(this.AUTH_TOKEN_KEY);
    }

    /**
     * Set auth token
     */
    setAuthToken(token) {
        this.setLocalStorage(this.AUTH_TOKEN_KEY, token);
    }

    /**
     * Clear auth token
     */
    clearAuthToken() {
        this.removeLocalStorage(this.AUTH_TOKEN_KEY);
        this.removeLocalStorage(this.USER_DATA_KEY);
    }

    /**
     * Generate mock response
     */
    mockResponse(data, message = 'Success') {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message,
                    data
                });
            }, 300); // Simulate network delay
        });
    }

    /**
     * Generate mock error response
     */
    mockError(message, status = 400) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const error = new Error(message);
                error.status = status;
                error.data = { message };
                reject(error);
            }, 300);
        });
    }

    /**
     * Authentication APIs
     */
    auth = {
        register: async (userData) => {
            console.log('📝 Register:', userData.email);
            
            // Check if user already exists
            const existingUser = this.getLocalStorage(this.USER_DATA_KEY);
            if (existingUser && existingUser.email === userData.email) {
                return this.mockError('Email already registered', 409);
            }

            const user = {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: 'user',
                createdAt: new Date().toISOString()
            };

            this.setLocalStorage(this.USER_DATA_KEY, user);
            
            return this.mockResponse(user, 'Registration successful');
        },
        
        login: async (credentials) => {
            console.log('🔐 Login:', credentials.email);
            
            // Admin login
            if (credentials.email === 'admin@parkease.com' && credentials.password === 'admin123') {
                const adminUser = {
                    id: 999,
                    name: 'Admin',
                    email: 'admin@parkease.com',
                    role: 'admin',
                    phone: '9999999999'
                };
                
                const token = 'admin_token_' + Date.now();
                this.setAuthToken(token);
                this.setLocalStorage(this.USER_DATA_KEY, adminUser);
                
                return this.mockResponse({ user: adminUser, token }, 'Admin login successful');
            }

            // Regular user login - check if user exists
            const existingUser = this.getLocalStorage(this.USER_DATA_KEY);
            if (!existingUser || existingUser.email !== credentials.email) {
                return this.mockError('Invalid email or password', 401);
            }

            const token = 'user_token_' + Date.now();
            this.setAuthToken(token);
            
            return this.mockResponse({ user: existingUser, token }, 'Login successful');
        },
        
        logout: async () => {
            console.log('🚪 Logout');
            this.clearAuthToken();
            return this.mockResponse(null, 'Logged out successfully');
        },
        
        getMe: async () => {
            console.log('👤 Get current user');
            const token = this.getAuthToken();
            if (!token) {
                return this.mockError('Not authenticated', 401);
            }

            const user = this.getLocalStorage(this.USER_DATA_KEY);
            if (!user) {
                return this.mockError('User not found', 404);
            }

            return this.mockResponse(user);
        }
    };

    /**
     * Parking Lot APIs
     */
    parkingLot = {
        getAll: async () => {
            console.log('🅿️ Get all parking lots');
            const lots = this.getLocalStorage(this.PARKING_LOTS_KEY) || [];
            return this.mockResponse(lots);
        },
        
        getById: async (id) => {
            console.log('🅿️ Get parking lot:', id);
            const lots = this.getLocalStorage(this.PARKING_LOTS_KEY) || [];
            const lot = lots.find(l => l.id === parseInt(id));
            
            if (!lot) {
                return this.mockError('Parking lot not found', 404);
            }
            
            return this.mockResponse(lot);
        },
        
        create: async (lotData) => {
            console.log('➕ Create parking lot:', lotData.name);
            const lots = this.getLocalStorage(this.PARKING_LOTS_KEY) || [];
            
            const newLot = {
                ...lotData,
                id: Date.now(),
                availableSlots: lotData.totalSlots,
                rating: 4.0,
                createdAt: new Date().toISOString()
            };
            
            lots.push(newLot);
            this.setLocalStorage(this.PARKING_LOTS_KEY, lots);
            
            return this.mockResponse(newLot, 'Parking lot created successfully');
        },
        
        update: async (id, lotData) => {
            console.log('✏️ Update parking lot:', id);
            const lots = this.getLocalStorage(this.PARKING_LOTS_KEY) || [];
            const index = lots.findIndex(l => l.id === parseInt(id));
            
            if (index === -1) {
                return this.mockError('Parking lot not found', 404);
            }
            
            lots[index] = { ...lots[index], ...lotData };
            this.setLocalStorage(this.PARKING_LOTS_KEY, lots);
            
            return this.mockResponse(lots[index], 'Parking lot updated successfully');
        },
        
        delete: async (id) => {
            console.log('🗑️ Delete parking lot:', id);
            const lots = this.getLocalStorage(this.PARKING_LOTS_KEY) || [];
            const filteredLots = lots.filter(l => l.id !== parseInt(id));
            
            if (lots.length === filteredLots.length) {
                return this.mockError('Parking lot not found', 404);
            }
            
            this.setLocalStorage(this.PARKING_LOTS_KEY, filteredLots);
            return this.mockResponse(null, 'Parking lot deleted successfully');
        }
    };

    /**
     * Booking APIs
     */
    booking = {
        getAll: async () => {
            console.log('📋 Get all bookings');
            const user = this.getLocalStorage(this.USER_DATA_KEY);
            if (!user) {
                return this.mockError('Not authenticated', 401);
            }

            const allBookings = this.getLocalStorage(this.BOOKINGS_KEY) || [];
            
            // If admin, return all bookings. Otherwise, filter by user
            if (user.role === 'admin') {
                return this.mockResponse(allBookings);
            }
            
            const userBookings = allBookings.filter(b => b.userId === user.id);
            return this.mockResponse(userBookings);
        },
        
        getById: async (id) => {
            console.log('📋 Get booking:', id);
            const bookings = this.getLocalStorage(this.BOOKINGS_KEY) || [];
            const booking = bookings.find(b => b._id === id || b.id === id);
            
            if (!booking) {
                return this.mockError('Booking not found', 404);
            }
            
            return this.mockResponse(booking);
        },
        
        create: async (bookingData) => {
            console.log('➕ Create booking');
            const bookings = this.getLocalStorage(this.BOOKINGS_KEY) || [];
            
            const newBooking = {
                ...bookingData,
                _id: 'booking_' + Date.now(),
                id: Date.now(),
                createdAt: new Date().toISOString()
            };
            
            bookings.push(newBooking);
            this.setLocalStorage(this.BOOKINGS_KEY, bookings);
            
            return this.mockResponse(newBooking, 'Booking created successfully');
        },
        
        update: async (id, bookingData) => {
            console.log('✏️ Update booking:', id);
            const bookings = this.getLocalStorage(this.BOOKINGS_KEY) || [];
            const index = bookings.findIndex(b => b._id === id || b.id === id);
            
            if (index === -1) {
                return this.mockError('Booking not found', 404);
            }
            
            bookings[index] = { ...bookings[index], ...bookingData };
            this.setLocalStorage(this.BOOKINGS_KEY, bookings);
            
            return this.mockResponse(bookings[index], 'Booking updated successfully');
        },
        
        cancel: async (id) => {
            console.log('❌ Cancel booking:', id);
            const bookings = this.getLocalStorage(this.BOOKINGS_KEY) || [];
            const index = bookings.findIndex(b => b._id === id || b.id === id);
            
            if (index === -1) {
                return this.mockError('Booking not found', 404);
            }
            
            bookings[index].status = 'cancelled';
            bookings[index].cancelledAt = new Date().toISOString();
            this.setLocalStorage(this.BOOKINGS_KEY, bookings);
            
            return this.mockResponse(bookings[index], 'Booking cancelled successfully');
        }
    };

    /**
     * User APIs
     */
    user = {
        getProfile: async () => {
            console.log('👤 Get user profile');
            const user = this.getLocalStorage(this.USER_DATA_KEY);
            if (!user) {
                return this.mockError('Not authenticated', 401);
            }
            return this.mockResponse(user);
        },
        
        updateProfile: async (userData) => {
            console.log('✏️ Update user profile');
            const user = this.getLocalStorage(this.USER_DATA_KEY);
            if (!user) {
                return this.mockError('Not authenticated', 401);
            }
            
            const updatedUser = { ...user, ...userData };
            this.setLocalStorage(this.USER_DATA_KEY, updatedUser);
            
            return this.mockResponse(updatedUser, 'Profile updated successfully');
        }
    };
}

// Initialize and expose to window
window.API = new ParkEaseAPI();
console.log('✅ Frontend-Only API Module initialized');
console.log('📦 Mock parking lots loaded:', window.API.getLocalStorage(window.API.PARKING_LOTS_KEY)?.length || 0);
