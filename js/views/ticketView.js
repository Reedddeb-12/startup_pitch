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

    const parkingLot = booking.parkingLot || {};
    const duration = booking.duration || 0;
    const amount = booking.amount || 0;
    const startTime = new Date(booking.startTime);
    const date = startTime.toLocaleDateString();
    const time = startTime.toLocaleTimeString();
    const qrCode = booking.qrCode || 'N/A';
    const status = booking.status || 'pending';

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
                        <span class="font-semibold text-right text-slate-800">${parkingLot.name || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600">Location</span>
                        <span class="font-semibold text-right text-slate-800">${parkingLot.address || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600">Duration</span>
                        <span class="font-semibold">${duration} hour${duration !== 1 ? 's' : ''}</span>
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
                        <span class="font-semibold text-blue-600 text-xs break-words">${qrCode}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600">Status</span>
                        <span class="font-semibold capitalize px-2 py-1 rounded text-xs ${
                            status === 'completed' ? 'bg-green-100 text-green-700' :
                            status === 'active' ? 'bg-blue-100 text-blue-700' :
                            status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }">
                            ${status}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="p-6 space-y-3 bg-white">
                <button id="ticketBackHome" class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition active:scale-95">
                    Back to Home
                </button>
                <button id="ticketViewBookings" class="w-full bg-slate-200 text-slate-800 py-3 rounded-xl font-semibold hover:bg-slate-300 transition active:scale-95">
                    View My Bookings
                </button>
                <button id="ticketDownload" class="w-full bg-gray-100 text-gray-800 py-2 rounded-xl font-semibold hover:bg-gray-200 transition text-sm active:scale-95">
                    📥 Download Ticket
                </button>
            </div>
        </div>
    `;

    // Event Listeners
    document.getElementById('ticketBackHome').addEventListener('click', () => setView('home'));
    document.getElementById('ticketViewBookings').addEventListener('click', () => setView('bookings'));
    
    document.getElementById('ticketDownload').addEventListener('click', () => {
        downloadTicket(booking);
    });
}

/**
 * Download ticket as image
 */
function downloadTicket(booking) {
    const parkingLot = booking.parkingLot || {};
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 400;
    canvas.height = 600;
    
    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(0, 0, canvas.width, 100);
    
    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ParkEase Booking', canvas.width / 2, 40);
    ctx.font = '14px Arial';
    ctx.fillText('Confirmation Ticket', canvas.width / 2, 65);
    
    // Details
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    let y = 130;
    
    const details = [
        `Parking Lot: ${parkingLot.name || 'N/A'}`,
        `Location: ${parkingLot.address || 'N/A'}`,
        `Duration: ${booking.duration} hours`,
        `Amount: ₹${booking.amount}`,
        `QR Code: ${booking.qrCode || 'N/A'}`,
        `Status: ${booking.status}`
    ];
    
    details.forEach(detail => {
        ctx.fillText(detail, 20, y);
        y += 40;
    });
    
    // Download
    canvas.toBlob(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `parkease-ticket-${booking.qrCode}.png`;
        a.click();
    });
}
