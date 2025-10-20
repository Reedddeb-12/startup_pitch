/**
 * ParkEase - Main Application
 * Core app logic and view management
 * This is the heart of the application
 */

/**
 * Set current view
 * @param {string} viewName - Name of the view to display
 */
function setView(viewName) {
    const currentState = getState();
    
    // Validate view exists
    const validViews = ['login', 'home', 'details', 'payment', 'ticket', 'bookings', 'profile', 'admin'];
    if (!validViews.includes(viewName)) {
        console.error('Invalid view:', viewName);
        return;
    }

    // Redirect to login if trying to access protected views without authentication
    if (viewName !== 'login' && !isAuthenticated()) {
        console.warn('Attempted to access protected view without authentication');
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
 * Main render function
 * Controls view visibility and calls appropriate render functions
 */
function render() {
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

    // Flex display for centered views (login and ticket)
    if (['login', 'ticket'].includes(viewName)) {
        currentViewEl.style.display = 'flex';
    }

    // Call the appropriate render function based on view
    try {
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
 * Initialize the application
 * Called when DOM is ready
 */
function initApp() {
    console.log('=== ParkEase App Initializing ===');
    
    try {
        // Log initial state
        console.log('Initial State:', getState());
        
        // Set initial view to login
        setState({ currentView: 'login' });
        
        // Perform initial render
        render();
        
        // Setup global error handler
        setupGlobalErrorHandler();
        
        // Setup resize listener for responsive design
        setupResizeListener();
        
        console.log('=== ParkEase App Ready ===');
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        alert('Failed to initialize application. Please refresh the page.');
    }
}

/**
 * Setup global error handler
 */
function setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        showError('An unexpected error occurred');
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        showError('An unexpected error occurred');
    });
}

/**
 * Setup resize listener for responsive design
 */
function setupResizeListener() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log('Window resized');
            // Re-render if needed for responsive changes
            const currentState = getState();
            if (currentState.currentView === 'home') {
                render();
            }
        }, 250);
    });
}

/**
 * Handle app navigation
 * @param {string} path - Navigation path
 */
function navigate(path) {
    console.log('Navigating to:', path);
    setView(path);
}

/**
 * Handle app state changes
 * Useful for debugging
 */
function onStateChange(callback) {
    const originalSetState = setState;
    setState = function(updates) {
        const newState = originalSetState(updates);
        callback(newState);
        return newState;
    };
}

/**
 * Debug function to log current state
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
 * App version and info
 */
const APP_INFO = {
    name: 'ParkEase',
    version: '1.0.0',
    description: 'Smart Parking Booking Application',
    author: 'Your Name',
    year: new Date().getFullYear()
};

/**
 * Log app info
 */
function logAppInfo() {
    console.log(`%c${APP_INFO.name} v${APP_INFO.version}`, 'font-size: 20px; font-weight: bold; color: #3B82F6;');
    console.log(`%c${APP_INFO.description}`, 'font-size: 12px; color: #666;');
    console.log(`%c© ${APP_INFO.year} ${APP_INFO.author}`, 'font-size: 10px; color: #999;');
}

/**
 * Start the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting ParkEase');
    logAppInfo();
    initApp();
});

/**
 * Handle page visibility changes
 * Pause/resume operations based on tab visibility
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('App backgrounded');
    } else {
        console.log('App foregrounded');
        // Refresh data if needed
    }
});

/**
 * Handle before unload
 * Warn user if leaving with unsaved data
 */
window.addEventListener('beforeunload', (event) => {
    const booking = getStateProperty('booking');
    if (booking && booking.status === 'pending') {
        event.preventDefault();
        event.returnValue = 'You have an incomplete booking. Are you sure you want to leave?';
    }
});

/**
 * Export for debugging in console
 */
window.ParkEase = {
    setState,
    getState,
    setView,
    navigate,
    debugState,
    logAppInfo,
    APP_INFO
};

console.log('Type "ParkEase.debugState()" in console to view app state');