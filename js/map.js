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
/* SECOND SELF STUDIOS - Reusable Map System
   Usage: <div id="map" data-image="..." data-pins="..." data-width="4096" data-height="4096"></div>
   All attributes optional. Defaults to world-map.jpg + locations.json. */

document.addEventListener('DOMContentLoaded', async () => {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;
  const config = {
    image:  mapEl.dataset.image  || '/assets/images/world-map.jpg',
    pins:   mapEl.dataset.pins   || '/data/locations.json',
    width:  parseInt(mapEl.dataset.width)  || 4096,
    height: parseInt(mapEl.dataset.height) || 4096,
  };
  let locations = [];
  try { const r = await fetch(config.pins); locations = await r.json(); }
  catch (e) { console.warn('No pins:', e); }
  const map = L.map('map', { crs: L.CRS.Simple, minZoom:-2, maxZoom:3, zoomControl:true, attributionControl:false });
  const bounds = [[0,0],[config.height,config.width]];
  const img = new Image();
  img.onload = function(){ L.imageOverlay(config.image, bounds).addTo(map); map.fitBounds(bounds); placePins(); };
  img.onerror = function(){ showFallback(); };
  img.src = config.image;

  function placePins(){
    const icons = {
      city:     L.divIcon({className:'map-pin map-pin--city',     iconSize:[12,12],iconAnchor:[6,6],  popupAnchor:[0,-10]}),
      region:   L.divIcon({className:'map-pin map-pin--region',   iconSize:[16,16],iconAnchor:[8,8],  popupAnchor:[0,-12]}),
      landmark: L.divIcon({className:'map-pin map-pin--landmark', iconSize:[10,10],iconAnchor:[5,5],  popupAnchor:[0,-8]}),
      ruin:     L.divIcon({className:'map-pin map-pin--ruin',     iconSize:[10,10],iconAnchor:[5,5],  popupAnchor:[0,-8]}),
      npc:      L.divIcon({className:'map-pin map-pin--npc',      iconSize:[10,10],iconAnchor:[5,5],  popupAnchor:[0,-8]}),
      shop:     L.divIcon({className:'map-pin map-pin--shop',     iconSize:[10,10],iconAnchor:[5,5],  popupAnchor:[0,-8]}),
      district: L.divIcon({className:'map-pin map-pin--district', iconSize:[14,14],iconAnchor:[7,7],  popupAnchor:[0,-12]}),
    };
    locations.forEach(loc => {
      if (!loc.coords) return;
      const icon = icons[loc.type] || icons.landmark;
      const marker = L.marker(loc.coords, {icon}).addTo(map);
      let html = '<div class="map-popup"><strong>'+loc.name+'</strong>';
      if (loc.tagline) html += '<br><span class="map-popup__tagline">'+loc.tagline+'</span>';
      if (loc.page) html += '<br><a href="'+loc.page+'">Explore &rarr;</a>';
      html += '</div>';
      marker.bindPopup(html);
    });
  }

  function showFallback(){
    mapEl.innerHTML='';
    mapEl.classList.add('map-fallback');
    mapEl.innerHTML='<div class="map-fallback__content"><p class="map-fallback__icon">\u25CE</p><h2 class="map-fallback__title">The World Map</h2><p class="map-fallback__desc">An interactive map is being drawn. When it arrives, every city, ruin, and landmark will be explorable from here.</p><div class="map-fallback__links"><a href="/pages/locations/">Browse Locations</a><span class="map-fallback__sep">\u00b7</span><a href="/pages/stories/">Read Stories</a></div></div>';
  }
});