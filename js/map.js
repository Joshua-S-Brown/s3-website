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
    zoomControl: true,
    attributionControl: false,
  });

  const bounds = [[0, 0], [config.height, config.width]];
  console.log('Bounds:', bounds);

  const img = new Image();
  img.onload = function () {
    L.imageOverlay(config.image, bounds).addTo(map);
    map.fitBounds(bounds);
    placePins();
  };
  img.onerror = function () { showFallback(); };
  img.src = config.image;

  function placePins() {
    const icons = {
      city:     L.divIcon({className:'map-pin map-pin--city',     iconSize:[12,12], iconAnchor:[6,6],  popupAnchor:[0,-10]}),
      region:   L.divIcon({className:'map-pin map-pin--region',   iconSize:[16,16], iconAnchor:[8,8],  popupAnchor:[0,-12]}),
      landmark: L.divIcon({className:'map-pin map-pin--landmark', iconSize:[10,10], iconAnchor:[5,5],  popupAnchor:[0,-8]}),
      ruin:     L.divIcon({className:'map-pin map-pin--ruin',     iconSize:[10,10], iconAnchor:[5,5],  popupAnchor:[0,-8]}),
      npc:      L.divIcon({className:'map-pin map-pin--npc',      iconSize:[10,10], iconAnchor:[5,5],  popupAnchor:[0,-8]}),
      shop:     L.divIcon({className:'map-pin map-pin--shop',     iconSize:[10,10], iconAnchor:[5,5],  popupAnchor:[0,-8]}),
      district: L.divIcon({className:'map-pin map-pin--district', iconSize:[14,14], iconAnchor:[7,7],  popupAnchor:[0,-12]}),
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