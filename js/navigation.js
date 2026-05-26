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
