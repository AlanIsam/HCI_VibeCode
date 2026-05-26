'use strict';

/* ══ CLOCK ══ */
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const timeStr = `${hh}:${mm}`;
  ['live-time','status-time'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = timeStr; });
  ['status-day'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = days[now.getDay()]; });
  var dayHomeEl = document.getElementById('status-day-home');
  if (dayHomeEl) dayHomeEl.textContent = now.toLocaleDateString('en-GB', { weekday: 'long' });
  var dateHomeEl = document.getElementById('status-date-home');
  if (dateHomeEl) dateHomeEl.textContent = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const dateEl = document.getElementById('settings-date-display');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
}
setInterval(updateClock, 1000);

/* ══ VOLUME ══ */
function showVolOverlay() {
  const ov = document.getElementById('vol-overlay');
  if (!ov) return;
  ov.querySelector('.vol-bar-fill').style.width = (isMuted ? 0 : volume) + '%';
  ov.querySelector('.vol-value').textContent = isMuted ? '—' : volume;
  ov.classList.add('visible');
  clearTimeout(volTimer);
  volTimer = setTimeout(() => ov.classList.remove('visible'), 2200);
}
function adjustVolume(delta) {
  volume = Math.max(0, Math.min(100, volume + delta));
  if (isMuted && delta > 0) { isMuted = false; updateMuteBtn(); }
  showVolOverlay();
}
function toggleMute() { isMuted = !isMuted; updateMuteBtn(); showVolOverlay(); }
function updateMuteBtn() {
  const btn = document.getElementById('btn-mute');
  if (!btn) return;
  btn.classList.toggle('muted', isMuted);
}

/* ══ CABIN TEMP DIAL ══ */
const DIAL_R = 110;
const DIAL_CIRC = 2 * Math.PI * DIAL_R;
const DIAL_ARC = DIAL_CIRC * 0.75;
function updateDial() {
  const pct = (cabinTemp - 16) / (30 - 16);
  const offset = DIAL_ARC - pct * DIAL_ARC;
  const fill = document.getElementById('dial-fill');
  if (fill) fill.style.strokeDashoffset = offset;
  const display = document.getElementById('cabin-temp-display');
  const set = document.getElementById('cabin-temp-set');
  const navSet = document.getElementById('cabin-temp-set-nav');
  if (display) display.textContent = `${cabinTemp}°C`;
  if (set) set.textContent = `Set: ${cabinTemp}°C`;
  if (navSet) navSet.textContent = `${cabinTemp}°C`;
}
function adjustTemp(delta) { cabinTemp = Math.max(16, Math.min(30, cabinTemp + delta)); updateDial(); }

/* ══ AC SLIDERS ══ */
function initSliders() {
  [
    ['fan-speed', 'fan-display', false],
    ['ac-temp', 'ac-display', true],
    ['brightness-slider', null, false],
  ].forEach(([sliderId, displayId, isTemp]) => {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    const display = displayId ? document.getElementById(displayId) : null;
    const update = () => {
      const min = +slider.min, max = +slider.max, val = +slider.value;
      slider.style.setProperty('--pct', ((val - min) / (max - min)) * 100);
      if (display) display.textContent = isTemp ? `${val}°C` : `${val}%`;
    };
    update();
    slider.addEventListener('input', update);
  });
  const prog = document.getElementById('music-progress');
  if (prog) {
    prog.addEventListener('input', () => {
      trackSec = +prog.value;
      updateMusicSlider(prog);
      const el = document.querySelector('.music-time-current');
      if (el) el.textContent = fmtTime(trackSec);
    });
  }
}

/* ══ DRIVING MODE ══ */
function selectMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('mode-' + mode);
  if (btn) btn.classList.add('active');
  const stats = MODE_STATS[mode];
  const nameEl = document.getElementById('driving-mode-name');
  const powerEl = document.getElementById('driving-stat-power');
  const rangeEl = document.getElementById('driving-stat-range');
  const regenEl = document.getElementById('driving-stat-regen');
  if (nameEl) { nameEl.textContent = mode.toUpperCase(); nameEl.style.color = stats.color; }
  if (powerEl) powerEl.textContent = stats.power;
  if (rangeEl) rangeEl.textContent = stats.range;
  if (regenEl) regenEl.textContent = stats.regen;
  const glow = document.querySelector('.car-mode-glow');
  if (glow) glow.style.background = `radial-gradient(ellipse, ${stats.color}55 0%, transparent 70%)`;
}

/* ══ SETTINGS TOGGLES ══ */
function switchToggle(clicked) {
  const container = clicked.closest('.toggle-row, .seg-pill');
  if (!container) return;
  container.querySelectorAll('.toggle-btn, .seg-pill-btn').forEach(b => b.classList.remove('active'));
  clicked.classList.add('active');
}
