/**
 * ParkEase Backend - Constants
 * Application-wide constants
 */

module.exports = {
    ROLES: {
        USER: 'user',
        ADMIN: 'admin'
    },

    BOOKING_STATUS: {
        PENDING: 'pending',
        ACTIVE: 'active',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
    },

    PAYMENT_STATUS: {
        PENDING: 'pending',
        SUCCESS: 'success',
        FAILED: 'failed',
        REFUNDED: 'refunded'
    },

    VALIDATION: {
        MIN_DURATION: 1,
        MAX_DURATION: 12,
        MIN_PASSWORD_LENGTH: 6,
        PHONE_LENGTH: 10
    },

    ADMIN_EMAILS: [
        'admin@parkease.com'
    ],

    CURRENCY: 'INR',

    QR_CODE_PREFIX: 'PARKEASE',

    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100
    },

    JWT: {
        EXPIRES_IN: '7d',
        COOKIE_EXPIRE: 7
    },

    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100
    }
};
