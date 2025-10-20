/**
 * ParkEase - Ticket View
 * Renders the booking confirmation ticket
 */

function renderTicketView() {
    const container = document.getElementById('ticketView');
    const booking = getStateProperty('booking');

    if (!booking) {
        setView('home');
        return;
    }

    const { lot, duration, amount, date, time, qrCode, status } = booking;

    container.innerHTML = `
        <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <!-- Success Header -->
            <div class="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50">
                <div class="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    ${ICONS.Checkmark}
                </div>
                <h2 class="text-3xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
                <p class="text-slate-500">Your parking is reserved.</p>
            </div>

            <!-- Booking Details -->
            <div class="bg-slate-50 p-6 border-t-2 border-b-2 border-dashed border-slate-200">
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-slate-600">Parking Lot</span>
                        <span class="font-semibold text-right text-slate-800">${lot.name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600">Location</span>
                        <span class="font-semibold text-right text-slate-800">${lot.address}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600">Duration</span>
                        <span class="font-semibold">${duration} hour${duration > 1 ? 's' : ''}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600">Date & Time</span>
                        <span class="font-semibold">${date} ${time}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600">Amount Paid</span>
                        <span class="font-semibold text-green-600">₹${amount}</span>
                    </div>
                    <div class="flex justify-between pt-2 border-t">
                        <span class="text-slate-600">QR Code</span>
                        <span class="font-semibold text-blue-600 text-xs">${qrCode}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600">Status</span>
                        <span class="font-semibold capitalize px-2 py-1 rounded text-xs ${status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">
                            ${status}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="p-6 space-y-3 bg-white">
                <button id="ticketBackHome" class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition">
                    Back to Home
                </button>
                <button id="ticketViewBookings" class="w-full bg-slate-200 text-slate-800 py-3 rounded-xl font-semibold hover:bg-slate-300 transition">
                    View My Bookings
                </button>
            </div>
        </div>
    `;

    // Event Listeners
    document.getElementById('ticketBackHome').addEventListener('click', () => setView('home'));
    document.getElementById('ticketViewBookings').addEventListener('click', () => setView('bookings'));
}