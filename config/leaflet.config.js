/**
 * ParkEase - Leaflet Map Configuration
 * Map display and marker setup
 */

const LEAFLET_CONFIG = {
    // Tile Layer
    TILE_LAYER_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    
    // Default Map Settings
    DEFAULT_ZOOM: 15,
    MIN_ZOOM: 10,
    MAX_ZOOM: 19,
    
    // Default Center (Kolkata coordinates)
    DEFAULT_CENTER: {
        lat: 22.5726,
        lng: 88.3639
    },
    
    // Marker Settings
    MARKER_COLOR: '#3B82F6',
    MARKER_PREFIX: 'fa',
    MARKER_ICON: 'fa-car',
    MARKER_ICON_COLOR: 'white'
};

/**
 * Initialize map with default settings
 */
function initMap(containerId, lat = null, lng = null, zoom = null) {
    const center = {
        lat: lat || LEAFLET_CONFIG.DEFAULT_CENTER.lat,
        lng: lng || LEAFLET_CONFIG.DEFAULT_CENTER.lng
    };

    const zoomLevel = zoom || LEAFLET_CONFIG.DEFAULT_ZOOM;

    const map = L.map(containerId).setView([center.lat, center.lng], zoomLevel);

    // Add tile layer
    L.tileLayer(LEAFLET_CONFIG.TILE_LAYER_URL, {
        attribution: LEAFLET_CONFIG.ATTRIBUTION,
        minZoom: LEAFLET_CONFIG.MIN_ZOOM,
        maxZoom: LEAFLET_CONFIG.MAX_ZOOM
    }).addTo(map);

    return map;
}

/**
 * Add marker to map
 */
function addMarker(map, lat, lng, title, popupText) {
    const marker = L.marker([lat, lng], {
        title: title
    }).addTo(map);

    if (popupText) {
        marker.bindPopup(popupText);
    }

    return marker;
}

/**
 * Add multiple markers to map
 */
function addMultipleMarkers(map, locations) {
    const markers = [];

    locations.forEach(location => {
        const marker = addMarker(
            map,
            location.lat,
            location.lng,
            location.title,
            location.popup
        );
        markers.push(marker);
    });

    return markers;
}

/**
 * Fit map to bounds
 */
function fitMapToBounds(map, markers) {
    if (markers.length === 0) return;

    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
}
