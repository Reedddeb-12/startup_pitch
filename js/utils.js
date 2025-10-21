/**
 * ParkEase - Utility Functions
 * Common helper functions used throughout the application
 */

/**
 * Format currency (Indian Rupees)
 */
function formatCurrency(amount) {
    if (typeof amount !== 'number') amount = parseFloat(amount) || 0;
    return `₹${amount.toFixed(2)}`;
}

/**
 * Format date to readable string
 */
function formatDate(date) {
    if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
}

/**
 * Format time to readable string
 */
function formatTime(date) {
    if (typeof date === 'string') {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get current date and time
 */
function getCurrentDateTime() {
    const now = new Date();
    return {
        date: formatDate(now),
        time: formatTime(now),
        fullDate: now
    };
}

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Generate QR code string
 */
function generateQRCode() {
    return `PARKEASE-${generateId()}`;
}

/**
 * Validate email
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (10 digits)
 */
function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(digitsOnly);
}

/**
 * Calculate parking slot occupancy percentage
 */
function calculateOccupancyPercentage(availableSlots, totalSlots) {
    if (totalSlots === 0) return 0;
    return ((totalSlots - availableSlots) / totalSlots) * 100;
}

/**
 * Calculate available slot percentage
 */
function calculateAvailablePercentage(availableSlots, totalSlots) {
    if (totalSlots === 0) return 0;
    return (availableSlots / totalSlots) * 100;
}

/**
 * Debounce function
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Get element by ID
 */
function getElement(id) {
    return document.getElementById(id);
}

/**
 * Set element innerHTML
 */
function setHTML(elementId, html) {
    const element = getElement(elementId);
    if (element) {
        element.innerHTML = html;
    }
}

/**
 * Add event listener
 */
function addEventListener(elementId, event, handler) {
    const element = getElement(elementId);
    if (element) {
        element.addEventListener(event, handler);
    }
}

/**
 * Get form data
 */
function getFormData(formId) {
    const form = getElement(formId);
    if (form) {
        return new FormData(form);
    }
    return null;
}

/**
 * Reset form
 */
function resetForm(formId) {
    const form = getElement(formId);
    if (form) {
        form.reset();
    }
}

/**
 * Show element
 */
function showElement(elementId) {
    const element = getElement(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

/**
 * Hide element
 */
function hideElement(elementId) {
    const element = getElement(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Toggle element visibility
 */
function toggleElement(elementId) {
    const element = getElement(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * Add CSS class to element
 */
function addClass(elementId, className) {
    const element = getElement(elementId);
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Remove CSS class from element
 */
function removeClass(elementId, className) {
    const element = getElement(elementId);
    if (element) {
        element.classList.remove(className);
    }
}

/**
 * Deep clone object
 */
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Filter array of objects
 */
function filterByQuery(items, query, searchFields) {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(item =>
        searchFields.some(field =>
            String(item[field] || '').toLowerCase().includes(lowerQuery)
        )
    );
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return isUserLoggedIn() && window.API.getAuthToken();
}

/**
 * Check if user is admin
 */
function isAdmin() {
    const user = getUser();
    return user && (user.role === 'admin' || user.role === 'ADMIN');
}

/**
 * Format booking amount
 */
function formatBookingAmount(pricePerHour, duration) {
    if (!pricePerHour || !duration) return '₹0.00';
    return formatCurrency(pricePerHour * duration);
}

/**
 * Get time difference in hours
 */
function getTimeDifferenceInHours(startTime, endTime) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return Math.round((end - start) / (1000 * 60 * 60));
}

/**
 * Check if date is today
 */
function isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.getDate() === today.getDate() &&
           checkDate.getMonth() === today.getMonth() &&
           checkDate.getFullYear() === today.getFullYear();
}

/**
 * Check if date is in the past
 */
function isPastDate(date) {
    return new Date(date) < new Date();
}

/**
 * Add hours to date
 */
function addHours(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

/**
 * Format date to readable string (DD MMM YYYY)
 */
function formatDateFull(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Create success response
 */
function successResponse(data, message = 'Success') {
    return {
        success: true,
        message,
        data
    };
}

/**
 * Create error response
 */
function errorResponse(message = 'Error occurred', statusCode = 500) {
    return {
        success: false,
        message,
        statusCode
    };
}

/**
 * Sleep/delay function
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if object is empty
 */
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * Convert array to object
 */
function arrayToObject(array, keyField = 'id') {
    return array.reduce((obj, item) => {
        obj[item[keyField]] = item;
        return obj;
    }, {});
}

/**
 * Sort array of objects by field
 */
function sortByField(array, field, order = 'asc') {
    return array.sort((a, b) => {
        if (order === 'asc') {
            return a[field] > b[field] ? 1 : -1;
        } else {
            return a[field] < b[field] ? 1 : -1;
        }
    });
}

/**
 * Get initials from name
 */
function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

/**
 * Truncate string
 */
function truncate(str, length = 50) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
}
