/**
 * ParkEase - Home View
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
        lotsHTML = `
            <div class="text-center py-12">
                ${ICONS.BigCar}
                <h3 class="text-xl font-semibold text-slate-600 mb-2">No Parking Lots Found</h3>
                <p class="text-slate-400">Admin needs to add parking lots to get started.</p>
            </div>
        `;
    } else {
        lotsHTML = filteredLots.map(lot => `
            <div data-lot-id="${lot.id}" class="lot-card bg-white rounded-2xl p-5 shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-bold text-lg text-slate-800">${lot.name}</h3>
                        <div class="flex items-center gap-1 text-slate-500 text-sm mt-1">
                            ${ICONS.MapPin}
                            <span>${lot.address}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 text-amber-500">
                        ${ICONS.Star}
                        <span class="text-sm font-bold">${lot.rating}</span>
                    </div>
                </div>
                <div class="flex items-end justify-between mb-4">
                    <div class="flex items-center gap-4 text-sm">
                        <div class="flex items-center gap-2">
                            ${ICONS.Navigation}
                            <span class="text-slate-600">${lot.distance}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            ${ICONS.Car}
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
                    ${ICONS.Menu}
                </button>
            </div>
        </div>
        <div class="px-6 -mt-16 space-y-4">
            <div class="relative mb-6">
                ${ICONS.Search}
                <input type="text" id="searchInput" placeholder="Search by name or address..." value="${searchQuery}" class="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-800 focus:outline-none shadow-xl border" />
            </div>
            <div id="lotsList">${lotsHTML}</div>
        </div>
        <div id="menuDropdown" style="display: none;" class="fixed top-24 right-6 bg-white rounded-xl shadow-xl p-2 z-40 w-52">
            <button data-view="bookings" class="menu-item w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg flex items-center gap-3">
                ${ICONS.Clock}
                <span>My Bookings</span>
            </button>
            <button data-view="profile" class="menu-item w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg flex items-center gap-3">
                ${ICONS.User}
                <span>Profile</span>
            </button>
            <button id="logoutButton" class="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 rounded-lg flex items-center gap-3">
                ${ICONS.Logout}
                <span>Logout</span>
            </button>
        </div>
    `;

    // Event Listeners
    document.getElementById('searchInput').addEventListener('input', (e) => {
        setState({ searchQuery: e.target.value });
        render();
    });

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