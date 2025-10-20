/**
 * ParkEase - Login View
 * Renders the login/signup page
 */

function renderLoginView() {
    const container = document.getElementById('loginView');

    container.innerHTML = `
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md">
            <div class="text-center mb-10">
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M14 16.5 V 19 a 2 2 0 0 1 -2 2 h -4 a 2 2 0 0 1 -2 -2 v -2.5" /><path d="M14 16.5 h 6 a 2 2 0 0 0 2 -2 V 8 a 2 2 0 0 0 -2 -2 h -1" /><path d="M4 16.5 H 2 a 2 2 0 0 1 -2 -2 V 8 a 2 2 0 0 1 2 -2 h 1" /><path d="M5 11 l 1 -5 h 12 l 1 5" /><path d="M2 11 h 20" /><circle cx="7" cy="16.5" r="2.5" /><circle cx="17" cy="16.5" r="2.5" /></svg>
                </div>
                <h1 class="text-5xl font-bold text-slate-800 mb-2">ParkEase</h1>
                <p class="text-slate-500">The future of parking is here.</p>
            </div>
            
            <form id="loginForm" class="space-y-4">
                <!-- Signup Fields (Hidden by default) -->
                <div id="signupFields" class="space-y-4" style="display: none;">
                    <div class="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        <input type="text" id="signupName" placeholder="Full Name" class="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                    </div>
                    <div class="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        <input type="tel" id="signupPhone" placeholder="Phone Number" class="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                    </div>
                </div>

                <!-- Email Field -->
                <div class="relative">
                    ${ICONS.Email}
                    <input type="email" id="loginEmail" placeholder="Email" class="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                </div>

                <!-- Password Field -->
                <div class="relative">
                    ${ICONS.Lock}
                    <input type="password" id="loginPassword" placeholder="Password" class="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                </div>

                <!-- Submit Button -->
                <button type="submit" id="authButton" class="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg hover:shadow-blue-500/30">
                    Login
                </button>

                <!-- Toggle Auth Mode -->
                <p class="text-center text-sm text-slate-600">
                    <span id="authToggleText">Don't have an account?</span>
                    <button type="button" id="authToggleButton" class="text-blue-500 font-semibold hover:underline">Sign Up</button>
                </p>
            </form>

            <!-- Admin Login -->
            <div class="mt-6 pt-6 border-t border-slate-200 text-center">
                <button id="adminLoginButton" class="text-sm text-slate-500 hover:text-blue-500 transition">Continue as Admin</button>
            </div>
        </div>
    `;

    // Initialize form handlers
    initAuthForm();
}