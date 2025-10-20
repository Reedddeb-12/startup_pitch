/**
 * ParkEase - Authentication Handler
 * Handles login, signup, and logout functionality
 */

let isSignupMode = false;

/**
 * Initialize authentication form
 */
function initAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const authToggleButton = document.getElementById('authToggleButton');
    const signupFields = document.getElementById('signupFields');
    const authButton = document.getElementById('authButton');
    const authToggleText = document.getElementById('authToggleText');
    const adminLoginButton = document.getElementById('adminLoginButton');

    // Toggle between login and signup
    authToggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        isSignupMode = !isSignupMode;
        updateAuthUI(signupFields, authButton, authToggleText, authToggleButton);
    });

    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAuthSubmit();
    });

    // Admin login
    adminLoginButton.addEventListener('click', handleAdminLogin);
}

/**
 * Update UI based on auth mode
 */
function updateAuthUI(signupFields, authButton, authToggleText, authToggleButton) {
    if (isSignupMode) {
        signupFields.style.display = 'block';
        authButton.innerText = 'Create Account';
        authToggleText.innerText = 'Already have an account?';
        authToggleButton.innerText = 'Login';
    } else {
        signupFields.style.display = 'none';
        authButton.innerText = 'Login';
        authToggleText.innerText = "Don't have an account?";
        authToggleButton.innerText = 'Sign Up';
    }
}

/**
 * Handle authentication submission
 */
function handleAuthSubmit() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validate inputs
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        showError('Please enter a valid email');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    let user;

    if (isSignupMode) {
        const name = document.getElementById('signupName').value.trim();
        const phone = document.getElementById('signupPhone').value.trim();

        if (!name) {
            showError('Please enter your name');
            return;
        }

        if (!validatePhone(phone)) {
            showError('Please enter a valid 10-digit phone number');
            return;
        }

        user = {
            id: generateId(),
            email,
            name,
            phone,
            createdAt: getCurrentDateTime().fullDate
        };
    } else {
        user = {
            id: generateId(),
            email,
            name: 'User',
            phone: ''
        };
    }

    // Set user and navigate
    setUser(user);
    resetForm('loginForm');
    isSignupMode = false;
    setView('home');
}

/**
 * Handle admin login
 */
function handleAdminLogin() {
    const adminUser = {
        id: generateId(),
        email: 'admin@parkease.com',
        name: 'Admin',
        role: 'admin'
    };

    setUser(adminUser);
    setView('admin');
}

/**
 * Handle logout
 */
function handleLogout() {
    clearUser();
    setState({ searchQuery: '', selectedLot: null, booking: null });
    setView('login');
    scrollToTop();
}

/**
 * Show error message
 */
function showError(message) {
    alert(message); // Replace with toast notification in production
    console.error(message);
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return isUserLoggedIn();
}

/**
 * Check if user is admin
 */
function isAdmin() {
    const user = getUser();
    return user && user.role === 'admin';
}