/**
 * ParkEase - Global Constants
 * Contains all application constants and configuration values
 */

export const VIEWS = {
    LOGIN: 'login',
    HOME: 'home',
    DETAILS: 'details',
    PAYMENT: 'payment',
    TICKET: 'ticket',
    BOOKINGS: 'bookings',
    PROFILE: 'profile',
    ADMIN: 'admin'
};

export const BOOKING_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

export const ROUTES = {
    HOME: 'home',
    BOOKINGS: 'bookings',
    PROFILE: 'profile',
    ADMIN: 'admin'
};

export const API_CONFIG = {
    RAZORPAY_KEY: 'rzp_test_ILzaLVLAtji6G9', // Move to .env in production
    MAP_TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    MAP_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    MAP_ZOOM_LEVEL: 15
};

export const VALIDATION = {
    MIN_DURATION: 1,
    MAX_DURATION: 12,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[0-9]{10}$/
};

export const UI_CONFIG = {
    TOAST_DURATION: 3000,
    ANIMATION_DURATION: 400,
    DEBOUNCE_DELAY: 300
};

export const DEFAULT_USER = {
    name: 'Demo User',
    email: '',
    phone: ''
};

export const CURRENCY = {
    SYMBOL: '₹',
    CODE: 'INR'
};

export const ADMIN_CREDENTIALS = {
    email: 'admin@parkease.com',
    name: 'Admin'
};
