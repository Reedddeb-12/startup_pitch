/**
 * ParkEase - Details View
 * Renders parking lot details with booking options
 */

function renderDetailsView() {
    const container = document.getElementById('detailsView');
    const lot = getStateProperty('selectedLot');

    if (!lot) {
        setView('home');
        return;
    }

    let duration = 2;
    let totalAmount = lot.pricePerHour * duration;

    container.innerHTML = `
        <div class="p-6 bg-slate-800 text-white rounded-b-3xl">
            <button id="backToHome" class="mb-4 bg-slate-700/50 p-2 rounded-full">
                ${ICONS.Back}
            </button>
        </div>
        <div class="p-6 -mt-16 space-y-4">
            <!-- Lot Information Card -->
            <div class="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg">
                <h1 class="text-2xl font-bold text-slate-800">${lot.name}</h1>
                <p class="text-slate-500">${lot.address}</p>
                <div id="mapContainer" style="height: 250px; width: 100%; border-radius: 1rem; z-index: 0; margin-top: 1rem;"></div>
                <div class="flex justify-between items-center mt-4 border-t border-slate-200 pt-4">
                    <div class="text-center">
                        <p class="font-bold text-lg">${lot.rating}</p>
                        <p class="text-sm text-slate-500">Rating</p>
                    </div>
                    <div class="text-center">
                        <p class="font-bold text-lg">${lot.distance}</p>
                        <p class="text-sm text-slate-500">Distance</p>
                    </div>
                    <div class="text-center">
                        <p class="font-bold text-lg">₹${lot.pricePerHour}<span class="font-normal text-sm">/hr</span></p>
                        <p class="text-sm text-slate-500">Price</p>
                    </div>
                </div>
            </div>

            <!-- Duration Selector -->
            <div class="bg-white rounded-2xl p-5 shadow-lg">
                <h2 class="font-bold text-lg mb-3">Select Duration</h2>
                <input type="range" id="durationSlider" min="1" max="12" value="2" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                <div class="flex justify-between items-center mt-2">
                    <span id="durationLabel" class="text-lg text-slate-600 font-semibold">2 hours</span>
                    <span id="totalAmountLabel" class="text-3xl font-bold text-blue-600">₹${totalAmount}</span>
                </div>
            </div>

            <!-- Amenities -->
            ${lot.amenities && lot.amenities.length > 0 ? `
                <div class="bg-white rounded-2xl p-5 shadow-lg">
                    <h2 class="font-bold text-lg mb-3">Amenities</h2>
                    <div class="flex gap-2 flex-wrap">
                        ${lot.amenities.map(a => `<span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">${a}</span>`).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Book Now Button -->
            <button id="bookNowButton" class="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:scale-105 transition shadow-lg">
                Book Now for ₹${totalAmount}
            </button>
        </div>
    `;

    // Initialize map
    clearMapInstance();
    const mapInstance = L.map('mapContainer').setView([lot.lat, lot.lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);
    L.marker([lot.lat, lot.lon]).addTo(mapInstance).bindPopup('Parking Location').openPopup();
    setMapInstance(mapInstance);

    // Event Listeners
    document.getElementById('backToHome').addEventListener('click', () => setView('home'));

    const durationSlider = document.getElementById('durationSlider');
    durationSlider.addEventListener('input', (e) => {
        duration = parseInt(e.target.value, 10);
        totalAmount = lot.pricePerHour * duration;
        document.getElementById('durationLabel').innerText = `${duration} hour${duration > 1 ? 's' : ''}`;
        document.getElementById('totalAmountLabel').innerText = `₹${totalAmount}`;
        document.getElementById('bookNowButton').innerText = `Book Now for ₹${totalAmount}`;
    });

    document.getElementById('bookNowButton').addEventListener('click', () => {
        const validation = validateBooking(lot, duration);
        if (!validation.isValid) {
            showError(validation.errors.join(', '));
            return;
        }

        // Create booking
        createBooking(lot, duration);
        setView('payment');
    });
}