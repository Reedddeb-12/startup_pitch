/**
 * ParkEase - Main Application
 * Core app logic and view management - UPDATED FOR PRODUCTION
 */

/**
 * ✅ UPDATED: Set current view with validation and auth checks
 */
function setView(viewName) {
    const currentState = getState();
    
    // ✅ NEW: Validate view exists
    const validViews = ['login', 'home', 'details', 'payment', 'ticket', 'bookings', 'profile', 'admin'];
    if (!validViews.includes(viewName)) {
        console.error('Invalid view:', viewName);
        return;
    }

    // ✅ NEW: Redirect to login if trying to access protected views
    if (viewName !== 'login' && !isAuthenticated()) {
        console.warn('Attempted to access protected view without authentication:', viewName);
        setView('login');
        return;
    }

    // ✅ NEW: Redirect to login if trying to access admin without proper role
    if (viewName === 'admin' && !isAdmin()) {
        console.warn('Attempted to access admin view without admin role');
        setView('login');
        return;
    }

    // Update state with new view
    setState({ currentView: viewName });
    
    // Scroll to top and render
    scrollToTop();
    render();
}

/**
 * ✅ UPDATED: Main render function with error handling
 */
function render() {
    try {
        const currentState = getState();
        const viewName = currentState.currentView;

        // Hide all views first
        document.querySelectorAll('.view').forEach(view => {
            view.style.display = 'none';
        });

        // Get the current view element
        const currentViewEl = document.getElementById(`${viewName}View`);
        
        if (!currentViewEl) {
            console.error(`View element not found: ${viewName}View`);
            return;
        }

        // Show the view
        currentViewEl.style.display = 'block';

        // ✅ NEW: Flex display for centered views
        if (['login', 'ticket'].includes(viewName)) {
            currentViewEl.style.display = 'flex';
        }

        // ✅ UPDATED: Call the appropriate render function
        switch (viewName) {
            case 'login':
                renderLoginView();
                break;
            
            case 'home':
                if (isAuthenticated()) {
                    renderHomeView();
                } else {
                    setView('login');
                }
                break;
            
            case 'details':
                if (currentState.selectedLot) {
                    renderDetailsView();
                } else {
                    setView('home');
                }
                break;
            
            case 'payment':
                if (currentState.booking) {
                    renderPaymentView();
                } else {
                    setView('home');
                }
                break;
            
            case 'ticket':
                if (currentState.booking) {
                    renderTicketView();
                } else {
                    setView('home');
                }
                break;
            
            case 'bookings':
                if (isAuthenticated()) {
                    renderBookingsView();
                } else {
                    setView('login');
                }
                break;
            
            case 'profile':
                if (isAuthenticated()) {
                    renderProfileView();
                } else {
                    setView('login');
                }
                break;
            
            case 'admin':
                if (isAuthenticated() && isAdmin()) {
                    renderAdminView();
                } else {
                    console.warn('Unauthorized access to admin view');
                    setView('login');
                }
                break;
            
            default:
                console.error('Unknown view:', viewName);
                setView('login');
        }
    } catch (error) {
        console.error('Error rendering view:', error);
        showError('An error occurred. Please try again.');
        setView('login');
    }
}

/**
 * ✅ UPDATED: Initialize the application with comprehensive error handling
 */
function initApp() {
    console.log('=== ParkEase App Initializing ===');
    
    try {
        // ✅ NEW: Check if required APIs are available
        if (!window.API) {
            throw new Error('API module not loaded');
        }

        // ✅ NEW: Log initial state
        console.log('Initial State:', getState());
        
        // Set initial view to login
        setState({ currentView: 'login' });
        
        // Perform initial render
        render();
        
        // Setup global error handlers
        setupGlobalErrorHandler();
        
        // Setup resize listener for responsive design
        setupResizeListener();
        
        // ✅ NEW: Restore authentication token if available
        const token = window.API.getAuthToken();
        if (token && !getUser()) {
            console.log('Restoring session from token...');
            restoreSessionFromToken();
        }
        
        console.log('=== ParkEase App Ready ===');
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        alert('Failed to initialize application. Please refresh the page.');
    }
}

/**
 * ✅ NEW: Restore user session from stored token
 */
async function restoreSessionFromToken() {
    try {
        const response = await window.API.auth.getMe();
        if (response.success && response.data) {
            setUser(response.data);
            setView('home');
        }
    } catch (error) {
        console.warn('Failed to restore session:', error);
        window.API.clearAuthToken();
    }
}

/**
 * ✅ UPDATED: Setup global error handler
 */
function setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
        console.error('Global error caught:', event.error);
        // ✅ NEW: Don't show error for expected errors
        if (event.error && !event.error.handled) {
            showError('An unexpected error occurred');
        }
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        showError('An unexpected error occurred');
        event.preventDefault();
    });
}

/**
 * ✅ UPDATED: Setup resize listener for responsive design
 */
function setupResizeListener() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log('Window resized');
            // Re-render if needed for responsive changes
            const currentState = getState();
            if (['home', 'admin'].includes(currentState.currentView)) {
                render();
            }
        }, 250);
    });
}

/**
 * ✅ NEW: Handle app navigation
 */
function navigate(path) {
    console.log('Navigating to:', path);
    setView(path);
}

/**
 * ✅ NEW: Debug function to log current state
 */
function debugState() {
    console.log('=== Current App State ===');
    const state = getState();
    console.log('View:', state.currentView);
    console.log('User:', state.user);
    console.log('Selected Lot:', state.selectedLot);
    console.log('Booking:', state.booking);
    console.log('Parking Lots:', state.parkingLots);
    console.log('Bookings:', state.bookings);
    console.log('Search Query:', state.searchQuery);
    console.log('========================');
}

/**
 * ✅ NEW: App metadata
 */
const APP_INFO = {
    name: 'ParkEase',
    version: '1.0.0',
    description: 'Smart Parking Booking Application',
    author: 'ParkEase Team',
    year: new Date().getFullYear(),
    apiUrl: window.API?.API_BASE_URL || 'unknown'
};

/**
 * ✅ NEW: Log app info with styling
 */
function logAppInfo() {
    console.log(
        `%c${APP_INFO.name} v${APP_INFO.version}`,
        'font-size: 20px; font-weight: bold; color: #3B82F6;'
    );
    console.log(
        `%c${APP_INFO.description}`,
        'font-size: 12px; color: #666;'
    );
    console.log(
        `%cAPI: ${APP_INFO.apiUrl}`,
        'font-size: 10px; color: #999;'
    );
    console.log(
        `%c© ${APP_INFO.year} ${APP_INFO.author}`,
        'font-size: 10px; color: #999;'
    );
}

/**
 * ✅ UPDATED: Start the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting ParkEase');
    logAppInfo();
    initApp();
});

/**
 * ✅ NEW: Handle page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('App backgrounded');
    } else {
        console.log('App foregrounded');
        // ✅ NEW: Refresh critical data if needed
        if (isAuthenticated()) {
            const view = getStateProperty('currentView');
            if (view === 'home') {
                render();
            }
        }
    }
});

/**
 * ✅ UPDATED: Handle before unload
 */
window.addEventListener('beforeunload', (event) => {
    const booking = getStateProperty('booking');
    if (booking && booking.status === 'pending') {
        event.preventDefault();
        event.returnValue = 'You have an incomplete booking. Are you sure you want to leave?';
    }
});

/**
 * ✅ UPDATED: Export for console debugging
 */
window.ParkEase = {
    setState,
    getState,
    setView,
    navigate,
    debugState,
    logAppInfo,
    APP_INFO,
    // ✅ NEW: Add helpful console functions
    showError,
    showSuccess: typeof showSuccess !== 'undefined' ? showSuccess : alert
};

console.log('💡 Tip: Type "ParkEase.debugState()" in console to view app state');
