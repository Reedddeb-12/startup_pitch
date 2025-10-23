/**
 * ParkEase - Home View (Updated for Admin-Only Data Entry)
 * Renders the main parking lots listing page
 */

function renderHomeView() {
    const container = document.getElementById('homeView');
    const user = getUser();
    const parkingLots = getStateProperty('parkingLots');
    const searchQuery = getStateProperty('searchQuery');

    const filteredLots = filterByQuery(
        parkingLots,
        searchQuery,
        ['name', 'address']
    );

    let lotsHTML = '';
    if (filteredLots.length === 0) {
        if (parkingLots.length === 0) {
            // No parking lots at all
            lotsHTML = `
                <div class="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-slate-300 mb-4"><path d="M14 16.5 V 19 a 2 2 0 0 1 -2 2 h -4 a 2 2 0 0 1 -2 -2 v -2.5" /><path d="M14 16.5 h 6 a 2 2 0 0 0 2 -2 V 8 a 2 2 0 0 0 -2 -2 h -1" /><path d="M4 16.5 H 2 a 2 2 0 0 1 -2 -2 V 8 a 2 2 0 0 1 2 -2 h 1" /><path d="M5 11 l 1 -5 h 12 l 1 5" /><path d="M2 11 h 20" /><circle cx="7" cy="16.5" r="2.5" /><circle cx="17" cy="16.5" r="2.5" /></svg>
                    <h3 class="text-xl font-semibold text-slate-600 mb-2">No Parking Lots Available</h3>
                    <p class="text-slate-400 mb-4">Parking lots will appear here once admin adds them.</p>
                    ${isAdmin() ? `
                        <button onclick="setView('admin')" class="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition">
                            Go to Admin Panel
                        </button>
                    ` : `
                        <p class="text-sm text-slate-500">Please check back later or contact administrator.</p>
                    `}
                </div>
            `;
        } else {
            // No results for search query
            lotsHTML = `
                <div class="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-slate-300 mb-4"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <h3 class="text-xl font-semibold text-slate-600 mb-2">No Results Found</h3>
                    <p class="text-slate-400">Try searching with different keywords.</p>
                </div>
            `;
        }
    } else {
        lotsHTML = filteredLots.map(lot => `
            <div data-lot-id="${lot.id}" class="lot-card bg-white rounded-2xl p-5 shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-bold text-lg text-slate-800">${lot.name}</h3>
                        <div class="flex items-center gap-1 text-slate-500 text-sm mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            <span>${lot.address}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="fill-current"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        <span class="text-sm font-bold">${lot.rating || '4.0'}</span>
                    </div>
                </div>
                <div class="flex items-end justify-between mb-4">
                    <div class="flex items-center gap-4 text-sm">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                            <span class="text-slate-600">${lot.distance}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16.5 V 19 a 2 2 0 0 1 -2 2 h -4 a 2 2 0 0 1 -2 -2 v -2.5" /><path d="M14 16.5 h 6 a 2 2 0 0 0 2 -2 V 8 a 2 2 0 0 0 -2 -2 h -1" /><path d="M4 16.5 H 2 a 2 2 0 0 1 -2 -2 V 8 a 2 2 0 0 1 2 -2 h 1" /><path d="M5 11 l 1 -5 h 12 l 1 5" /><path d="M2 11 h 20" /><circle cx="7" cy="16.5" r="2.5" /><circle cx="17" cy="16.5" r="2.5" /></svg>
                            <span class="text-slate-600 font-semibold">${lot.availableSlots}/${lot.totalSlots}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-3xl font-extrabold text-slate-800">₹${lot.pricePerHour}</span>
                        <span class="text-sm text-slate-500">/hr</span>
                    </div>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2 mb-3">
                    <div class="bg-green-500 h-2 rounded-full" style="width: ${(lot.availableSlots / lot.totalSlots) * 100}%"></div>
                </div>
                ${lot.amenities && lot.amenities.length > 0 ? `
                    <div class="flex gap-2 flex-wrap">
                        ${lot.amenities.map(a => `<span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">${a}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    container.innerHTML = `
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 pb-24 rounded-b-3xl">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-3xl font-bold">Hello, ${user.name}</h1>
                    <p class="text-slate-300">Let's find you a parking spot.</p>
                </div>
                <button id="menuButton" class="p-2 bg-slate-700/50 rounded-lg transition z-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                </button>
            </div>
        </div>
        <div class="px-6 -mt-16 space-y-4">
            ${parkingLots.length > 0 ? `
                <div class="relative mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style="pointer-events: none;"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <input type="text" id="searchInput" placeholder="Search by name or address..." value="${searchQuery}" class="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-800 focus:outline-none shadow-xl border" />
                </div>
            ` : ''}
            <div id="lotsList">${lotsHTML}</div>
        </div>
        <div id="menuDropdown" style="display: none;" class="fixed top-24 right-6 bg-white rounded-xl shadow-xl p-2 z-40 w-52">
            <button data-view="bookings" class="menu-item w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                <span>My Bookings</span>
            </button>
            <button data-view="profile" class="menu-item w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <span>Profile</span>
            </button>
            ${isAdmin() ? `
                <button data-view="admin" class="menu-item w-full text-left px-4 py-2 hover:bg-purple-100 text-purple-600 rounded-lg flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                    <span>Admin Panel</span>
                </button>
            ` : ''}
            <button id="logoutButton" class="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 rounded-lg flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                <span>Logout</span>
            </button>
        </div>
    `;

    // Event Listeners
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            setState({ searchQuery: e.target.value });
            render();
        });
    }

    document.getElementById('menuButton').addEventListener('click', () => {
        const menu = document.getElementById('menuDropdown');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    document.querySelectorAll('.lot-card').forEach(card => {
        card.addEventListener('click', () => {
            const lotId = parseInt(card.dataset.lotId);
            const lot = getParkingLot(lotId);
            setState({ selectedLot: lot });
            setView('details');
        });
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            setView(item.dataset.view);
        });
    });

    document.getElementById('logoutButton').addEventListener('click', handleLogout);
}


async function renderBookingsView() {
    const container = document.getElementById('bookingsView');
    
    try {
        // Fetch bookings from API (localStorage)
        const response = await window.API.booking.getAll();
        const bookings = response.success ? response.data : [];

        // Update state with fetched bookings
        setState({ bookings });

        let contentHTML = '';

        if (bookings.length === 0) {
            contentHTML = `
                <div class="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-slate-300 mb-4"><path d="M14 16.5 V 19 a 2 2 0 0 1 -2 2 h -4 a 2 2 0 0 1 -2 -2 v -2.5" /><path d="M14 16.5 h 6 a 2 2 0 0 0 2 -2 V 8 a 2 2 0 0 0 -2 -2 h -1" /><path d="M4 16.5 H 2 a 2 2 0 0 1 -2 -2 V 8 a 2 2 0 0 1 2 -2 h 1" /><path d="M5 11 l 1 -5 h 12 l 1 5" /><path d="M2 11 h 20" /><circle cx="7" cy="16.5" r="2.5" /><circle cx="17" cy="16.5" r="2.5" /></svg>
                    <h3 class="text-xl font-semibold text-slate-600 mb-2">No Bookings Yet</h3>
                    <p class="text-slate-400 mb-6">Your booked parking spots will appear here.</p>
                    <button id="bookingsFindParking" class="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition">
                        Find Parking
                    </button>
                </div>
            `;
        } else {
            contentHTML = bookings.map(b => {
                const parkingLot = b.parkingLot || b.lot || {};
                const bookingId = b._id || b.id;
                
                return `
                    <div class="bg-white rounded-2xl p-5 shadow-lg">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h3 class="font-bold text-lg text-slate-800">${parkingLot.name || 'Parking Lot'}</h3>
                                <p class="text-sm text-slate-500">${parkingLot.address || 'Address not available'}</p>
                            </div>
                            <span class="px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                b.status === 'completed' ? 'bg-green-100 text-green-700' :
                                b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                            }">
                                ${b.status}
                            </span>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm mb-4 border-t pt-4 mt-4">
                            <div>
                                <span class="text-slate-500">Date & Time</span>
                                <p class="font-semibold">${new Date(b.startTime).toLocaleDateString()} ${new Date(b.startTime).toLocaleTimeString()}</p>
                            </div>
                            <div>
                                <span class="text-slate-500">Duration</span>
                                <p class="font-semibold">${b.duration} hrs</p>
                            </div>
                            <div>
                                <span class="text-slate-500">Amount Paid</span>
                                <p class="font-semibold text-blue-600">₹${b.amount}</p>
                            </div>
                            <div>
                                <span class="text-slate-500">QR Code</span>
                                <p class="font-semibold text-xs text-slate-600">${b.qrCode}</p>
                            </div>
                        </div>
                        ${b.status !== 'cancelled' ? `
                            <button data-booking-id="${bookingId}" class="view-ticket-btn w-full bg-slate-800 text-white py-2 rounded-lg font-semibold hover:bg-slate-700 transition">
                                View Ticket
                            </button>
                        ` : `
                            <button disabled class="w-full bg-slate-300 text-slate-500 py-2 rounded-lg font-semibold cursor-not-allowed">
                                Cancelled Booking
                            </button>
                        `}
                    </div>
                `;
            }).join('');
        }

        container.innerHTML = `
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6">
                <div class="flex items-center gap-4">
                    <button id="backToHomeFromBookings" class="bg-slate-700/50 p-2 rounded-full hover:bg-slate-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="rotate-180"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                    <h1 class="text-2xl font-bold">My Bookings</h1>
                </div>
            </div>
            <div class="p-6 space-y-4">
                ${contentHTML}
            </div>
        `;

        // Event Listeners
        document.getElementById('backToHomeFromBookings')?.addEventListener('click', () => setView('home'));
        document.getElementById('bookingsFindParking')?.addEventListener('click', () => setView('home'));

        document.querySelectorAll('.view-ticket-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookingId = e.currentTarget.dataset.bookingId;
                const booking = bookings.find(b => (b._id || b.id) == bookingId);
                
                if (booking) {
                    setState({ booking });
                    setView('ticket');
                } else {
                    showError('Booking not found');
                }
            });
        });
    } catch (error) {
        console.error('Error rendering bookings view:', error);
        container.innerHTML = `
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6">
                <div class="flex items-center gap-4">
                    <button onclick="setView('home')" class="bg-slate-700/50 p-2 rounded-full hover:bg-slate-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="rotate-180"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                    <h1 class="text-2xl font-bold">My Bookings</h1>
                </div>
            </div>
            <div class="text-center py-12 p-6">
                <h3 class="text-xl font-semibold text-red-600 mb-2">Error Loading Bookings</h3>
                <p class="text-slate-400 mb-6">${error.message}</p>
                <button onclick="setView('home')" class="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition">
                    Back to Home
                </button>
            </div>
        `;
    }
}
