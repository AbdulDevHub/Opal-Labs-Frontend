# AGENTS.md

Context for AI coding agents working on the Opal Labs **frontend** (the Go API lives in the separate
`Opal-Labs-Backend` repo). Read this first, then `context/` for depth.
After any meaningful change to this project, update this file, `context/PROGRESS_TRACKER.md`, and the
"Project Overview" section of `README.md` to reflect the current state — do this proactively, without being asked.

## Overview

Notion-style notes app (portfolio piece). Live at https://opal-labs.vercel.app (Vercel), talking to the Go API on Render
(https://opal-labs-backend-muej.onrender.com, Postgres on Neon). A browser-only guest mode ("Demo") needs no account.

## Tech stack

Next.js 13.5 **pages router**, React 18, TypeScript, MUI 5, dnd-kit, react-ace, Recharts, emoji-picker-react,
next-auth 4 (Google), Storybook 7, Playwright 1.42 (CI pinned to ubuntu-22.04).

## Commands

- Install: `npx --yes yarn@1.22.22 install` (no global yarn on the dev machine)
- Dev: `npx next dev` · Build: `npx next build` · Start: `npx next start`
- E2E: `npx playwright test` (its webServer runs `yarn start`; without global yarn start `npx next start -p 3000` first and it reuses it). `PLAYWRIGHT_BASE_URL=https://opal-labs.vercel.app npx playwright test` tests production.
- Verify: npx tsc --noEmit && npx next lint

## Conventions & constraints

- All data access goes through `getDataSource()` in `lib/data/` (backend or guest localStorage). Never `fetch` the backend directly; hooks in `hooks/` keep their signatures.
- Auth: backend JWT kept as `session.userToken` by next-auth, sent as `Authorization: Bearer`. Never switch to cookies (frontend and API are on different sites).
- Guest data must mirror backend response shapes (`content: {text}`, `etc: {text}`); frontend `elementStyling` == backend `etc.text`.
- Block types are stored in a `varchar(20)` column: never rename existing type strings. Styling strings are parsed only by `lib/blocks/styling.ts`. See `context/ARCHITECTURE.md`.
- MUI imports must be path imports (`@mui/material/Box`); the package root is a lint error. App colours come from `styles/theme.ts`; the homepage uses its own CSS module tokens (`context/UI_TOKENS.md`).
- A Prettier hook may rewrite whole files on edit; imports must satisfy `simple-import-sort` (`npx eslint --fix <file>`).
- Commits use gitmoji + conventional type; pushing straight to `main` is fine (Vercel deploys on push).

## Boundaries

- `.env*` files are permission-blocked: don't read/write them; document env vars in `README.md` / `.env.example`.
- The repo is public: never commit secrets.

## More

- `README.md` — plain-language overview, setup, env vars.
- `context/PROGRESS_TRACKER.md` — current state, next steps, session log.
- `context/ARCHITECTURE.md` — auth flow, data layer, editor and block model.
- `context/UI_RULES.md`, `context/UI_TOKENS.md` — app and homepage design rules and tokens.
