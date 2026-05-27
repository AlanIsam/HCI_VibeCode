# Snoopy — HCI Dashboard Redesign Plan
**Date:** 2026-05-27  
**Branch:** Justin  
**Figma source:** [snoopy - hci milestone 3 (Copy)](https://www.figma.com/design/j4y3k4r4VAuBf9kfRGvHuQ/snoopy---hci-milestone-3--Copy-?node-id=159-64)

---

## 1. Goal

Perform a faithful redesign of all 19 dashboard screens to align with the Figma file, while preserving the full functional foundation:

- Vanilla HTML / CSS / JS — no build step
- All existing screen IDs (`id="screen-*"`) and JS event handlers kept intact
- Lucide icons + Leaflet maps loaded via CDN remain unchanged
- Deployed via Laragon locally; static file deploy to Vercel or Docker/nginx

Additionally: clean repo organization, extract a design token system from Figma, and add a `.gitignore` to exclude AI tooling artifacts.

---

## 2. Repository Reorganization

### New structure

```
HCI_VibeCode/
├── index.html                  # Single monolithic HTML (all screens inline)
├── css/
│   ├── tokens.css              # Design tokens: colors, spacing, radii, fonts
│   ├── base.css                # Reset, body, status bar, content area, layout
│   ├── components.css          # Shared components: cards, dock, pills, switches, tabs
│   └── screens/
│       ├── home.css
│       ├── battery.css
│       ├── charging.css
│       ├── navigation.css
│       ├── climate.css
│       ├── driving.css
│       ├── engine.css
│       ├── performance.css
│       ├── issues-fault.css
│       ├── entertainment.css
│       └── settings.css
├── js/
│   ├── state.js                # Shared mutable state (currentScreen, sidebar flags)
│   ├── navigation.js           # navigate(), goBack(), sidebar open/close, recent apps
│   ├── ui.js                   # Lucide init, segmented pill toggles, clock tick
│   └── screens/
│       ├── battery.js
│       ├── charging.js         # Leaflet + charging station logic
│       ├── navigation-map.js   # Leaflet + route/location logic
│       ├── music.js
│       └── settings.js
├── assets/
│   └── icons/                  # Placeholder for any local SVG/image assets
├── docs/
│   └── redesign-plan.md        # This document (tracked in git)
├── .gitignore
├── Dockerfile
├── nginx.conf
└── vercel.json
```

### Rules
- `index.html` loads CSS and JS in the order above (tokens → base → components → screens, then state → navigation → ui → screens).
- No bundler, no npm. Works on `file://` and Laragon.
- Screen CSS files are screen-scoped: selectors prefixed or nested under `#screen-*`.

---

## 3. Design System (Tokens + Components)

### 3.1 Color tokens (`tokens.css`)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0a1838` | Page background |
| `--panel` | `#10244a` | Cards, panels |
| `--panel-hover` | `#162e5a` | Hover state for clickable cards |
| `--border` | `rgba(255,255,255,0.08)` | Card borders, dividers |
| `--cyan` | `#00d4ff` | Primary accent, active states |
| `--blue` | `#3d6fff` | Secondary accent, gradients |
| `--text` | `#e8eaf6` | Primary text |
| `--muted` | `rgba(232,234,246,0.55)` | Secondary text (min 4.5:1 contrast) |
| `--good` | `#4caf50` | Positive status |
| `--warn` | `#ff9800` | Warning status |
| `--danger` | `#f44336` | Error / fault status |

### 3.2 Spacing & radii tokens

| Token | Value |
|---|---|
| `--r-sm` | `8px` |
| `--r-md` | `12px` |
| `--r-lg` | `16px` |
| `--r-xl` | `24px` |
| `--r-pill` | `9999px` |
| `--gap` | `16px` |
| `--card-pad` | `20px 24px` |

### 3.3 Typography tokens

- Primary font: `Rajdhani, sans-serif` (loaded via CDN)
- Mono font: `JetBrains Mono, monospace` (loaded via CDN)
- Scale: `--text-xs:11px`, `--text-sm:13px`, `--text-md:15px`, `--text-lg:18px`, `--text-xl:24px`, `--text-2xl:32px`

### 3.4 Shared Components (`components.css`)

| Component | Description |
|---|---|
| `.card` | Dark panel with `--panel` bg, `--r-lg` radius, `--card-pad` padding, `--border` border |
| `.card-clickable` | Adds hover lift + cursor pointer |
| `.bottom-dock` | **New** — sticky pill-shaped bar at bottom of every screen |
| `.dock-btn` | Circular icon button inside dock |
| `.segmented-pill` | **New** — two-option pill toggle (e.g. Battery/Distance) |
| `.settings-sidebar` | Vertical tab list for all settings screens |
| `.settings-nav-btn` | Tab item with active indicator |
| `.toggle-switch` | Sliding boolean switch (Bluetooth etc.) |
| `.screen-title` | Unified heading treatment: icon + text, 24px Rajdhani |
| `.comp-row` | Icon + label + value row (used in Battery, Engine, etc.) |
| `.status-badge` | Colored dot + text for issue/fault statuses |

---

## 4. Per-Screen Redesign Approach

For each screen:
1. Pull the Figma frame screenshot via `mcp__figma__get_screenshot`.
2. Identify layout grid, card positions, component types.
3. Rewrite the `<section id="screen-*">` block in `index.html` to match Figma layout.
4. Write or update the screen's CSS file under `css/screens/`.
5. Verify JS handlers still work (no `id` or class changes that break `app.js`).
6. Visual QA: browser side-by-side with Figma screenshot.

---

## 5. UX Improvements (beyond literal Figma fidelity)

The following improvements are applied wherever the Figma design is inconsistent or leaves gaps:

1. **Global bottom dock** — Figma shows this on Settings screens. Apply to all screens so navigation is always one tap away. Contains: mute, volume-up, home, back, mail/notifications, settings.
2. **Settings sidebar** — Move horizontal tab buttons to left vertical sidebar (matches Figma Settings frames).
3. **Segmented pill toggles** — Replace Display/Distance/Tire-Pressure radio inputs with pill segments.
4. **Consistent card padding/radius** — Audit all screens; enforce `--card-pad` and `--r-lg` everywhere.
5. **Muted text contrast** — Bump `--muted` opacity so all secondary text meets ≥4.5:1 WCAG AA.
6. **Screen-title consistency** — All screens use the `.screen-title` component (icon + heading). Remove inline `font-size`/`color` overrides.
7. **Focus/hover states** — Add visible `:hover` and `:focus-visible` on all `.card-clickable` and `.dock-btn` elements.
8. **Active state highlight** — Active screen button in bottom dock gets cyan fill + glow.

---

## 6. `.gitignore`

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

# OS / editor
Thumbs.db
.DS_Store
.vscode/
.idea/
*.swp
*~
```

**Action:** `git rm --cached .claude/settings.local.json` to untrack it without deleting the file locally.

---

## 7. Execution Phases

Each phase ends with a commit. Preview at `http://localhost/HCI_VibeCode` via Laragon after each phase.

| Phase | Work | Commit message |
|---|---|---|
| 0 | Add `.gitignore`, untrack `.claude/`, create `docs/` and `assets/` scaffold | `chore: add .gitignore, untrack AI artifacts` |
| 1 | Split CSS into `tokens.css + base.css + components.css + screens/*`, split JS into modules. Visual regression check — no appearance change expected. | `refactor: split CSS/JS into modules` |
| 2 | Extract design tokens from Figma, apply to `tokens.css`. Update `base.css` and `components.css` to use tokens. Add global bottom dock. | `feat: design tokens + global bottom dock` |
| 3 | Redesign all 5 Settings sub-tabs (Display, Bluetooth, Network, Time, System) | `feat: redesign settings screens` |
| 4 | Redesign Home screen | `feat: redesign home screen` |
| 5 | Redesign Engine, Performance, Issues, Fault | `feat: redesign status/diagnostic screens` |
| 6 | Redesign Battery + Charging (preserve Leaflet map) | `feat: redesign battery and charging screens` |
| 7 | Redesign Navigation screen (preserve Leaflet map) | `feat: redesign navigation screen` |
| 8 | Redesign Climate (cabin + AC) + Driving Mode | `feat: redesign climate and driving screens` |
| 9 | Redesign Entertainment, Music, YouTube | `feat: redesign entertainment screens` |
| 10 | Global UX polish pass: contrast audit, hover/focus states, spacing consistency | `polish: UX consistency and accessibility pass` |
| 11 | Visual QA: each screen vs Figma screenshot. Fix any deltas. | `fix: visual QA corrections` |

---

## 8. Verification Strategy

- **Per-phase:** Load the app in Laragon after each commit. Navigate through all affected screens. Check for JS errors in the browser console.
- **Per-screen QA:** Side-by-side comparison — Figma frame screenshot (via `mcp__figma__get_screenshot`) vs the running app.
- **Regression:** After each phase, navigate through all _previously completed_ screens to confirm nothing broke.
- **No automated tests** — matches existing project scope.

---

## 9. Out of Scope

- No new screen functionality (no real Bluetooth pairing, no real network settings, etc.)
- No font loading changes — Rajdhani and JetBrains Mono stay on CDN
- No backend, no API calls
- No dark/light theme toggle (currently dark-only; Figma is dark-only)
- No responsive/mobile breakpoints (fixed 1366px viewport)
