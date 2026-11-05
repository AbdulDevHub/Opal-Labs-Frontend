# Progress Tracker

Where the Opal Labs frontend stands and what's next, so a new session can pick up without rediscovery.
Update "Current state" and "Next steps" and add a dated session-log entry after each work session.
Collapse old log entries into "Earlier history" once they stop mattering. Backend state lives in the API repo's tracker.

## Current state

- Live at https://opal-labs.vercel.app; CI green (lint/typecheck + 19 Playwright tests in `home`, `guest` and `workspace` specs covering the homepage, theme, playground, 404, editor, sidebar, sub-pages, page options, templates and the mobile drawer).
- Block editor, autosave, page tree, publishing, templates, icons/covers, light/dark/system theme all shipped (Nov 2026 redesign).
- Homepage: editorial poster with a WebGL opal, playable editor, light/dark switch; new opal logo, favicons and `public/og-image.png`.
- Custom 404 page in the homepage style (opal as the zero, random quip, the missing path).
- Production not yet re-tested while signed in with Google since the redesign (guest mode tested).

## In progress

- Nothing.

## Next steps

1. Upload `public/og-image.png` as the repo's social preview (GitHub Settings → General → Social preview; no API for it).
2. Sign in on production and check: icon/cover persist after reload, publish toggle + live link, sub-pages, delete.
3. Idea: copy guest pages into the account after signing in with Google (guest data currently stays in the browser).
4. Idea: inline (per-word) formatting and links (styling is per block today); nested lists; undo across blocks.
5. Optional: re-enable `.github/workflows/keep_backend_awake.yml` (GitHub disabled the schedule; it pings `/health` every 14 min).
6. Optional cleanup: old `public/images/opal.png` and `Logo/` files are unused by the app (README still uses some).

## Session log

### 2026-11-05: 404 page, test coverage, cleanup

- Custom `pages/404.tsx` (+ `components/Landing/notFound.module.css`); homepage fonts moved to `components/Landing/fonts.ts` so both pages share them.
- Removed unused deps (`@hookform/resolvers`, `@mui/styles`, `googleapis`, `react-dnd`, `react-dnd-html5-backend`, `react-hook-form`, `react-iframe`, `styled-components`, `uuid.v4`, `zod`, `sass`); Playwright 1.42 → 1.64 (dev dependency), CI on ubuntu-latest.
- New `tests/workspace.spec.ts` + more in `home.spec.ts` (19 tests). They found three bugs, now fixed: sidebar Rename closed instantly (menu focus trap stole focus; rename now starts after the menu closes); `usePageCreate` wrote back a stale page list; after entering from the homepage the dashboard ignored `?page=` and opened the newest page (a new sub-page hijacked its parent). Selection now lives in state, mirrored to the URL.

### 2026-11-04 (late night): homepage polish, dark mode, brand

- Fixed the clipped "y" descender and touching letters in the hero; the opal now overlaps the headline on wide screens.
- Homepage light/dark switch (paper and ink swap; follows the app theme preference, no flash on load). Dark mode shows the dark playground card and the light app screenshot.
- New iridescent opal logo (`public/logo.svg`), `favicon.ico` (16+32), `apple-touch-icon.png`, and a 1280×640 Open Graph image; `_document` points og/twitter images at it.
- Opal shader capped at ~1 MP render size (it was heavy for software GL in tests). Sign-in e2e test waits up to 20 s.
- Agent context moved into this repo (`AGENTS.md`, `CLAUDE.md`, `context/`) from the old shared workspace folder.

### 2026-11-04 (late night): homepage redesign

- Homepage rebuilt in `components/Landing/` (WebGL `OpalCanvas`, Bricolage Grotesque + Instrument Serif + JetBrains Mono, mix-blend headline, crossing marquees, `LiveDemo` playground, numbered features, scroll-tilt screenshot, count-up stats, colophon, giant footer wordmark). Guest button renamed "Demo"; block spacing loosened.

### 2026-11-04 (night): app redesign

- New block editor, autosave (`usePageEditor`), dashboard (sidebar tree, breadcrumbs, share popover, page options, palette, shortcuts, templates, icons/covers), light/dark theme, published page with table of contents. Old element/toolbar components removed. Reviewer pass: fixed overlapping saves, unload save, saves after delete.

### Earlier history

- Revival on 2026-11-04: auth switched from cookies to `Authorization: Bearer` (frontend and API are on different sites); guest mode added (browser-only localStorage, user's choice over temporary backend accounts); dead `apiUseless/`, extra contexts and react-query removed; Playwright CI fixed (Chromium only, ubuntu-22.04, `yarn start` webServer); keep-awake workflow pings `/health`; guests can open other people's published pages (read from the API).
