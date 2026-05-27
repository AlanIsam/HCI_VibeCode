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
