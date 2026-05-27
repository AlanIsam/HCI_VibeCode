'use strict';

function initNavSelectMap() {
  if (navMap) { setTimeout(() => navMap.invalidateSize(), 100); return; }
  const el = document.getElementById('nav-map');
  if (!el) return;
  navMap = L.map('nav-map', { zoomControl: true, attributionControl: false }).setView(KUCHING, 13);
  L.tileLayer(DARK_TILES, TILE_OPTS).addTo(navMap);
  L.marker(KUCHING, { icon: mkCarMarker() }).addTo(navMap).bindPopup('<b>You are here</b>');
  NAV_LOCATIONS.forEach(loc => {
    L.marker(loc.pos, { icon: mkMarker('#00d4ff') }).addTo(navMap)
      .bindPopup(`<b>${loc.name}</b><br>${loc.dist} · ${loc.eta}`);
  });
  setTimeout(() => navMap.invalidateSize(), 120);
}

function initNavActiveMap(locationIdx) {
  const el = document.getElementById('nav-active-map');
  if (!el) return;
  const loc = NAV_LOCATIONS[locationIdx];
  if (navActiveMap) { navActiveMap.remove(); navActiveMap = null; }
  navActiveMap = L.map('nav-active-map', { zoomControl: false, attributionControl: false }).setView(KUCHING, 14);
  L.tileLayer(DARK_TILES, TILE_OPTS).addTo(navActiveMap);
  L.marker(KUCHING, { icon: mkCarMarker() }).addTo(navActiveMap).bindPopup('<b>Your position</b>');
  L.marker(loc.pos, { icon: mkMarker('#ff5252', 16) }).addTo(navActiveMap).bindPopup(`<b>${loc.name}</b>`);
  L.polyline([KUCHING, loc.pos], { color: '#00d4ff', weight: 4, opacity: 0.85, dashArray: '8 4' }).addTo(navActiveMap);
  setTimeout(() => navActiveMap.invalidateSize(), 120);
}

function selectNavLocation(idx) {
  selectedLocation = idx;
  document.querySelectorAll('#nav-view-select .location-item').forEach((el, i) => el.classList.toggle('active', i === idx));
  if (navMap) navMap.setView(NAV_LOCATIONS[idx].pos, 15, { animate: true });
  const startBtn = document.getElementById('nav-start-btn');
  if (startBtn) { startBtn.disabled = false; startBtn.textContent = `Navigate to ${NAV_LOCATIONS[idx].name}`; }
}

function startNavigation() {
  if (selectedLocation === null) return;
  const loc = NAV_LOCATIONS[selectedLocation];
  const selectView = document.getElementById('nav-view-select');
  const activeView = document.getElementById('nav-view-active');
  if (selectView) selectView.classList.remove('active');
  if (activeView) activeView.classList.add('active');
  const instrEl = document.getElementById('nav-instruction-text');
  const etaEl = document.getElementById('nav-eta-text');
  const destEl = document.getElementById('nav-dest-name');
  if (instrEl) instrEl.textContent = `Head towards ${loc.name}`;
  if (etaEl) etaEl.innerHTML = `<span>${loc.eta}</span> · <span>${loc.dist}</span>`;
  if (destEl) destEl.textContent = loc.name;
  initNavActiveMap(selectedLocation);
}

function stopNavigation() {
  const selectView = document.getElementById('nav-view-select');
  const activeView = document.getElementById('nav-view-active');
  if (selectView) selectView.classList.add('active');
  if (activeView) activeView.classList.remove('active');
  selectedLocation = null;
  document.querySelectorAll('#nav-view-select .location-item').forEach(el => el.classList.remove('active'));
  const startBtn = document.getElementById('nav-start-btn');
  if (startBtn) { startBtn.disabled = true; startBtn.textContent = 'Select a destination'; }
}
