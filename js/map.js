/* SECOND SELF STUDIOS - Full-Screen Map with Landing + Sidebar */

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

  // Full-screen mode: map fills viewport below header
  const isFullScreen = document.body.classList.contains('page-map');

  // If not full-screen, size to aspect ratio
  if (!isFullScreen) {
    var ratio = config.width / config.height;
    var containerW = mapEl.offsetWidth;
    mapEl.style.height = Math.round(containerW / ratio) + 'px';
  }

  const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2, maxZoom: 3,
    zoomSnap: 0,
    zoomControl: false,
    attributionControl: false,
  });

  // Add zoom control to top-right to avoid sidebar overlap
  L.control.zoom({ position: 'topright' }).addTo(map);

  const bounds = [[0, 0], [config.height, config.width]];

  const img = new Image();
  img.onload = function () {
    L.imageOverlay(config.image, bounds).addTo(map);
    map.fitBounds(bounds, { padding: [0, 0] });
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [0, 0] });
    }, 100);

    // Don't place pins until user clicks explore (if landing exists)
    var landing = document.getElementById('map-landing');
    if (landing) {
      // Disable map interaction while landing is showing
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
    } else {
      placePins();
    }
  };
  img.onerror = function () { showFallback(); };
  img.src = config.image;

  // --- Landing overlay ---
  var exploreBtn = document.getElementById('explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function () {
      var landing = document.getElementById('map-landing');
      landing.classList.add('is-hidden');

      // Enable map interaction
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();

      placePins();

      // Remove landing from DOM after animation
      setTimeout(function () { landing.remove(); }, 600);
    });
  }

  // --- Sidebar ---
  var sidebar = document.getElementById('map-sidebar');
  var sidebarClose = document.getElementById('map-sidebar-close');

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }

  function openSidebar(loc) {
    if (!sidebar) return;
    var html = '';

    // Type
    html += '<p class="sidebar__type">' + loc.type + '</p>';

    // Name
    html += '<h2 class="sidebar__name">' + loc.name + '</h2>';

    // Tagline
    if (loc.tagline) {
      html += '<p class="sidebar__tagline">' + loc.tagline + '</p>';
    }

    // Description
    if (loc.description) {
      html += '<div class="sidebar__divider"></div>';
      html += '<p class="sidebar__desc">' + loc.description + '</p>';
    }

    // Facts
    if (loc.facts) {
      html += '<div class="sidebar__facts">';
      for (var key in loc.facts) {
        html += '<div class="sidebar__fact">';
        html += '<span class="sidebar__fact-label">' + key + '</span>';
        html += '<span class="sidebar__fact-value">' + loc.facts[key] + '</span>';
        html += '</div>';
      }
      html += '</div>';
    }

    // Characters
    if (loc.characters && loc.characters.length > 0) {
      html += '<div class="sidebar__divider"></div>';
      html += '<p class="sidebar__section-label">Characters</p>';
      loc.characters.forEach(function (c) {
        html += '<div class="sidebar__character">';
        html += '<div class="sidebar__character-initial">' + c.name.charAt(0) + '</div>';
        html += '<div>';
        html += '<p class="sidebar__character-name">' + c.name + '</p>';
        if (c.role) html += '<p class="sidebar__character-role">' + c.role + '</p>';
        html += '</div></div>';
      });
    }

    // Stories
    if (loc.stories && loc.stories.length > 0) {
      html += '<div class="sidebar__divider"></div>';
      html += '<p class="sidebar__section-label">Stories</p>';
      loc.stories.forEach(function (s) {
        if (s.url) {
          html += '<a href="' + s.url + '" class="sidebar__story">';
        } else {
          html += '<div class="sidebar__story">';
        }
        html += '<span class="sidebar__story-title">' + s.title + '</span>';
        if (s.time) html += '<span class="sidebar__story-time">' + s.time + '</span>';
        if (s.url) html += '</a>'; else html += '</div>';
      });
    }

    // Explore link
    if (loc.page) {
      html += '<div class="sidebar__divider"></div>';
      html += '<a href="' + loc.page + '" class="sidebar__explore">Explore ' + loc.name + ' &rarr;</a>';
    }

    document.getElementById('map-sidebar-content').innerHTML = html;
    sidebar.classList.add('is-open');
    setTimeout(function () { map.invalidateSize(); }, 350);
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('is-open');
    setTimeout(function () { map.invalidateSize(); }, 350);
  }

  // --- Pins ---
  function placePins() {
    var icons = {
      city: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--city">&#9688;</div>',
        iconSize: [24, 24], iconAnchor: [12, 12]
      }),
      region: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--region">&#9670;</div>',
        iconSize: [28, 28], iconAnchor: [14, 14]
      }),
      landmark: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--landmark">&#9650;</div>',
        iconSize: [20, 20], iconAnchor: [10, 10]
      }),
      ruin: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--ruin">&#10005;</div>',
        iconSize: [20, 20], iconAnchor: [10, 10]
      }),
      npc: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--npc">&#9679;</div>',
        iconSize: [18, 18], iconAnchor: [9, 9]
      }),
      shop: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--shop">&#9635;</div>',
        iconSize: [18, 18], iconAnchor: [9, 9]
      }),
      district: L.divIcon({
        className: 'map-pin',
        html: '<div class="map-pin--district">&#11044;</div>',
        iconSize: [22, 22], iconAnchor: [11, 11]
      }),
    };

    locations.forEach(function (loc) {
      if (!loc.coords) return;
      var icon = icons[loc.type] || icons.landmark;
      var marker = L.marker(loc.coords, { icon: icon }).addTo(map);

      marker.on('click', function (e) {
        L.DomEvent.stopPropagation(e);
        openSidebar(loc);
      });

      // Region name labels
      if (loc.type === 'region') {
        var label = L.divIcon({
          className: 'map-label',
          html: '<span class="map-label--region">' + loc.name + '</span>',
          iconSize: [120, 20],
          iconAnchor: [60, -16],
        });
        L.marker(loc.coords, { icon: label, interactive: false }).addTo(map);
      }
    });
  }

  // Close sidebar on empty map click
  map.on('click', function () {
    if (sidebar && sidebar.classList.contains('is-open')) {
      closeSidebar();
    }
  });

  // Resize handler
  window.addEventListener('resize', function () {
    if (!isFullScreen) {
      var r = config.width / config.height;
      var w = mapEl.offsetWidth;
      mapEl.style.height = Math.round(w / r) + 'px';
    }
    map.invalidateSize();
  });

  function showFallback() {
    mapEl.innerHTML = '';
    mapEl.classList.add('map-fallback');
    mapEl.innerHTML =
      '<div class="map-fallback__content">' +
      '<p class="map-fallback__icon">&#9678;</p>' +
      '<h2 class="map-fallback__title">The World Map</h2>' +
      '<p class="map-fallback__desc">An interactive map is being drawn.</p>' +
      '<div class="map-fallback__links">' +
      '<a href="/pages/locations/">Browse Locations</a>' +
      '<span class="map-fallback__sep">&middot;</span>' +
      '<a href="/pages/stories/">Read Stories</a>' +
      '</div></div>';
  }
});