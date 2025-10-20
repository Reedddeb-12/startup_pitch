/**
 * ParkEase - Profile View
 * Renders user profile and statistics
 */

function renderProfileView() {
    const container = document.getElementById('profileView');
    const user = getUser();
    const stats = getBookingStats();

    container.innerHTML = `
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6">
            <div class="flex items-center gap-4">
                <button id="backToHomeFromProfile" class="bg-slate-700/50 p-2 rounded-full">
                    ${ICONS.Back}
                </button>
                <h1 class="text-2xl font-bold">My Profile</h1>
            </div>
        </div>

        <div class="p-6 space-y-6">
            <!-- User Info Card -->
            <div class="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/50">
                    ${ICONS.User}
                </div>
                <h2 class="text-2xl font-bold text-slate-800">${user.name}</h2>
                <p class="text-slate-500">${user.email}</p>
                ${user.phone ? `<p class="text-slate-500 mt-1">${user.phone}</p>` : ''}
                <p class="text-xs text-slate-400 mt-3">Member since ${new Date().getFullYear()}</p>
            </div>

            <!-- Parking Stats -->
            <div class="bg-white rounded-2xl p-5 shadow-lg">
                <h3 class="font-bold text-lg mb-4">Parking Statistics</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-4 bg-blue-50 rounded-lg">
                        <p class="text-3xl font-bold text-blue-600">${stats.total}</p>
                        <p class="text-sm text-slate-600 mt-1">Total Bookings</p>
                    </div>
                    <div class="text-center p-4 bg-green-50 rounded-lg">
                        <p class="text-3xl font-bold text-green-600">₹${stats.totalSpent}</p>
                        <p class="text-sm text-slate-600 mt-1">Total Spent</p>
                    </div>
                    <div class="text-center p-4 bg-purple-50 rounded-lg">
                        <p class="text-3xl font-bold text-purple-600">${stats.totalHours}</p>
                        <p class="text-sm text-slate-600 mt-1">Total Hours</p>
                    </div>
                    <div class="text-center p-4 bg-orange-50 rounded-lg">
                        <p class="text-3xl font-bold text-orange-600">${stats.completed}</p>
                        <p class="text-sm text-slate-600 mt-1">Completed</p>
                    </div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="bg-white rounded-2xl p-5 shadow-lg">
                <h3 class="font-bold text-lg mb-3">Activity Summary</h3>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between pb-2 border-b">
                        <span class="text-slate-600">Active Bookings</span>
                        <span class="font-bold">${stats.active}</span>
                    </div>
                    <div class="flex justify-between pb-2 border-b">
                        <span class="text-slate-600">Completed Bookings</span>
                        <span class="font-bold">${stats.completed}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600">Cancelled Bookings</span>
                        <span class="font-bold text-red-600">${stats.cancelled}</span>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
                <button id="profileViewBookings" class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition">
                    View Bookings
                </button>
                <button id="profileLogoutButton" class="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition">
                    Logout
                </button>
            </div>
        </div>
    `;

    // Event Listeners
    document.getElementById('backToHomeFromProfile').addEventListener('click', () => setView('home'));
    document.getElementById('profileViewBookings').addEventListener('click', () => setView('bookings'));
    document.getElementById('profileLogoutButton').addEventListener('click', handleLogout);
}