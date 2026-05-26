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
