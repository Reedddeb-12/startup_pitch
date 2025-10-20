/**
 * ParkEase - Admin View
 * Renders admin dashboard with parking lot management
 */

function renderAdminView() {
    const container = document.getElementById('adminView');
    const stats = getAdminStats();
    const parkingLots = getStateProperty('parkingLots');

    const lotsHTML = parkingLots.length === 0 
        ? '<div class="text-center py-8"><p class="text-slate-500">No parking lots added yet</p></div>'
        : parkingLots.map(lot => `
            <div class="border border-slate-200 rounded-lg p-3">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-semibold">${lot.name}</h3>
                        <p class="text-sm text-slate-500">${lot.address}</p>
                        <div class="flex gap-4 mt-2 text-sm">
                            <span class="text-slate-600">Slots: ${lot.availableSlots}/${lot.totalSlots}</span>
                            <span class="text-slate-600">₹${lot.pricePerHour}/hr</span>
                        </div>
                    </div>
                    <button data-lot-id="${lot.id}" class="delete-lot-btn text-red-500 hover:bg-red-50 p-2 rounded-lg">
                        ${ICONS.Delete}
                    </button>
                </div>
            </div>
        `).join('');

    container.innerHTML = `
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h1 class="text-2xl font-bold">Admin Dashboard</h1>
                    <p class="text-slate-300">ParkEase Management</p>
                </div>
                <button id="adminLogout" class="bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition">
                    Logout
                </button>
            </div>
        </div>
        <div class="p-6 space-y-6">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white rounded-lg p-4 shadow">
                    <p class="text-slate-500 text-sm">Total Lots</p>
                    <p class="text-3xl font-bold text-slate-800">${stats.totalLots}</p>
                </div>
                <div class="bg-white rounded-lg p-4 shadow">
                    <p class="text-slate-500 text-sm">Available Slots</p>
                    <p class="text-3xl font-bold text-green-600">${stats.availableSlots}/${stats.totalSlots}</p>
                </div>
                <div class="bg-white rounded-lg p-4 shadow">
                    <p class="text-slate-500 text-sm">Total Revenue</p>
                    <p class="text-3xl font-bold text-blue-600">₹${stats.totalRevenue}</p>
                </div>
                <div class="bg-white rounded-lg p-4 shadow">
                    <p class="text-slate-500 text-sm">Total Bookings</p>
                    <p class="text-3xl font-bold text-purple-600">${stats.totalBookings}</p>
                </div>
            </div>

            <!-- Parking Lots Section -->
            <div class="bg-white rounded-xl p-4 shadow-lg">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-bold text-lg">Parking Lots</h2>
                    <button id="showAddLotModal" class="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition flex items-center gap-2">
                        + Add Lot
                    </button>
                </div>
                <div id="adminLotsList" class="space-y-3">
                    ${lotsHTML}
                </div>
            </div>

            <!-- Add Lot Modal Content -->
            <div id="addLotModalContent">
                <div class="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-slate-800">Add Parking Lot</h2>
                        <button id="closeAddLotModal" class="text-slate-500 hover:text-slate-700">
                            ${ICONS.Close}
                        </button>
                    </div>
                    <form id="addLotForm" class="space-y-4">
                        <input type="text" name="name" placeholder="Parking Lot Name" class="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                        <input type="text" name="address" placeholder="Address" class="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                        <div class="grid grid-cols-2 gap-4">
                            <input type="text" name="distance" placeholder="Distance (e.g., 1.5 km)" class="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                            <input type="number" name="totalSlots" placeholder="Total Slots" class="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <input type="number" name="lat" placeholder="Latitude" step="any" class="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                            <input type="number" name="lon" placeholder="Longitude" step="any" class="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                        </div>
                        <input type="number" name="pricePerHour" placeholder="Price per Hour (₹)" step="0.01" class="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                        <input type="text" name="amenities" placeholder="Amenities (comma separated)" class="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        <button type="submit" class="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg">
                            Add Parking Lot
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Event Listeners
    document.getElementById('adminLogout').addEventListener('click', () => {
        handleLogout();
    });

    document.getElementById('showAddLotModal').addEventListener('click', openAddLotModalHandler);
    document.getElementById('closeAddLotModal').addEventListener('click', closeAddLotModalHandler);

    document.querySelectorAll('.delete-lot-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lotId = parseInt(e.currentTarget.dataset.lotId, 10);
            handleDeleteLot(lotId);
        });
    });

    // Initialize add lot modal
    initAddLotModal();
}