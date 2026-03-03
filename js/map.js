/* ============================================
   SECOND SELF STUDIOS - Interactive World Map

   HOW TO ADD YOUR MAP:

   STEP 1: Draw or export your map
     - Any image editor (Photoshop, Clip Studio, Procreate)
     - Save as large JPG or PNG (4096x4096+ ideal)

   STEP 2: Simple approach (no tiling)
     - Save map as /assets/images/world-map.jpg
     - This code loads it automatically
     - Works for images up to ~8000x8000px

   STEP 3: Tiled approach (huge maps with deep zoom)
     - Download MapTiler Desktop (free): maptiler.com/desktop
     - Open map, choose "Custom" coordinate system
     - Export as "Folder of tiles"
     - Copy into /assets/map-tiles/
     - Comment out OPTION A below, uncomment OPTION B

   ADDING PINS:
     - Open /data/locations.json, add entry:
       { "id":"x", "name":"X", "type":"city",
         "tagline":"...", "coords":[2000,1500],
         "page":"/pages/locations/x.html" }
     - type: city, region, landmark, or ruin
     - coords: [y, x] pixels from top-left of map image
     - Find coords: hover in image editor, read position
     - NOTE: Leaflet uses [y, x] not [x, y]
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  let locations = [];
  try {
    const resp = await fetch('/data/locations.json');
    locations = await resp.json();
  } catch (e) { console.warn('Could not load locations.json:', e); }

  // Change these to match your map image size
  const mapW = 4096, mapH = 4096;

  const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2, maxZoom: 2,
    zoomControl: true, attributionControl: false,
  });

  const bounds = [[0, 0], [mapH, mapW]];

  // Try loading map image; show fallback if missing
  const img = new Image();
  img.onload = function() {
    L.imageOverlay('/assets/images/world-map.jpg', bounds).addTo(map);
    map.fitBounds(bounds);
    placePins();
  };
  img.onerror = function() { showFallback(); };
  img.src = '/assets/images/world-map.jpg';

  // OPTION B: Tiled (uncomment when ready, comment out img load above)
  // L.tileLayer('/assets/map-tiles/{z}/{x}/{y}.png', {
  //   minZoom: -2, maxZoom: 4, noWrap: true, bounds: bounds,
  // }).addTo(map);
  // map.fitBounds(bounds);
  // placePins();

  function placePins() {
    const icons = {
      city:     L.divIcon({ className:'map-pin map-pin--city',     iconSize:[12,12], iconAnchor:[6,6],  popupAnchor:[0,-10] }),
      region:   L.divIcon({ className:'map-pin map-pin--region',   iconSize:[14,14], iconAnchor:[7,7],  popupAnchor:[0,-12] }),
      landmark: L.divIcon({ className:'map-pin map-pin--landmark', iconSize:[10,10], iconAnchor:[5,5],  popupAnchor:[0,-8]  }),
      ruin:     L.divIcon({ className:'map-pin map-pin--ruin',     iconSize:[10,10], iconAnchor:[5,5],  popupAnchor:[0,-8]  }),
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
  }

  function showFallback() {
    mapEl.innerHTML = '';
    mapEl.classList.add('map-fallback');
    mapEl.innerHTML =
      '<div class="map-fallback__content">' +
      '<p class="map-fallback__icon">\u25CE</p>' +
      '<h2 class="map-fallback__title">The World Map</h2>' +
      '<p class="map-fallback__desc">An interactive map is being drawn. When it arrives, every city, ruin, and landmark will be explorable from here.</p>' +
      '<div class="map-fallback__links">' +
      '<a href="/pages/locations/">Browse Locations</a>' +
      '<span class="map-fallback__sep">\u00b7</span>' +
      '<a href="/pages/stories/">Read Stories</a>' +
      '</div></div>';
  }

  // Map-specific styles
  const s = document.createElement('style');
  s.textContent =
    '.map-pin{border-radius:50%;box-shadow:0 0 8px rgba(201,168,76,0.3);transition:transform 0.2s,box-shadow 0.2s}' +
    '.map-pin:hover{transform:scale(1.5);box-shadow:0 0 16px rgba(201,168,76,0.6)}' +
    '.map-pin--city{background:#FF6B6B}.map-pin--region{background:#C9A84C}' +
    '.map-pin--landmark{background:#808080}.map-pin--ruin{background:#808080;border-radius:2px}' +
    '.map-popup{font-family:"Source Sans 3",sans-serif;font-size:13px;color:#C5C0B8}' +
    '.map-popup strong{color:#EDEBE8;font-family:"Cormorant Garamond",serif;font-size:15px}' +
    '.map-popup__tagline{color:#808080;font-size:11px;font-style:italic}' +
    '.map-popup a{color:#4ECDC4;font-size:12px}' +
    '.leaflet-popup-content-wrapper{background:#1C1C1C;border:1px solid #2C2C2C;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.5)}' +
    '.leaflet-popup-tip{background:#1C1C1C}';
  document.head.appendChild(s);
});
