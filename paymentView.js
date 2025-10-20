/**
 * ParkEase - Payment View
 * Renders the payment confirmation page
 */

function renderPaymentView() {
    const container = document.getElementById('paymentView');
    const booking = getStateProperty('booking');

    if (!booking) {
        setView('home');
        return;
    }

    const { lot, duration, amount, date, time } = booking;

    container.innerHTML = `
        <div class="bg-slate-800 text-white p-6">
            <button id="backToDetails" class="mb-4">
                ${ICONS.Back}
            </button>
            <h1 class="text-2xl font-bold text-center">Confirm Payment</h1>
        </div>
        <div class="p-6 space-y-4">
            <!-- Booking Summary -->
            <div class="bg-white rounded-2xl p-5 shadow-lg">
                <h2 class="font-bold text-lg mb-3">Booking Summary</h2>
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-slate-500">Parking Lot</span>
                        <span class="font-semibold text-slate-800">${lot.name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">Location</span>
                        <span class="font-semibold text-slate-800">${lot.address}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">Duration</span>
                        <span class="font-semibold text-slate-800">${duration} hour${duration > 1 ? 's' : ''}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">Price per Hour</span>
                        <span class="font-semibold text-slate-800">₹${lot.pricePerHour}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">Date & Time</span>
                        <span class="font-semibold text-slate-800">${date} ${time}</span>
                    </div>
                    <div class="border-t pt-4 mt-4 flex justify-between items-center">
                        <span class="font-bold text-base">Total Amount</span>
                        <span class="font-bold text-blue-600 text-3xl">₹${amount}</span>
                    </div>
                </div>
            </div>

            <!-- Payment Info -->
            <p class="text-sm text-slate-500 mt-4 text-center">
                You will be redirected to Razorpay for a secure payment.
            </p>

            <!-- Payment Button -->
            <button id="payButton" class="w-full bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition shadow-lg">
                Pay Securely ₹${amount}
            </button>

            <!-- Additional Info -->
            <div class="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 border border-blue-200">
                <p>After payment, you will receive a booking ticket with your parking details and QR code.</p>
            </div>
        </div>
    `;

    // Event Listeners
    document.getElementById('backToDetails').addEventListener('click', () => setView('details'));
    document.getElementById('payButton').addEventListener('click', handlePayment);
}