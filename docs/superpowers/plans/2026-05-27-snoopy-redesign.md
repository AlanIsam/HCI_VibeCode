# Snoopy Dashboard — Faithful Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Snoopy EV dashboard repo (CSS/JS module split, design token extraction, .gitignore) then redesign all 19 screens faithful to the Figma file, with targeted UX improvements.

**Architecture:** Single-page vanilla HTML — `index.html` stays one file with all screens inline. CSS splits into `tokens → base → components → screens/*.css`. JS splits into `state → navigation → ui → screens/*.js`. All existing `id="screen-*"` attributes and JS `onclick` handlers are preserved. Figma MCP (`mcp__figma__get_design_context`) fetches per-screen reference at implementation time.

**Tech Stack:** HTML5 / CSS3 / Vanilla JS (ES5-style, no modules, no build step) · Lucide icons (UMD CDN) · Leaflet 1.9.4 (CDN) · Google Fonts (Rajdhani, JetBrains Mono) · Figma MCP for design reference · Laragon / nginx / Vercel static

**Figma file:** `j4y3k4r4VAuBf9kfRGvHuQ`  
**Branch:** `Justin`

---

## Frame Node ID Reference

| Screen | Figma nodeId | Code screen ID |
|---|---|---|
| Climate / Driving (base) | `20:157` | screen-climate-cabin, screen-driving |
| Climate variation 2 | `105:193` | screen-climate-ac |
| Entertainment sidebar | `20:400` | screen-entertainment |
| Entertainment playlist | `20:602` | screen-music |
| Entertainment home widget | `20:681` | screen-entertainment (return state) |
| YouTube | `20:781` | screen-youtube |
| Recent Apps overlay | `108:320` | recent-overlay |
| Battery & Charging | `34:48` | screen-battery |
| Charging stations list | `37:16` | screen-charging |
| Charging navigation | `37:69` | screen-charging (active view) |
| Engine Status | `89:174` | screen-engine |
| Performance Metric | `89:263` | screen-performance |
| Issue Detection | `89:474` | screen-issues |
| Fault Analysis | `90:544` | screen-fault |
| Settings - System | `159:23` | screen-settings-system |
| Settings - Display | `159:64` | screen-settings-display |
| Settings - Bluetooth | `162:105` | screen-settings-bluetooth |
| Settings - Network | `162:146` | screen-settings-network |
| Settings - Time & Language | `162:187` | screen-settings-time |
| **Home** | *(no dedicated Figma frame — design from system tokens)* | screen-home |

---

## Task 1: Phase 0 — Add .gitignore and untrack AI artifacts

**Files:**
- Create: `.gitignore`
- Run: `git rm --cached`

- [ ] **Step 1: Create .gitignore**

Create `C:/laragon/www/HCI_VibeCode/.gitignore` with exactly:

```gitignore
# AI assistant artifacts
.claude/
.cursor/
.aider*
.roo/
.copilot*

# Planning / spec docs (AI-generated)
docs/superpowers/
*.plan.md
AGENTS.md
CLAUDE.md

# OS / editor junk
Thumbs.db
.DS_Store
.vscode/
.idea/
*.swp
*~
```

- [ ] **Step 2: Untrack .claude/settings.local.json**

```bash
cd "C:/laragon/www/HCI_VibeCode"
git rm --cached .claude/settings.local.json
```

Expected output: `rm '.claude/settings.local.json'`  
The file stays on disk, but git stops tracking it.

- [ ] **Step 3: Create assets directory scaffold**

```bash
mkdir -p "C:/laragon/www/HCI_VibeCode/assets/icons"
```

- [ ] **Step 4: Verify git status**

```bash
git status
```

Expected: `.gitignore` shown as new file, `.claude/settings.local.json` shown as deleted (from index).

- [ ] **Step 5: Commit**

```bash
git add .gitignore
git commit -m "chore: add .gitignore, untrack AI artifacts, scaffold assets/"
```

---

## Task 2: Phase 1a — Split CSS into modules

**Files:**
- Create: `css/tokens.css`, `css/base.css`, `css/components.css`, `css/screens/home.css`, `css/screens/battery.css`, `css/screens/charging.css`, `css/screens/navigation.css`, `css/screens/climate.css`, `css/screens/driving.css`, `css/screens/engine.css`, `css/screens/performance.css`, `css/screens/issues-fault.css`, `css/screens/entertainment.css`, `css/screens/settings.css`
- Modify: `index.html` — replace single `<link>` with ordered imports
- Delete: `css/styles.css`

The goal of this task is a **pure refactor** — no visual change. Move existing CSS into files without editing it.

- [ ] **Step 1: Create css/tokens.css**

Extract the `:root {}` block (lines 1–28 of styles.css) plus the `@import` for fonts. Create `css/tokens.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --bg-a: #080d1e;
  --bg-b: #1a2043;
  --bg-c: #4151a9;
  --card: rgba(255,255,255,0.055);
  --card-hover: rgba(255,255,255,0.09);
  --border: rgba(255,255,255,0.1);
  --border-hi: rgba(0,212,255,0.4);
  --cyan: #00d4ff;
  --cyan-d: #00a6bf;
  --blue: #3d6fff;
  --good: #00e676;
  --error: #ff5252;
  --warn: #ffab40;
  --text: #e8eaf6;
  --text-dim: rgba(232,234,246,0.55);
  --nav-h: 88px;
  --bar-h: 56px;
  --font-ui: 'Rajdhani', sans-serif;
  --font-data: 'JetBrains Mono', monospace;
  --dash-w: 1366px;
  --dash-h: 1024px;
  --r: 14px;
  --r-sm: 8px;
  --r-lg: 16px;
  --r-xl: 24px;
  --r-pill: 9999px;
  --gap: 16px;
  --card-pad: 20px 24px;
  --trans: 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 2: Create css/base.css**

Move these sections from `styles.css` into `css/base.css`:
- `*, *::before, *::after` reset
- `html, body`
- `#dashboard` and `#dashboard::before`
- `#status-bar`, `#status-left`, `#status-day`, `#status-time`, `#status-right`, `.status-item`
- `#content`
- `.screen`, `.screen.active`, `.screen.exit`

- [ ] **Step 3: Create css/components.css**

Move these sections from `styles.css` into `css/components.css`:
- `.screen-title`
- `.card`, `.card-clickable`
- `.card-title`, `.card-label`, `.card-value`, `.good`, `.warn`
- `#bottom-nav`, `.nav-group`, `.nav-btn`
- `#recent-overlay` and all `.recent-*` selectors
- `#vol-overlay` and all `.vol-*` selectors
- `#ent-sidebar` and all `.ent-sidebar-*` selectors
- `.comp-row`, `.comp-name`, `.comp-val`
- `.status-badge`, `.issue-dot`
- `.toggle-row`, `.toggle-btn`
- `.settings-toggle-switch`

- [ ] **Step 4: Create screen CSS files**

For each screen, create a file under `css/screens/` containing only the selectors for that screen. Move them out of `styles.css`:

| File | Selectors to move |
|---|---|
| `home.css` | `.home-grid`, `.home-weather`, `.weather-*`, `.home-clock`, `.clock-*`, `.home-status`, `.status-main`, `.status-sub`, `.home-tile`, `.home-tile-*` |
| `battery.css` | `.battery-grid`, `.batt-ring-*`, `.range-bar-*` |
| `charging.css` | `.charging-grid`, `.station-item`, `#charging-map`, `#charging-active-map`, `.charging-dest-*`, `.charging-eta-*` |
| `navigation.css` | `.nav-grid`, `.location-item`, `#nav-map`, `#nav-active-map`, `.nav-instruction-*`, `.nav-eta-*` |
| `climate.css` | `.climate-grid`, `.cabin-dial-*`, `.cabin-temp-*`, `.ac-grid`, `.fan-*`, `.ac-display-*`, `.zone-*` |
| `driving.css` | `.driving-grid`, `.mode-btn`, `.car-mode-*`, `.driving-stat-*` |
| `engine.css` | `.engine-grid`, `.perf-ring-*` |
| `performance.css` | `.perf-grid`, `.perf-metric-*`, `.perf-chart-*` |
| `issues-fault.css` | `.issues-grid`, `.issue-item`, `.issue-dot`, `.fault-*` |
| `entertainment.css` | `.ent-grid`, `.music-*`, `.playlist-*`, `.yt-*`, `.now-playing-*` |
| `settings.css` | `.settings-grid`, `.settings-nav-btn`, `.settings-section-*`, `.settings-item-*`, `.settings-toggle-switch` |

- [ ] **Step 5: Update index.html `<link>` tags**

In `index.html`, replace:
```html
<link rel="stylesheet" href="css/styles.css">
```
with:
```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/screens/home.css">
<link rel="stylesheet" href="css/screens/battery.css">
<link rel="stylesheet" href="css/screens/charging.css">
<link rel="stylesheet" href="css/screens/navigation.css">
<link rel="stylesheet" href="css/screens/climate.css">
<link rel="stylesheet" href="css/screens/driving.css">
<link rel="stylesheet" href="css/screens/engine.css">
<link rel="stylesheet" href="css/screens/performance.css">
<link rel="stylesheet" href="css/screens/issues-fault.css">
<link rel="stylesheet" href="css/screens/entertainment.css">
<link rel="stylesheet" href="css/screens/settings.css">
```

- [ ] **Step 6: Delete css/styles.css**

```bash
git rm "C:/laragon/www/HCI_VibeCode/css/styles.css"
```

- [ ] **Step 7: Visual regression check**

Open `http://localhost/HCI_VibeCode` in browser. Navigate through: Home, Battery, Settings Display. Confirm no visible change from before.

- [ ] **Step 8: Commit**

```bash
git add css/ index.html
git commit -m "refactor: split styles.css into tokens/base/components/screens modules"
```

---

## Task 3: Phase 1b — Split JS into modules

**Files:**
- Create: `js/state.js`, `js/navigation.js`, `js/ui.js`, `js/screens/battery.js`, `js/screens/charging.js`, `js/screens/navigation-map.js`, `js/screens/music.js`, `js/screens/settings.js`
- Modify: `index.html` — replace single `<script src="js/app.js">` with ordered scripts
- Delete: `js/app.js`

- [ ] **Step 1: Create js/state.js**

Move all state variables and constants from `app.js` (lines 4–109):

```js
'use strict';

/* ══ STATE ══ */
let currentScreen = 'screen-home';
const navHistory = [];
let recentScreens = [];
let cabinTemp = 21;
let isPlaying = false;
let isMuted = false;
let volume = 80;
let volTimer = null;
let trackTimer = null;
let trackSec = 0;
let currentTrack = 0;
let currentMode = 'auto';
let navMap = null, chargingMap = null;
let navActiveMap = null, chargingActiveMap = null;
let selectedLocation = null;
let selectedStation = null;
let entSidebarOpen = false;
let recentOverlayOpen = false;

/* ══ SCREEN META ══ */
const SCREEN_META = {
  'screen-home':              { label: 'Home',           icon: 'home' },
  'screen-battery':           { label: 'Energy',         icon: 'zap' },
  'screen-charging':          { label: 'Charging',       icon: 'zap-circle' },
  'screen-navigation':        { label: 'Navigation',     icon: 'navigation-2' },
  'screen-climate-cabin':     { label: 'Climate',        icon: 'thermometer' },
  'screen-climate-ac':        { label: 'AC Control',     icon: 'wind' },
  'screen-driving':           { label: 'Drive Mode',     icon: 'gauge' },
  'screen-engine':            { label: 'Engine',         icon: 'cpu' },
  'screen-performance':       { label: 'Performance',    icon: 'bar-chart-2' },
  'screen-issues':            { label: 'Issues',         icon: 'shield-check' },
  'screen-fault':             { label: 'Faults',         icon: 'alert-octagon' },
  'screen-entertainment':     { label: 'Entertainment',  icon: 'layout-grid' },
  'screen-music':             { label: 'Music',          icon: 'music-2' },
  'screen-youtube':           { label: 'YouTube',        icon: 'youtube' },
  'screen-settings-display':  { label: 'Settings',       icon: 'settings' },
  'screen-settings-bluetooth':{ label: 'Bluetooth',      icon: 'bluetooth' },
  'screen-settings-network':  { label: 'Network',        icon: 'wifi' },
  'screen-settings-time':     { label: 'Time',           icon: 'clock' },
  'screen-settings-system':   { label: 'System',         icon: 'settings-2' },
};

/* ══ SCREEN_PREVIEW ══ */
const SCREEN_PREVIEW = {
  'screen-climate-cabin': [
    { label: 'Cabin Temp', value: () => `${cabinTemp}°C` },
    { label: 'Status',     value: () => 'Active' },
  ],
  'screen-music': [
    { label: 'Track',   value: () => TRACKS[currentTrack]?.title || '—' },
    { label: 'Artist',  value: () => TRACKS[currentTrack]?.artist || '—' },
    { label: 'Playing', value: () => isPlaying ? 'Yes' : 'No' },
  ],
  'screen-navigation': [
    { label: 'Destination', value: () => selectedLocation != null ? NAV_LOCATIONS[selectedLocation]?.name : 'None selected' },
    { label: 'ETA',         value: () => selectedLocation != null ? NAV_LOCATIONS[selectedLocation]?.eta : '—' },
  ],
  'screen-driving': [
    { label: 'Mode',  value: () => currentMode.toUpperCase() },
    { label: 'Range', value: () => MODE_STATS[currentMode]?.range || '—' },
  ],
  'screen-battery': [
    { label: 'Battery',  value: () => '80%' },
    { label: 'Range',    value: () => '105 KM' },
  ],
  'screen-engine': [
    { label: 'Speed',  value: () => '90 km/h' },
    { label: 'Issues', value: () => 'None' },
  ],
};

/* ══ TRACKS ══ */
const TRACKS = [
  { title: 'Starboy',         artist: 'The Weeknd',    dur: 250 },
  { title: 'Blinding Lights', artist: 'The Weeknd',    dur: 202 },
  { title: 'Save Your Tears', artist: 'The Weeknd',    dur: 215 },
  { title: 'Levitating',      artist: 'Dua Lipa',      dur: 204 },
  { title: 'As It Was',       artist: 'Harry Styles',  dur: 157 },
  { title: 'Anti-Hero',       artist: 'Taylor Swift',  dur: 200 },
  { title: 'Golden Hour',     artist: 'JVKE',           dur: 209 },
  { title: 'Heat Waves',      artist: 'Glass Animals',  dur: 238 },
];

/* ══ MODE STATS ══ */
const MODE_STATS = {
  auto:  { power: '75 kW',  range: '105 KM', regen: '18%', color: '#00d4ff' },
  eco:   { power: '45 kW',  range: '130 KM', regen: '24%', color: '#00e676' },
  sport: { power: '150 kW', range: '75 KM',  regen: '12%', color: '#ff5252' },
};

/* ══ NAV LOCATIONS ══ */
const NAV_LOCATIONS = [
  { name: 'UNIMAS Main Campus',       detail: 'Kota Samarahan · University', dist: '1.2 km', eta: '3 min',  emoji: '🎓', pos: [1.4556, 110.4334] },
  { name: 'Kuching Waterfront',       detail: 'Jalan Main Bazaar · Landmark', dist: '8.4 km', eta: '18 min', emoji: '🌊', pos: [1.5570, 110.3436] },
  { name: 'The Spring Shopping Mall', detail: 'Jln Stutong · Mall',           dist: '6.1 km', eta: '12 min', emoji: '🛍️', pos: [1.5018, 110.3680] },
  { name: 'Satok Weekend Market',     detail: 'Jln Satok · Market',           dist: '9.2 km', eta: '21 min', emoji: '🛒', pos: [1.5560, 110.3378] },
  { name: 'Kuching Airport (KUCA)',   detail: 'Jln Airport · Transport',      dist: '11.3 km', eta: '24 min', emoji: '✈️', pos: [1.4847, 110.3369] },
];

/* ══ CHARGING STATIONS ══ */
const CHARGING_STATIONS = [
  { name: 'JomCharge Station',    detail: 'Jalan Uni Academia',   dist: '0.8 km', eta: '2 min',  emoji: '⚡', open: 'Open · Closes 7 pm', kw: '22 kW', slots: '2/2',      color: '#00e676', pos: [1.5570, 110.3550] },
  { name: 'BMW Charging Station', detail: 'Kuching, Sarawak',     dist: '2.1 km', eta: '5 min',  emoji: '🔵', open: 'Open 24 hours',      kw: '12 kW', slots: '2/2',      color: '#00d4ff', pos: [1.5510, 110.3620] },
  { name: 'ChargeSini Station',   detail: 'Kuching, Sarawak',     dist: '3.4 km', eta: '8 min',  emoji: '🟠', open: 'Open 24 hours',      kw: '22 kW', slots: '0/3 Full', color: '#ffab40', pos: [1.5490, 110.3580] },
];
```

- [ ] **Step 2: Create js/navigation.js**

Move navigation, recent apps, and entertainment sidebar functions from `app.js`:

```js
'use strict';

/* ══ NAVIGATION ══ */
function navigate(to) {
  closeRecentApps();
  closeEntSidebar();
  if (to === currentScreen) return;
  const prev = document.getElementById(currentScreen);
  const next = document.getElementById(to);
  if (!next) return;
  if (prev) {
    prev.classList.add('exit');
    setTimeout(() => prev.classList.remove('active', 'exit'), 320);
  }
  next.classList.add('active');
  navHistory.push(currentScreen);
  addToRecent(currentScreen);
  currentScreen = to;
  onScreenEnter(to);
}

function goBack() {
  closeRecentApps();
  closeEntSidebar();
  if (navHistory.length === 0) return;
  const prev = navHistory.pop();
  const curr = document.getElementById(currentScreen);
  const target = document.getElementById(prev);
  if (!target) return;
  if (curr) {
    curr.classList.add('exit');
    setTimeout(() => curr.classList.remove('active', 'exit'), 320);
  }
  target.classList.add('active');
  currentScreen = prev;
  onScreenEnter(prev);
}

function onScreenEnter(id) {
  if (id === 'screen-navigation') initNavSelectMap();
  if (id === 'screen-charging')   initChargingMap();
}

function addToRecent(screenId) {
  if (!SCREEN_META[screenId]) return;
  recentScreens = recentScreens.filter(s => s !== screenId);
  recentScreens.unshift(screenId);
  if (recentScreens.length > 6) recentScreens.pop();
}

function openRecentApps() {
  const overlay = document.getElementById('recent-overlay');
  if (!overlay) return;
  renderRecentCards();
  overlay.classList.add('open');
  recentOverlayOpen = true;
}

function closeRecentApps() {
  const overlay = document.getElementById('recent-overlay');
  if (overlay) overlay.classList.remove('open');
  recentOverlayOpen = false;
}

function clearRecentApps() {
  recentScreens = [];
  renderRecentCards();
}

function renderRecentCards() {
  const container = document.getElementById('recent-cards');
  if (!container) return;
  if (recentScreens.length === 0) {
    container.innerHTML = `<div style="color:var(--text-dim);font-size:16px;margin:auto">No recent apps</div>`;
    return;
  }
  container.innerHTML = recentScreens.map((id) => {
    const meta = SCREEN_META[id];
    const preview = SCREEN_PREVIEW[id];
    const previewHtml = preview
      ? preview.map(p => `<div class="recent-preview-row"><span class="recent-preview-label">${p.label}</span><span class="recent-preview-value">${p.value()}</span></div>`).join('')
      : `<div style="color:var(--text-dim);font-size:13px;padding:8px 0">Tap to open</div>`;
    return `<div class="recent-card" onclick="recentCardTap('${id}', event)">
      <div class="recent-card-header">
        <div class="recent-card-title"><i data-lucide="${meta.icon}" style="width:16px;height:16px;color:var(--cyan)"></i>${meta.label}</div>
        <button class="recent-card-close" onclick="removeRecent('${id}',event)"><i data-lucide="x"></i></button>
      </div>
      <div class="recent-card-preview">${previewHtml}</div>
    </div>`;
  }).join('');
  lucide.createIcons({ nodes: [container] });
}

function recentCardTap(id, event) { closeRecentApps(); navigate(id); }

function removeRecent(id, event) {
  event.stopPropagation();
  recentScreens = recentScreens.filter(s => s !== id);
  renderRecentCards();
}

function toggleEntSidebar() {
  entSidebarOpen = !entSidebarOpen;
  const sidebar = document.getElementById('ent-sidebar');
  if (sidebar) sidebar.classList.toggle('open', entSidebarOpen);
}

function closeEntSidebar() {
  entSidebarOpen = false;
  const sidebar = document.getElementById('ent-sidebar');
  if (sidebar) sidebar.classList.remove('open');
}

function navFromSidebar(to) { closeEntSidebar(); navigate(to); }
```

- [ ] **Step 3: Create js/ui.js**

Move clock, volume, cabin dial, AC sliders, and driving mode functions from `app.js`:

```js
'use strict';

/* ══ CLOCK ══ */
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const timeStr = `${hh}:${mm}`;
  ['live-time','status-time'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = timeStr; });
  ['status-day','status-day-home'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = days[now.getDay()]; });
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
  const row = clicked.closest('.toggle-row');
  if (!row) return;
  row.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  clicked.classList.add('active');
}
```

- [ ] **Step 4: Create js/screens/music.js**

Move all music/playlist functions from `app.js`:

```js
'use strict';

function fmtTime(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

function loadTrack(idx) {
  currentTrack = idx != null ? idx : currentTrack;
  const t = TRACKS[currentTrack];
  trackSec = 0;
  clearInterval(trackTimer);
  isPlaying = false;
  const prog = document.getElementById('music-progress');
  if (prog) { prog.max = t.dur; prog.value = 0; updateMusicSlider(prog); }
  const titleEl = document.querySelector('.music-title');
  const artistEl = document.querySelector('.music-artist');
  const timeEl = document.querySelector('.music-time-current');
  const durEl = document.querySelector('.music-time-total');
  const nowEl = document.getElementById('now-playing-text');
  if (titleEl) titleEl.textContent = t.title;
  if (artistEl) artistEl.textContent = `${t.artist} · Playlist`;
  if (timeEl) timeEl.textContent = '0:00';
  if (durEl) durEl.textContent = fmtTime(t.dur);
  if (nowEl) nowEl.textContent = `${t.title} — ${t.artist}`;
  const art = document.querySelector('.music-art-spinning');
  if (art) art.classList.remove('playing');
  updatePlayBtn();
  renderPlaylist();
}

function updateMusicSlider(slider) {
  if (!slider) return;
  slider.style.setProperty('--pct', (+slider.value / +slider.max) * 100);
}

function togglePlay() {
  isPlaying = !isPlaying;
  updatePlayBtn();
  const art = document.querySelector('.music-art-spinning');
  if (art) art.classList.toggle('playing', isPlaying);
  if (isPlaying) {
    trackTimer = setInterval(() => {
      const t = TRACKS[currentTrack];
      trackSec = Math.min(trackSec + 1, t.dur);
      const prog = document.getElementById('music-progress');
      const timeEl = document.querySelector('.music-time-current');
      if (prog) { prog.value = trackSec; updateMusicSlider(prog); }
      if (timeEl) timeEl.textContent = fmtTime(trackSec);
      if (trackSec >= t.dur) nextTrack();
    }, 1000);
  } else {
    clearInterval(trackTimer);
  }
}

function updatePlayBtn() {
  const btn = document.getElementById('play-btn');
  if (!btn) return;
  const ico = btn.querySelector('[data-lucide]');
  if (ico) { ico.setAttribute('data-lucide', isPlaying ? 'pause' : 'play'); lucide.createIcons({ nodes: [btn] }); }
}

function prevTrack() {
  if (trackSec > 3) { trackSec = 0; return; }
  currentTrack = (currentTrack - 1 + TRACKS.length) % TRACKS.length;
  const wasPlaying = isPlaying; isPlaying = false; loadTrack();
  if (wasPlaying) togglePlay();
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % TRACKS.length;
  const wasPlaying = isPlaying; isPlaying = false; loadTrack();
  if (wasPlaying) togglePlay();
}

function selectTrack(idx) { isPlaying = false; loadTrack(idx); togglePlay(); }

function renderPlaylist() {
  const c = document.getElementById('playlist-items');
  if (!c) return;
  c.innerHTML = TRACKS.map((t, i) => `
    <div class="playlist-item ${i === currentTrack ? 'active' : ''}" onclick="selectTrack(${i})">
      <span class="playlist-num">${i === currentTrack && isPlaying ? '▶' : i + 1}</span>
      <div class="playlist-info"><div class="playlist-song">${t.title}</div><div class="playlist-artist">${t.artist}</div></div>
      <span class="playlist-dur">${fmtTime(t.dur)}</span>
    </div>`).join('');
}
```

- [ ] **Step 5: Create js/screens/charging.js**

Move Leaflet charging map functions from `app.js`:

```js
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
```

- [ ] **Step 6: Create js/screens/navigation-map.js**

Move Leaflet navigation map functions from `app.js`:

```js
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
```

- [ ] **Step 7: Create js/screens/battery.js**

Empty placeholder for battery-specific interactions (currently none):

```js
'use strict';
/* Battery screen has no interactivity beyond static display. */
```

- [ ] **Step 8: Create js/screens/settings.js**

Move settings toggle logic (already in `ui.js` as `switchToggle`) — this file holds segmented pill logic added in Task 5:

```js
'use strict';
/* Settings-specific JS is minimal; segmented pill logic lives in ui.js as switchToggle(). */
```

- [ ] **Step 9: Update index.html — replace single app.js with ordered scripts**

In `index.html`, replace:
```html
<script src="js/app.js"></script>
```
with:
```html
<script src="js/state.js"></script>
<script src="js/screens/charging.js"></script>
<script src="js/screens/navigation-map.js"></script>
<script src="js/screens/music.js"></script>
<script src="js/screens/battery.js"></script>
<script src="js/screens/settings.js"></script>
<script src="js/navigation.js"></script>
<script src="js/ui.js"></script>
<script src="js/init.js"></script>
```

Also create `js/init.js` with the `DOMContentLoaded` init block from `app.js`:

```js
'use strict';

window.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initSliders();
  updateDial();
  loadTrack(0);
  selectMode('auto');
  updateClock();
  addToRecent('screen-music');
  addToRecent('screen-driving');
  addToRecent('screen-navigation');
  addToRecent('screen-climate-cabin');
});
```

- [ ] **Step 10: Delete js/app.js**

```bash
git rm "C:/laragon/www/HCI_VibeCode/js/app.js"
```

- [ ] **Step 11: Functional regression check**

Open `http://localhost/HCI_VibeCode`. Verify:
- Clock updates every second
- Navigate to Battery → Music → Navigation (map loads) → Charging (map loads) → back works
- Climate dial moves
- Music plays / pauses
- Volume overlay appears on volume up/down
- Settings toggles work

- [ ] **Step 12: Commit**

```bash
git add js/ index.html
git commit -m "refactor: split app.js into state/navigation/ui/screens modules"
```

---

## Task 4: Phase 2a — Align design tokens with Figma

**Files:**
- Modify: `css/tokens.css`

The Figma palette closely matches existing tokens. This task adds missing tokens and renames for spec consistency.

- [ ] **Step 1: Fetch Figma Settings - Display for color reference**

Run: `mcp__figma__get_screenshot` with fileKey `j4y3k4r4VAuBf9kfRGvHuQ`, nodeId `159:64`

Compare the rendered colors against existing tokens. Expected: dark navy bg matches `#080d1e`, panel surfaces match `#1a2043`, accent is `#00d4ff`.

- [ ] **Step 2: Update tokens.css — add missing tokens**

In `css/tokens.css`, add these new tokens inside `:root {}` after the existing ones:

```css
  /* Aliases for spec consistency */
  --bg: var(--bg-a);
  --panel: var(--bg-b);
  --muted: var(--text-dim);
  --danger: var(--error);

  /* New tokens from Figma */
  --r-md: 10px;
  --r-lg: 16px;
  --r-xl: 24px;
  --r-pill: 9999px;
  --gap: 16px;
  --card-pad: 20px 24px;

  /* Bottom dock */
  --dock-h: 88px;
  --dock-btn-size: 56px;
```

- [ ] **Step 3: Verify no visual change**

Open the app and check Home screen. No visual change should occur as these are additive-only token additions.

- [ ] **Step 4: Commit**

```bash
git add css/tokens.css
git commit -m "feat: add design token aliases and new layout tokens from Figma"
```

---

## Task 5: Phase 2b — Redesign bottom dock and add segmented pills

**Files:**
- Modify: `css/components.css` — restyle `#bottom-nav` to pill dock; add `.seg-pill` component
- Modify: `index.html` — update `#bottom-nav` HTML to pill dock structure

The Figma shows the bottom nav as a centered pill-shaped floating dock. Current code has a full-width bar. This task redesigns the chrome.

- [ ] **Step 1: Fetch Figma Settings - Display screenshot for dock reference**

Run: `mcp__figma__get_screenshot` with fileKey `j4y3k4r4VAuBf9kfRGvHuQ`, nodeId `159:64`

Examine the bottom dock shape, button sizes, spacing, and active state treatment.

- [ ] **Step 2: Update #bottom-nav CSS in components.css**

Find the `#bottom-nav` block in `css/components.css` and replace it:

```css
#bottom-nav {
  height: var(--dock-h);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  background: transparent;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.nav-dock {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(10, 24, 56, 0.88);
  backdrop-filter: blur(24px);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  padding: 10px 16px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,255,0.06);
}

.nav-dock-divider {
  width: 1px;
  height: 32px;
  background: var(--border);
  margin: 0 6px;
}

.nav-btn {
  width: var(--dock-btn-size);
  height: var(--dock-btn-size);
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--border);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--trans), border-color var(--trans), transform 0.12s ease, box-shadow 0.15s ease;
  flex-shrink: 0;
}

.nav-btn:hover {
  background: rgba(0,212,255,0.14);
  border-color: var(--cyan);
  box-shadow: 0 0 12px rgba(0,212,255,0.2);
}

.nav-btn:active { transform: scale(0.91); }
.nav-btn.large { width: 62px; height: 62px; }
.nav-btn.active {
  background: var(--cyan);
  border-color: var(--cyan);
  color: var(--bg-a);
  box-shadow: 0 0 18px rgba(0,212,255,0.4);
}
.nav-btn.muted { color: var(--error); border-color: var(--error); }
.nav-btn svg { width: 22px; height: 22px; }
.nav-btn.large svg { width: 26px; height: 26px; }
```

- [ ] **Step 3: Update bottom-nav HTML in index.html**

Find the `<nav id="bottom-nav">` block (lines ~772–806) and replace it:

```html
<nav id="bottom-nav">
  <div class="nav-dock">
    <!-- Audio controls -->
    <button class="nav-btn" id="btn-mute" onclick="toggleMute()" title="Mute">
      <i data-lucide="volume-x"></i>
    </button>
    <button class="nav-btn" onclick="adjustVolume(-10)" title="Volume Down">
      <i data-lucide="volume-1"></i>
    </button>
    <button class="nav-btn" onclick="adjustVolume(10)" title="Volume Up">
      <i data-lucide="volume-2"></i>
    </button>
    <div class="nav-dock-divider"></div>
    <!-- System navigation -->
    <button class="nav-btn" onclick="openRecentApps()" title="Recent Apps">
      <i data-lucide="layout-grid"></i>
    </button>
    <button class="nav-btn large" onclick="navigate('screen-home')" title="Home">
      <i data-lucide="home"></i>
    </button>
    <button class="nav-btn large" onclick="goBack()" title="Back">
      <i data-lucide="undo-2"></i>
    </button>
    <div class="nav-dock-divider"></div>
    <!-- Quick access -->
    <button class="nav-btn" onclick="navigate('screen-climate-cabin')" title="Climate Control">
      <i data-lucide="wind"></i>
    </button>
    <button class="nav-btn" onclick="navigate('screen-settings-display')" title="Settings">
      <i data-lucide="settings"></i>
    </button>
  </div>
</nav>
```

- [ ] **Step 4: Add .seg-pill component to components.css**

Append to `css/components.css`:

```css
/* ── SEGMENTED PILL TOGGLE ── */
.seg-pill {
  display: flex;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  padding: 3px;
  gap: 0;
}

.seg-pill-btn {
  flex: 1;
  padding: 8px 18px;
  border-radius: var(--r-pill);
  border: none;
  background: transparent;
  color: var(--muted);
  font-family: var(--font-ui);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--trans), color var(--trans);
  white-space: nowrap;
}

.seg-pill-btn.active {
  background: var(--cyan);
  color: var(--bg-a);
}

.seg-pill-btn:not(.active):hover {
  background: rgba(255,255,255,0.08);
  color: var(--text);
}
```

- [ ] **Step 5: Remove old `.nav-group` CSS from components.css**

Delete the `.nav-group` block (it's replaced by `.nav-dock` and `.nav-dock-divider`).

- [ ] **Step 6: Visual check**

Open app, verify the dock appears as a floating pill at the bottom. Buttons should work. Home → Music → Back should still navigate.

- [ ] **Step 7: Commit**

```bash
git add css/components.css index.html
git commit -m "feat: redesign bottom dock as floating pill, add segmented pill component"
```

---

## Task 6: Phase 3 — Redesign Settings screens (5 sub-tabs)

**Files:**
- Modify: `index.html` — sections `#screen-settings-*`
- Modify: `css/screens/settings.css`

**Figma nodes:** System `159:23`, Display `159:64`, Bluetooth `162:105`, Network `162:146`, Time `162:187`

- [ ] **Step 1: Fetch Figma design context for Settings - Display**

Run: `mcp__figma__get_design_context` with fileKey `j4y3k4r4VAuBf9kfRGvHuQ`, nodeId `159:64`, clientLanguages `html,css,javascript`, clientFrameworks `vanilla-js`

Examine the layout: left vertical sidebar with 5 tab buttons, right content pane, "Settings and Preferences" heading above the sidebar.

- [ ] **Step 2: Fetch screenshots for all 5 settings frames**

Run `mcp__figma__get_screenshot` for each node: `159:23`, `159:64`, `162:105`, `162:146`, `162:187`

- [ ] **Step 3: Rewrite settings screen HTML structure**

Replace all 5 `<section id="screen-settings-*">` blocks in `index.html` with the new layout. All 5 screens share the same chrome (title + sidebar), differing only in the active tab class and right-pane content. 

**Shared layout pattern** (repeat for each tab, changing `active` class and right-pane content):

```html
<section id="screen-settings-display" class="screen">
  <div class="settings-layout">
    <!-- Left sidebar -->
    <aside class="settings-sidebar">
      <div class="settings-sidebar-title">Settings<br>and Preferences</div>
      <nav class="settings-sidebar-nav">
        <button class="settings-nav-btn" onclick="navigate('screen-settings-system')">
          <i data-lucide="settings-2"></i> System
        </button>
        <button class="settings-nav-btn active">
          <i data-lucide="monitor"></i> Display
        </button>
        <button class="settings-nav-btn" onclick="navigate('screen-settings-bluetooth')">
          <i data-lucide="bluetooth"></i> Bluetooth &amp; Devices
        </button>
        <button class="settings-nav-btn" onclick="navigate('screen-settings-network')">
          <i data-lucide="wifi"></i> Network &amp; Internet
        </button>
        <button class="settings-nav-btn" onclick="navigate('screen-settings-time')">
          <i data-lucide="clock"></i> Time &amp; Language
        </button>
      </nav>
    </aside>
    <!-- Right pane — Display tab content -->
    <div class="settings-pane">
      <div class="settings-pane-title">Display</div>
      <div class="settings-section">
        <div class="settings-section-label">Energy Display</div>
        <div class="seg-pill">
          <button class="seg-pill-btn active" onclick="switchToggle(this)">Battery</button>
          <button class="seg-pill-btn" onclick="switchToggle(this)">Distance</button>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-section-label">Distance</div>
        <div class="seg-pill">
          <button class="seg-pill-btn active" onclick="switchToggle(this)">Kilometer</button>
          <button class="seg-pill-btn" onclick="switchToggle(this)">Miles</button>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-section-label">Tire Pressure</div>
        <div class="seg-pill">
          <button class="seg-pill-btn active" onclick="switchToggle(this)">Bar</button>
          <button class="seg-pill-btn" onclick="switchToggle(this)">Psi</button>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-section-label">Brightness</div>
        <input type="range" class="settings-slider" id="brightness-slider" min="10" max="100" value="80">
      </div>
    </div>
  </div>
</section>
```

Repeat for the other 4 tabs with their specific right-pane content matching the Figma screenshots.

- [ ] **Step 4: Rewrite css/screens/settings.css**

Replace the entire file with layout CSS matching the Figma sidebar design:

```css
/* ── SETTINGS LAYOUT ── */
.settings-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 0;
  height: 100%;
  background: transparent;
}

.settings-sidebar {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--r-lg) 0 0 var(--r-lg);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  backdrop-filter: blur(20px);
}

.settings-sidebar-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.25;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}

.settings-sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--r-md);
  border: none;
  background: transparent;
  color: var(--muted);
  font-family: var(--font-ui);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background var(--trans), color var(--trans);
  width: 100%;
}

.settings-nav-btn:hover {
  background: rgba(255,255,255,0.07);
  color: var(--text);
}

.settings-nav-btn.active {
  background: rgba(0,212,255,0.12);
  color: var(--cyan);
  border: 1px solid rgba(0,212,255,0.25);
}

.settings-nav-btn svg { width: 18px; height: 18px; flex-shrink: 0; }

.settings-pane {
  background: var(--card);
  border: 1px solid var(--border);
  border-left: none;
  border-radius: 0 var(--r-lg) var(--r-lg) 0;
  padding: 32px 36px;
  backdrop-filter: blur(20px);
  overflow-y: auto;
}

.settings-pane-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 28px;
  letter-spacing: 0.03em;
}

.settings-section {
  margin-bottom: 28px;
}

.settings-section-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}

.settings-slider {
  width: 100%;
  max-width: 320px;
  accent-color: var(--cyan);
}

.settings-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}

.settings-item-label {
  font-size: 15px;
  color: var(--text);
}

.settings-toggle-switch {
  width: 48px;
  height: 26px;
  border-radius: var(--r-pill);
  background: var(--border);
  position: relative;
  cursor: pointer;
  transition: background var(--trans);
  flex-shrink: 0;
}

.settings-toggle-switch.on { background: var(--cyan); }

.settings-toggle-switch::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: transform var(--trans);
}

.settings-toggle-switch.on::after { transform: translateX(22px); }
```

- [ ] **Step 5: Update switchToggle() in ui.js for seg-pill**

The existing `switchToggle` works on `.toggle-btn`. Update it to also handle `.seg-pill-btn`:

```js
function switchToggle(clicked) {
  const container = clicked.closest('.toggle-row, .seg-pill');
  if (!container) return;
  container.querySelectorAll('.toggle-btn, .seg-pill-btn').forEach(b => b.classList.remove('active'));
  clicked.classList.add('active');
}
```

- [ ] **Step 6: Visual check — all 5 settings tabs**

Open app → navigate to Settings. Verify sidebar visible, active tab highlighted, seg-pill toggles respond to click, toggle switches work.

- [ ] **Step 7: Commit**

```bash
git add index.html css/screens/settings.css js/ui.js
git commit -m "feat: redesign all 5 settings sub-tabs with sidebar + segmented pills"
```

---

## Task 7: Phase 4 — Redesign Home screen

**Files:**
- Modify: `index.html` — section `#screen-home`
- Modify: `css/screens/home.css`

No dedicated Figma frame for Home exists. Design it from the established token/component system.

- [ ] **Step 1: Fetch Figma screenshot for Home reference (best available)**

Run `mcp__figma__get_screenshot` with nodeId `20:157` (Driving/Climate frame — shows the status bar and dock chrome for context).

- [ ] **Step 2: Redesign home screen HTML in index.html**

The home grid has: weather card (tall, col 1), clock card, status card, 5 quick-tile cards. Keep the same grid structure, update class names to use design system tokens. The `onclick` handlers must stay unchanged:

```html
<section id="screen-home" class="screen">
  <div class="home-grid">
    <div class="card home-weather card-clickable">
      <div class="weather-icon-bg">⛅</div>
      <div class="weather-info">
        <div class="weather-city">Weather · Kuching</div>
        <div class="weather-temp">28°C</div>
        <div class="weather-cond">Partly Cloudy</div>
      </div>
    </div>
    <div class="card home-clock">
      <div class="clock-day" id="status-day-home">Monday</div>
      <div class="clock-time" id="live-time">12:37</div>
    </div>
    <div class="card home-status">
      <i data-lucide="check-circle-2"></i>
      <div class="status-main">No issues detected</div>
      <div class="status-sub">You're good to go!</div>
    </div>
    <div class="card home-tile home-tile-driving card-clickable" onclick="navigate('screen-driving')">
      <i data-lucide="gauge"></i><span>Driving Mode</span>
    </div>
    <div class="card home-tile home-tile-ent card-clickable" onclick="toggleEntSidebar()">
      <i data-lucide="music-2"></i><span>Entertainment</span>
    </div>
    <div class="card home-tile home-tile-engine card-clickable" onclick="navigate('screen-engine')">
      <i data-lucide="cpu"></i><span>Engine Status</span>
    </div>
    <div class="card home-tile home-tile-energy card-clickable" onclick="navigate('screen-battery')">
      <i data-lucide="zap"></i><span>Energy</span>
    </div>
    <div class="card home-tile home-tile-nav card-clickable" onclick="navigate('screen-navigation')">
      <i data-lucide="navigation-2"></i><span>Navigation</span>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Update css/screens/home.css to use token variables**

Replace all hardcoded colors/sizes with token references. Key improvements:
- All tile colors use `var(--cyan)` / `var(--blue)` tints via `rgba(0,212,255,0.12)` backgrounds
- Clock time in `var(--cyan)`, `var(--font-data)`
- Weather card gets a gradient overlay for visual depth
- All tiles use `var(--r-lg)` radius and `var(--card-pad)` padding consistently
- Hover states use `var(--card-hover)` and `var(--border-hi)`

The grid structure stays unchanged:
```css
.home-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: var(--gap);
  height: 100%;
}
.home-weather { grid-column: 1; grid-row: 1 / 3; }
.home-clock   { grid-column: 2; grid-row: 1; }
.home-status  { grid-column: 3; grid-row: 1; }
/* tiles fill rows 2 and 3 */
```

- [ ] **Step 4: Visual check**

Open app → Home. Verify grid layout, clock updates, tiles navigate correctly on click.

- [ ] **Step 5: Commit**

```bash
git add index.html css/screens/home.css
git commit -m "feat: redesign home screen with design token polish"
```

---

## Task 8: Phase 5 — Redesign Engine, Performance, Issues, Fault screens

**Files:**
- Modify: `index.html` — sections `#screen-engine`, `#screen-performance`, `#screen-issues`, `#screen-fault`
- Modify: `css/screens/engine.css`, `css/screens/performance.css`, `css/screens/issues-fault.css`

**Figma nodes:** Engine `89:174`, Performance `89:263`, Issues `89:474`, Fault `90:544`

- [ ] **Step 1: Fetch Figma design context and screenshots for all 4 screens**

Run `mcp__figma__get_design_context` for each: `89:174`, `89:263`, `89:474`, `90:544`
(fileKey: `j4y3k4r4VAuBf9kfRGvHuQ`, clientLanguages: `html,css,javascript`, clientFrameworks: `vanilla-js`)

- [ ] **Step 2: Rewrite HTML and CSS for each screen to match Figma**

For each screen, update the `<section>` HTML to match Figma layout. Update the corresponding screen CSS file to use tokens. Preserve all existing element IDs and `onclick` handlers. Key patterns to adopt:
- `.screen-title` component for headings
- `.card` with `var(--card-pad)` and `var(--r-lg)`
- `.comp-row` rows using `var(--text)` / `var(--muted)` / `var(--good)` / `var(--warn)` / `var(--danger)`
- `.status-badge` dots for issue/fault indicators

- [ ] **Step 3: Visual check — all 4 screens**

Navigate through each screen. Verify data rows display correctly, status badges use correct colors.

- [ ] **Step 4: Commit**

```bash
git add index.html css/screens/engine.css css/screens/performance.css css/screens/issues-fault.css
git commit -m "feat: redesign engine, performance, issues, fault screens"
```

---

## Task 9: Phase 6 — Redesign Battery and Charging screens

**Files:**
- Modify: `index.html` — sections `#screen-battery`, `#screen-charging`
- Modify: `css/screens/battery.css`, `css/screens/charging.css`

**Figma nodes:** Battery `34:48`, Charging list `37:16`, Charging nav active `37:69`

**Important:** Leaflet map IDs `charging-map` and `charging-active-map` must not change. Map init functions in `js/screens/charging.js` are untouched.

- [ ] **Step 1: Fetch Figma design context and screenshots**

Run `mcp__figma__get_design_context` for `34:48`, `37:16`, `37:69`

- [ ] **Step 2: Rewrite HTML and CSS for battery screen**

Keep the SVG ring (`battGrad` linear gradient), `comp-row` data rows. Update layout to match Figma card arrangement. Use token variables throughout.

- [ ] **Step 3: Rewrite HTML and CSS for charging screen**

Keep `#charging-map`, `#charging-active-map`, `#charging-view-select`, `#charging-view-active`, `.location-item`, `#station-nav-btn` IDs. Update card layout and station list styling to match Figma.

- [ ] **Step 4: Visual check**

Navigate to Battery → Charging. Verify ring displays, map loads with markers, stations list is selectable, "Navigate to" button enables, active view shows route.

- [ ] **Step 5: Commit**

```bash
git add index.html css/screens/battery.css css/screens/charging.css
git commit -m "feat: redesign battery and charging screens"
```

---

## Task 10: Phase 7 — Redesign Navigation screen

**Files:**
- Modify: `index.html` — section `#screen-navigation`
- Modify: `css/screens/navigation.css`

**Figma nodes:** Navigation start `37:69`, Navigation active `38:183`

**Important:** Map IDs `nav-map`, `nav-active-map`, views `nav-view-select`, `nav-view-active`, elements `nav-start-btn`, `nav-instruction-text`, `nav-eta-text`, `nav-dest-name` must not change.

- [ ] **Step 1: Fetch Figma design context and screenshots**

Run `mcp__figma__get_design_context` for `37:69` and `38:183`

- [ ] **Step 2: Rewrite HTML and CSS for navigation screen**

Keep all map and view IDs. Update card chrome, location list items, navigation instruction bar to match Figma. Use token variables.

- [ ] **Step 3: Visual check**

Navigate to Navigation. Map loads, location list shows, selecting a location enables start button, starting nav shows active map view with polyline route.

- [ ] **Step 4: Commit**

```bash
git add index.html css/screens/navigation.css
git commit -m "feat: redesign navigation screen"
```

---

## Task 11: Phase 8 — Redesign Climate and Driving screens

**Files:**
- Modify: `index.html` — sections `#screen-climate-cabin`, `#screen-climate-ac`, `#screen-driving`
- Modify: `css/screens/climate.css`, `css/screens/driving.css`

**Figma nodes:** Climate/Driving base `20:157`, variation 2 `105:193`, variation 3 `105:229`

**Important:** IDs `dial-fill`, `cabin-temp-display`, `cabin-temp-set`, `cabin-temp-set-nav`, `fan-speed`, `ac-temp`, `fan-display`, `ac-display`, `driving-mode-name`, `driving-stat-power/range/regen`, `mode-auto/eco/sport` must not change.

- [ ] **Step 1: Fetch Figma design context and screenshots**

Run `mcp__figma__get_design_context` for `20:157`, `105:193`, `105:229`

- [ ] **Step 2: Rewrite HTML and CSS for climate screens**

Keep cabin dial SVG structure (`id="dial-fill"`). Update card layout, temp display, zone controls, AC slider layout to match Figma. Use token variables.

- [ ] **Step 3: Rewrite HTML and CSS for driving screen**

Keep `.mode-btn` IDs and `selectMode()` onclick handlers. Update card layout and stats display to match Figma.

- [ ] **Step 4: Visual check**

Navigate to Climate → adjust dial → go to AC → sliders respond → Driving → mode buttons switch with color change.

- [ ] **Step 5: Commit**

```bash
git add index.html css/screens/climate.css css/screens/driving.css
git commit -m "feat: redesign climate cabin, AC, and driving mode screens"
```

---

## Task 12: Phase 9 — Redesign Entertainment, Music, YouTube screens

**Files:**
- Modify: `index.html` — sections `#screen-entertainment`, `#screen-music`, `#screen-youtube`, and `#ent-sidebar`
- Modify: `css/screens/entertainment.css`

**Figma nodes:** Entertainment sidebar `20:400`, Playlist/music `20:602`, Home with widget `20:681`, YouTube `20:781`

**Important:** IDs `ent-sidebar`, `play-btn`, `music-progress`, `playlist-items`, `now-playing-text` must not change. `togglePlay()`, `prevTrack()`, `nextTrack()`, `selectTrack()`, `toggleEntSidebar()` must remain callable from `onclick`.

- [ ] **Step 1: Fetch Figma design context and screenshots**

Run `mcp__figma__get_design_context` for `20:400`, `20:602`, `20:681`, `20:781`

- [ ] **Step 2: Rewrite HTML and CSS for all entertainment screens**

Update card layouts, music art display, playlist list styling, YouTube placeholder. Keep all JS-targeted IDs and `onclick` handlers.

- [ ] **Step 3: Visual check**

Navigate to Entertainment → open sidebar → go to Music → play/pause/skip → YouTube tab shows.

- [ ] **Step 4: Commit**

```bash
git add index.html css/screens/entertainment.css
git commit -m "feat: redesign entertainment, music, and YouTube screens"
```

---

## Task 13: Phase 10 — Global UX polish pass

**Files:**
- Modify: `css/base.css`, `css/components.css`, `css/tokens.css`, all screen CSS files as needed

- [ ] **Step 1: Contrast audit**

Check all instances of `var(--text-dim)` / `var(--muted)`. The current `rgba(232,234,246,0.55)` against `#080d1e` bg gives ~3.2:1. Bump to `rgba(232,234,246,0.72)` to reach ≥4.5:1.

In `css/tokens.css`, update:
```css
--text-dim: rgba(232,234,246,0.72);
--muted: rgba(232,234,246,0.72);
```

- [ ] **Step 2: Focus-visible states**

Add to `css/components.css`:
```css
.nav-btn:focus-visible,
.card-clickable:focus-visible,
.seg-pill-btn:focus-visible,
.settings-nav-btn:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Screen title consistency audit**

Check every screen in `index.html` that has `<div class="screen-title">`. Ensure all use the same class and no inline `font-size`/`color` overrides are present. Remove any inline styles on `.screen-title` elements.

- [ ] **Step 4: Card padding consistency audit**

Grep `index.html` for `style="padding` inside `.card` elements. Replace with `class="card"` using `--card-pad` from the CSS default. Remove inline padding overrides.

- [ ] **Step 5: Visual check — all screens**

Navigate through every screen. Confirm no regressions from the polish changes.

- [ ] **Step 6: Commit**

```bash
git add css/
git commit -m "polish: contrast, focus states, card padding consistency"
```

---

## Task 14: Phase 11 — Visual QA against Figma

**Files:**
- Modify: Any screen CSS/HTML where deltas are found

- [ ] **Step 1: QA each screen against its Figma frame**

For each screen in the Node ID Reference table, run `mcp__figma__get_screenshot` and open the live app side-by-side. Document deltas.

Key things to check per screen:
- Typography sizes and weights match
- Card radius and padding consistent
- Status bar alignment (day/time left, icons right)
- Bottom dock centered, pill shape intact
- Colors match Figma swatches

- [ ] **Step 2: Fix all identified deltas**

Apply CSS/HTML corrections for each delta found. Group related fixes in a single commit per screen.

- [ ] **Step 3: Final regression check**

Navigate through all 19 screens. Check browser console for errors (F12). Verify maps still load. Verify all `onclick` handlers work.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "fix: visual QA corrections across all screens"
```

---

## Completion Checklist

- [ ] .gitignore in place, .claude/ untracked
- [ ] CSS split into tokens/base/components/screens/*
- [ ] JS split into state/navigation/ui/screens/init modules
- [ ] Design tokens aligned with Figma
- [ ] Bottom dock redesigned as floating pill
- [ ] Segmented pill component added and used in Settings
- [ ] All 5 Settings tabs use left sidebar layout
- [ ] Home screen polished with token system
- [ ] Engine, Performance, Issues, Fault redesigned
- [ ] Battery and Charging redesigned (maps preserved)
- [ ] Navigation redesigned (maps preserved)
- [ ] Climate and Driving redesigned (dial preserved)
- [ ] Entertainment, Music, YouTube redesigned
- [ ] Contrast ≥4.5:1 on muted text
- [ ] Focus-visible states on interactive elements
- [ ] No console errors
- [ ] All Figma frames QA'd side-by-side
