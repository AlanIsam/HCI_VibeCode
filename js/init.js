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
