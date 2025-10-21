/**
 * ParkEase - Bookings View
 * Renders user's booking history
 */

async function renderBookingsView() {
    const container = document.getElementById('bookingsView');
    
    try {
        // Fetch bookings from API
        const response = await window.API.booking.getAll();
        const bookings = response.success ? response.data : [];

        let contentHTML = '';

        if (bookings.length === 0) {
            contentHTML = `
                <div class="text-center py-12">
                    ${ICONS.BigCar}
                    <h3 class="text-xl font-semibold text-slate-600 mb-2">No Bookings Yet</h3>
                    <p class="text-slate-400 mb-6">Your booked parking spots will appear here.</p>
                    <button id="bookingsFindParking" class="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition">
                        Find Parking
                    </button>
                </div>
            `;
        } else {
            contentHTML = bookings.map(b => `
                <div class="bg-white rounded-2xl p-5 shadow-lg">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="font-bold text-lg text-slate-800">${b.parkingLot?.name || 'Parking Lot'}</h3>
                            <p class="text-sm text-slate-500">${b.parkingLot?.address || 'Address not available'}</p>
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
                        <button data-booking-id="${b._id}" class="view-ticket-btn w-full bg-slate-800 text-white py-2 rounded-lg font-semibold hover:bg-slate-700 transition">
                            View Ticket
                        </button>
                    ` : `
                        <button disabled class="w-full bg-slate-300 text-slate-500 py-2 rounded-lg font-semibold cursor-not-allowed">
                            Cancelled Booking
                        </button>
                    `}
                </div>
            `).join('');
        }

        container.innerHTML = `
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6">
                <div class="flex items-center gap-4">
                    <button id="backToHomeFromBookings" class="bg-slate-700/50 p-2 rounded-full hover:bg-slate-600 transition">
                        ${ICONS.Back}
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
            btn.addEventListener('click', async (e) => {
                const bookingId = e.currentTarget.dataset.bookingId;
                try {
                    const bookingResponse = await window.API.booking.getById(bookingId);
                    if (bookingResponse.success) {
                        setState({ booking: bookingResponse.data });
                        setView('ticket');
                    }
                } catch (error) {
                    console.error('Error fetching booking:', error);
                    showError('Failed to load booking details');
                }
            });
        });
    } catch (error) {
        console.error('Error rendering bookings view:', error);
        container.innerHTML = `
            <div class="text-center py-12">
                <h3 class="text-xl font-semibold text-red-600 mb-2">Error Loading Bookings</h3>
                <p class="text-slate-400 mb-6">${error.message}</p>
                <button onclick="setView('home')" class="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition">
                    Back to Home
                </button>
            </div>
        `;
    }
}
