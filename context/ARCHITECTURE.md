# Architecture

How the Opal Labs frontend is put together: services it talks to, the auth flow, the data layer and the block editor.
Read before changing auth, storage, the editor or anything that crosses the frontend/backend boundary.
Update when a flow or a key file changes; keep to facts that aren't obvious from a single file.

## Services

- **This app** → Vercel. Env: `NEXT_PUBLIC_BACKEND_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SECRET` (next-auth, must match the API's `SECRET`), `NEXTAUTH_URL`.
- **API** (`Opal-Labs-Backend` repo) → Render free tier, sleeps when idle (~50 s cold start). The homepage pings `GET /health` on load to start waking it.
- **DB**: Neon Postgres, owned by the API. Tables `users`, `pages`, `elements`.

## Auth flow

1. Google sign-in via next-auth (`pages/api/auth/[...nextauth].ts`). Its server-side `jwt` callback POSTs the Google tokens to the API's `/user-login`.
2. The API returns `{token}`, an HS256 JWT `{user_id, exp: 30d}`; next-auth keeps it as `session.userToken`.
3. `lib/data/remote.ts` sends it as `Authorization: Bearer`. A 401 with a token signs the user out.

- Logout revokes the Google token only; the JWT stays valid until it expires (accepted gap).

## Data layer (`lib/data/`)

- `types.ts` `DataSource` interface; `remote.ts` (API, `keepalive` on small POSTs so unload saves land) and `guest.ts` (localStorage key `opal-guest-v1`, in-memory fallback).
- `mode.ts`: `opal-mode=guest` flag; `getDataSource()` picks the store. The homepage "Demo" sets it; a real session clears it.
- `welcomeTemplate.ts` copies the API's `controllers/templates/welcome/*.json`; keep both in sync.
- `/live/[uuid]` reads the guest store first when the page exists locally (guest publishing works in the same browser only).

## Editor and blocks

- A block = API element `{element_uuid, type, content, elementStyling}`. Type strings (legacy ones included: `iFrame`, `Nested Page`, `Checkbox`, `Page Analytics`) live in `lib/blocks/types.ts`; unknown types render as text.
- Text styling string (`"normal; color: #x; background-color: y; bold italic underline strikethrough checked"`) is read/written only by `lib/blocks/styling.ts`, which accepts everything older versions wrote. Code blocks: `"theme: x; language: y"`. Callouts: the emoji. Images: the caption. Sub-page blocks: the child page uuid.
- `components/Editor/index.tsx` owns keyboard handling, the slash menu, markdown shortcuts and dnd-kit sorting; blocks read handlers from `EditorContext`. `BlockRenderer` is shared with published pages (read-only context) and the homepage playground.
- `hooks/Page/usePageEditor.ts` loads the open page and autosaves (700 ms debounce; saves are serialised, flushed on page switch/unload, dropped for a page being deleted).
- Page extras live in the page `etc` JSON: `{icon, cover, fullWidth, locked}` (API page-update accepts `page.etc`).
- Dashboard selection is kept in state and mirrored to the URL (`/dashboard?page=<uuid>`); it is read from `window.location` on load and on back/forward, never from `router.query` (right after the client-side jump from the homepage Next drops shallow updates from `router.query`, which made new pages hijack the selection). The sidebar tree is built from `parent_page_uuid`.

## Homepage (`pages/index.tsx`, `components/Landing/`)

- `OpalCanvas` is a raw WebGL fragment shader (no libraries): renders below screen resolution (≤ ~1 MP), pauses off screen / in hidden tabs, one frame for reduced motion, CSS fallback without WebGL.
- `LiveDemo` (the real editor with local state) is loaded with `next/dynamic` (`ssr: false`) to keep the first load light.
- Light/dark follows the app's theme preference (`contexts/ColorMode`, localStorage `opal-theme`); CSS keys off `html[data-theme]`, which `_document` sets before paint.
