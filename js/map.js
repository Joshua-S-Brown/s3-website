document.addEventListener('DOMContentLoaded', async () => {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  let locations = [];
  try {
    const resp = await fetch('/data/locations.json');
    locations = await resp.json();
  } catch (e) { console.warn('Could not load locations.json:', e); }

  const mapW = 4096, mapH = 4096;
  const map = L.map('map', {
    crs: L.CRS.Simple, minZoom: -2, maxZoom: 2,
    zoomControl: true, attributionControl: false,
  });
  const bounds = [[0, 0], [mapH, mapW]];

  // OPTION A: Simple image overlay (use until you have tiles)
  // Drop your map image at /assets/images/world-map.jpg
  L.imageOverlay('/assets/images/world-map.jpg', bounds).addTo(map);
  map.fitBounds(bounds);

  // OPTION B: Tiled map (uncomment when ready, comment out Option A)
  // L.tileLayer('/assets/map-tiles/{z}/{x}/{y}.png', {
  //   minZoom: -2, maxZoom: 4, noWrap: true, bounds: bounds,
  // }).addTo(map);

  const icons = {
    city:     L.divIcon({ className: 'map-pin map-pin--city',     iconSize: [12,12], iconAnchor: [6,6],  popupAnchor: [0,-10] }),
    region:   L.divIcon({ className: 'map-pin map-pin--region',   iconSize: [14,14], iconAnchor: [7,7],  popupAnchor: [0,-12] }),
    landmark: L.divIcon({ className: 'map-pin map-pin--landmark', iconSize: [10,10], iconAnchor: [5,5],  popupAnchor: [0,-8]  }),
    ruin:     L.divIcon({ className: 'map-pin map-pin--ruin',     iconSize: [10,10], iconAnchor: [5,5],  popupAnchor: [0,-8]  }),
  };

  locations.forEach(loc => {
    if (!loc.coords) return;
    const icon = icons[loc.type] || icons.landmark;
    const marker = L.marker(loc.coords, { icon }).addTo(map);
    let html = '<div class="map-popup"><strong>' + loc.name + '</strong>';
    if (loc.tagline) html += '<br><span class="map-popup__tagline">' + loc.tagline + '</span>';
    if (loc.page) html += '<br><a href="' + loc.page + '">Explore &rarr;</a>';
    html += '</div>';
    marker.bindPopup(html);
  });

  const s = document.createElement('style');
  s.textContent = `
    .map-pin { border-radius: 50%; box-shadow: 0 0 8px rgba(201,168,76,0.3); transition: transform 0.2s, box-shadow 0.2s; }
    .map-pin:hover { transform: scale(1.5); box-shadow: 0 0 16px rgba(201,168,76,0.6); }
    .map-pin--city { background: #FF6B6B; }
    .map-pin--region { background: #C9A84C; }
    .map-pin--landmark { background: #808080; }
    .map-pin--ruin { background: #808080; border-radius: 2px; }
    .map-popup { font-family: 'Source Sans 3', sans-serif; font-size: 13px; color: #C5C0B8; }
    .map-popup strong { color: #EDEBE8; font-family: 'Cormorant Garamond', serif; font-size: 15px; }
    .map-popup__tagline { color: #808080; font-size: 11px; font-style: italic; }
    .map-popup a { color: #4ECDC4; font-size: 12px; }
    .leaflet-popup-content-wrapper { background: #1C1C1C; border: 1px solid #2C2C2C; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.5); }
    .leaflet-popup-tip { background: #1C1C1C; }
  `;
  document.head.appendChild(s);
});
