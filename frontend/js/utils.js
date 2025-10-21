/**
 * ParkEase - Utility Functions
 * Common helper functions used throughout the application
 */

/**
 * Format currency (Indian Rupees)
 */
function formatCurrency(amount) {
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
    return Date.now();
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
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Calculate parking slot occupancy percentage
 */
function calculateOccupancyPercentage(availableSlots, totalSlots) {
    return ((totalSlots - availableSlots) / totalSlots) * 100;
}

/**
 * Calculate available slot percentage
 */
function calculateAvailablePercentage(availableSlots, totalSlots) {
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
    window.scrollTo(0, 0);
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
            String(item[field]).toLowerCase().includes(lowerQuery)
        )
    );
}
