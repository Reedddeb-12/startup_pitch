/**
 * ParkEase - Authentication Handler
 * Production-ready authentication with API integration
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

    if (!loginForm) return;

    // Toggle between login and signup
    authToggleButton?.addEventListener('click', (e) => {
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
    adminLoginButton?.addEventListener('click', handleAdminLogin);
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
 * Handle authentication submission with API
 */
async function handleAuthSubmit() {
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    const authButton = document.getElementById('authButton');

    // Validate inputs
    if (!email || !password) {
        showError('Please fill in all required fields');
        return;
    }

    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    // Disable button during submission
    authButton.disabled = true;
    const originalText = authButton.innerText;
    authButton.innerText = 'Processing...';

    try {
        let response;

        if (isSignupMode) {
            const name = document.getElementById('signupName')?.value.trim();
            const phone = document.getElementById('signupPhone')?.value.trim();

            if (!name) {
                showError('Please enter your full name');
                return;
            }

            if (!validatePhone(phone)) {
                showError('Please enter a valid 10-digit phone number');
                return;
            }

            // Call signup API
            response = await window.API.auth.register({
                name,
                email,
                password,
                phone
            });

            showSuccess('Account created successfully! Welcome to ParkEase.');
        } else {
            // Call login API
            response = await window.API.auth.login({
                email,
                password
            });

            showSuccess('Login successful!');
        }

        if (response.success && response.data?.user) {
            // Store user in state
            setUser(response.data.user);
            
            // Reset form
            resetForm('loginForm');
            isSignupMode = false;
            
            // Navigate to home
            setView('home');
        }

    } catch (error) {
        console.error('Auth error:', error);
        
        if (error.status === 400) {
            showError(error.message || 'Invalid email or password');
        } else if (error.status === 401) {
            showError('Incorrect email or password');
        } else if (error.status === 409) {
            showError('Email already registered. Please login instead.');
        } else {
            showError(error.message || 'Authentication failed. Please try again.');
        }
    } finally {
        authButton.disabled = false;
        authButton.innerText = originalText;
    }
}

/**
 * Handle admin login
 */
async function handleAdminLogin() {
    const adminEmail = 'admin@parkease.com';
    const adminPassword = 'admin123'; // In production, use proper admin credentials

    try {
        const response = await window.API.auth.login({
            email: adminEmail,
            password: adminPassword
        });

        if (response.success && response.data?.user) {
            setUser(response.data.user);
            setView('admin');
        }
    } catch (error) {
        console.error('Admin login error:', error);
        showError('Admin login failed. Please use regular login.');
    }
}

/**
 * Handle logout
 */
async function handleLogout() {
    try {
        await window.API.auth.logout();
    } catch (error) {
        console.error('Logout error:', error);
    }

    clearUser();
    setState({ searchQuery: '', selectedLot: null, booking: null });
    isSignupMode = false;
    setView('login');
    scrollToTop();
}

/**
 * Show success message
 */
function showSuccess(message) {
    console.log('Success:', message);
    // TODO: Replace with toast notification
    alert(message);
}

/**
 * Show error message
 */
function showError(message) {
    console.error('Error:', message);
    // TODO: Replace with toast notification
    alert(message);
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
    return user && user.role === 'admin';
}
