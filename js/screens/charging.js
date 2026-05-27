'use strict';

const KUCHING = [1.5535, 110.3593];
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_OPTS = { attribution: '', subdomains: 'abcd', maxZoom: 19 };

function mkMarker(color, size) {
  size = size || 14;
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 8px ${color}80"></div>`,
    iconSize: [size, size], iconAnchor: [size/2, size/2], className: ''
  });
}

function mkCarMarker() {
  return L.divIcon({
    html: `<div style="font-size:22px;line-height:1;filter:drop-shadow(0 0 4px rgba(0,212,255,0.8))">🚗</div>`,
    iconSize: [28, 28], iconAnchor: [14, 14], className: ''
  });
}

function initChargingMap() {
  if (chargingMap) { setTimeout(() => chargingMap.invalidateSize(), 100); return; }
  const el = document.getElementById('charging-map');
  if (!el) return;
  chargingMap = L.map('charging-map', { zoomControl: false, attributionControl: false }).setView(KUCHING, 14);
  L.tileLayer(DARK_TILES, TILE_OPTS).addTo(chargingMap);
  L.marker(KUCHING, { icon: mkCarMarker() }).addTo(chargingMap).bindPopup('<b>Your position</b>');
  CHARGING_STATIONS.forEach(s => {
    L.marker(s.pos, { icon: mkMarker(s.color) }).addTo(chargingMap).bindPopup(`<b>${s.name}</b><br>${s.kw}`);
  });
  setTimeout(() => chargingMap.invalidateSize(), 120);
}

function initChargingActiveMap(idx) {
  const el = document.getElementById('charging-active-map');
  if (!el) return;
  const st = CHARGING_STATIONS[idx];
  if (chargingActiveMap) { chargingActiveMap.remove(); chargingActiveMap = null; }
  chargingActiveMap = L.map('charging-active-map', { zoomControl: false, attributionControl: false }).setView(KUCHING, 14);
  L.tileLayer(DARK_TILES, TILE_OPTS).addTo(chargingActiveMap);
  L.marker(KUCHING, { icon: mkCarMarker() }).addTo(chargingActiveMap);
  L.marker(st.pos, { icon: mkMarker(st.color, 16) }).addTo(chargingActiveMap).bindPopup(`<b>${st.name}</b>`);
  L.polyline([KUCHING, st.pos], { color: st.color, weight: 4, opacity: 0.8, dashArray: '8 4' }).addTo(chargingActiveMap);
  setTimeout(() => chargingActiveMap.invalidateSize(), 120);
}

function selectStation(idx) {
  selectedStation = idx;
  document.querySelectorAll('.station-item').forEach((el, i) => el.classList.toggle('selected', i === idx));
  if (chargingMap) chargingMap.setView(CHARGING_STATIONS[idx].pos, 15, { animate: true });
  const navBtn = document.getElementById('station-nav-btn');
  if (navBtn) { navBtn.disabled = false; navBtn.textContent = `Navigate to ${CHARGING_STATIONS[idx].name}`; }
}

function startChargingNav() {
  if (selectedStation === null) return;
  const st = CHARGING_STATIONS[selectedStation];
  const selectView = document.getElementById('charging-view-select');
  const activeView = document.getElementById('charging-view-active');
  if (selectView) selectView.classList.remove('active');
  if (activeView) activeView.classList.add('active');
  const nameEl = document.getElementById('charging-dest-name');
  const distEl = document.getElementById('charging-eta-dist');
  if (nameEl) nameEl.textContent = st.name;
  if (distEl) distEl.innerHTML = `<span>${st.eta}</span> · <span>${st.dist}</span>`;
  initChargingActiveMap(selectedStation);
}

function stopChargingNav() {
  const selectView = document.getElementById('charging-view-select');
  const activeView = document.getElementById('charging-view-active');
  if (selectView) selectView.classList.add('active');
  if (activeView) activeView.classList.remove('active');
  selectedStation = null;
  document.querySelectorAll('.station-item').forEach(el => el.classList.remove('selected'));
}
