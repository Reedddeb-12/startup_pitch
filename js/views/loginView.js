/**
 * ParkEase - Login View (Fixed)
 * Renders the login/signup page with proper animations
 */

function renderLoginView() {
    const container = document.getElementById('loginView');

    // Set up container for animation
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.minHeight = '100vh';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.padding = '1rem';

    container.innerHTML = `
        <!-- Animated Background Container -->
        <div id="loginBgContainer" class="bg-paths-container"></div>
        
        <!-- Login Form (with higher z-index) -->
        <div style="position: relative; z-index: 10;" class="w-full max-w-md">
            <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 animate-fadeIn">
                <div class="text-center mb-10">
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-6xl animate-bounce" style="animation-duration: 2s;">
                        🚗
                    </div>
                    <h1 id="loginTitle" class="text-5xl font-bold text-slate-800 mb-2"></h1>
                    <p class="text-slate-500 animate-fadeIn" style="animation-delay: 0.5s;">The future of parking is here.</p>
                </div>
                
                <form id="loginForm" class="space-y-4">
                    <!-- Signup Fields (Hidden by default) -->
                    <div id="signupFields" class="space-y-4" style="display: none;">
                        <div class="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style="pointer-events: none;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            <input type="text" id="signupName" placeholder="Full Name" class="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                        </div>
                        <div class="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style="pointer-events: none;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            <input type="tel" id="signupPhone" placeholder="Phone Number" class="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                        </div>
                    </div>

                    <!-- Email Field -->
                    <div class="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style="pointer-events: none;"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        <input type="email" id="loginEmail" placeholder="Email" required class="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                    </div>

                    <!-- Password Field -->
                    <div class="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style="pointer-events: none;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        <input type="password" id="loginPassword" placeholder="Password" required class="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" id="authButton" class="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg hover:shadow-blue-500/30">
                        Login
                    </button>

                    <!-- Toggle Auth Mode -->
                    <p class="text-center text-sm text-slate-600">
                        <span id="authToggleText">Don't have an account?</span>
                        <button type="button" id="authToggleButton" class="text-blue-500 font-semibold hover:underline ml-2">Sign Up</button>
                    </p>
                </form>

                <!-- Admin Login -->
                <div class="mt-6 pt-6 border-t border-slate-200 text-center">
                    <button id="adminLoginButton" class="text-sm text-slate-500 hover:text-blue-500 transition">Continue as Admin</button>
                </div>
            </div>
        </div>
    `;

    // Initialize animated background after DOM is ready
    setTimeout(() => {
        initLoginAnimation();
    }, 100);

    // Animate title with letter-by-letter effect
    setTimeout(() => {
        animateLoginTitle();
    }, 200);

    // Initialize form handlers
    setTimeout(() => {
        initAuthForm();
    }, 300);
}

/**
 * Initialize login animation background
 */
function initLoginAnimation() {
    const bgContainer = document.getElementById('loginBgContainer');
    
    if (!bgContainer) {
        console.warn('Background container not found');
        return;
    }

    if (typeof window.BackgroundPaths !== 'function') {
        console.warn('BackgroundPaths not loaded. Skipping animation.');
        return;
    }

    try {
        const bgPaths = new window.BackgroundPaths('loginBgContainer');
        
        if (!window.parkEaseAnimations) {
            window.parkEaseAnimations = {};
        }
        window.parkEaseAnimations.loginBg = bgPaths;
        
        console.log('✅ Login background animation initialized');
    } catch (error) {
        console.error('Failed to initialize background animation:', error);
    }
}

/**
 * Animate login title text
 */
function animateLoginTitle() {
    const titleElement = document.getElementById('loginTitle');
    if (!titleElement) {
        console.warn('Title element not found');
        return;
    }

    if (typeof window.TextAnimator === 'undefined' || typeof window.TextAnimator.animateText !== 'function') {
        // Fallback animation
        titleElement.textContent = 'ParkEase';
        titleElement.style.opacity = '0';
        setTimeout(() => {
            titleElement.style.transition = 'opacity 1s ease-in-out';
            titleElement.style.opacity = '1';
        }, 100);
        return;
    }

    try {
        window.TextAnimator.animateText(titleElement, 'ParkEase', 100);
        console.log('✅ Title animation initialized');
    } catch (error) {
        console.error('Failed to animate title:', error);
        // Fallback
        titleElement.textContent = 'ParkEase';
        titleElement.style.opacity = '1';
    }
}

/**
 * Cleanup animations when leaving login view
 */
function cleanupLoginAnimation() {
    if (window.parkEaseAnimations && window.parkEaseAnimations.loginBg) {
        try {
            window.parkEaseAnimations.loginBg.destroy();
            delete window.parkEaseAnimations.loginBg;
            console.log('✅ Login animation cleaned up');
        } catch (error) {
            console.error('Failed to cleanup login animation:', error);
        }
    }
}

// Export cleanup function
window.cleanupLoginAnimation = cleanupLoginAnimation;
