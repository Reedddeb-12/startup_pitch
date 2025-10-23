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
                authButton.disabled = false;
                authButton.innerText = originalText;
                return;
            }

            if (!validatePhone(phone)) {
                showError('Please enter a valid 10-digit phone number');
                authButton.disabled = false;
                authButton.innerText = originalText;
                return;
            }

            // Call signup API
            response = await window.API.auth.register({
                name,
                email,
                password,
                phone
            });

            if (response.success) {
                showSuccess('Account created successfully! Please login.');
                isSignupMode = false;
                updateAuthUI(
                    document.getElementById('signupFields'),
                    authButton,
                    document.getElementById('authToggleText'),
                    document.getElementById('authToggleButton')
                );
                resetForm('loginForm');
            }
        } else {
            // Call login API
            response = await window.API.auth.login({
                email,
                password
            });

            if (response.success && response.data?.user) {
                setUser(response.data.user);
                setState({ isAuthenticated: true });
                resetForm('loginForm');
                isSignupMode = false;
                
                // Load parking lots before showing home
                await loadInitialData();
                setView('home');
                showSuccess('Login successful!');
            }
        }

    } catch (error) {
        console.error('Auth error:', error);
        
        if (error.status === 400) {
            showError(error.data?.message || 'Invalid email or password');
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
    const adminPassword = 'admin123';

    try {
        const response = await window.API.auth.login({
            email: adminEmail,
            password: adminPassword
        });

        if (response.success && response.data?.user) {
            setUser(response.data.user);
            setState({ isAuthenticated: true });
            
            // Load parking lots before showing admin
            await loadInitialData();
            setView('admin');
            showSuccess('Admin login successful!');
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

    // Clear local storage
    window.API.clearAuthToken();
    
    // Clear state
    clearUser();
    setState({ 
        searchQuery: '', 
        selectedLot: null, 
        booking: null,
        isAuthenticated: false,
        bookings: [] 
    });
    
    isSignupMode = false;
    setView('login');
    scrollToTop();
    showSuccess('Logged out successfully');
}

/**
 * Show error message
 */
function showError(message) {
    console.error('❌ Error:', message);
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slideInUp';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
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
