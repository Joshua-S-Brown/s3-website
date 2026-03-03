document.addEventListener('DOMContentLoaded', async () => {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  const config = {
    image:  mapEl.dataset.image  || '/assets/images/world-map.jpg',
    pins:   mapEl.dataset.pins   || '/data/locations.json',
    width:  parseInt(mapEl.dataset.width)  || 4096,
    height: parseInt(mapEl.dataset.height) || 4096,
  };

  console.log('Map config:', config);

  let locations = [];
  try { const r = await fetch(config.pins); locations = await r.json(); }
  catch (e) { console.warn('No pins:', e); }

  const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 3,
    zoomSnap: 0,
    zoomControl: true,
    attributionControl: false,
  });

  const bounds = [[0, 0], [config.height, config.width]];
  console.log('Bounds:', bounds);

  const img = new Image();
  img.onload = function () {
    L.imageOverlay(config.image, bounds).addTo(map);
    
    // Calculate zoom to fill width of container
    var containerWidth = mapEl.offsetWidth;
    var zoom = map.getBoundsZoom(bounds, false);
    map.setView([config.height / 2, config.width / 2], zoom);
    
    setTimeout(() => {
      map.invalidateSize();
      var z = map.getBoundsZoom(bounds, false);
      map.setView([config.height / 2, config.width / 2], z);
    }, 100);
    
    placePins();
  };
  img.onerror = function () { showFallback(); };
  img.src = config.image;

  function placePins() {
   const icons = {
      city: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--city">&#9688;</div>',
        iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -14]
      }),
      region: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--region">&#9670;</div>',
        iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16]
      }),
      landmark: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--landmark">&#9650;</div>',
        iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -12]
      }),
      ruin: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--ruin">&#10005;</div>',
        iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -12]
      }),
      npc: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--npc">&#9679;</div>',
        iconSize: [18, 18], iconAnchor: [9, 9], popupAnchor: [0, -12]
      }),
      shop: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--shop">&#9635;</div>',
        iconSize: [18, 18], iconAnchor: [9, 9], popupAnchor: [0, -12]
      }),
      district: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--district">&#11044;</div>',
        iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -14]
      }),
    };
    locations.forEach(loc => {
      if (!loc.coords) return;
      const icon = icons[loc.type] || icons.landmark;
      const marker = L.marker(loc.coords, {icon}).addTo(map);
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
});