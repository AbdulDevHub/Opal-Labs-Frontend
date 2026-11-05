# UI Rules

Layout, composition and accessibility rules for the Opal Labs UI (the app at /dashboard, published pages at /live
and the homepage). Follow these when adding or changing screens so the product stays consistent.
Update when a rule changes or a new recurring pattern appears.

## App (dashboard, published pages)

- Calm, Notion-like: neutral surfaces, content first. Use theme tokens (`theme.palette.*`, `sidebar.*`), never per-component hex colours.
- Page column: max 820 px (full width optional per page), side padding 24 px on phones and 96 px from `sm` up so the block gutter (+ and ⋮⋮, 54 px left of the text) fits.
- Sidebar 264 px; below `md` it becomes a temporary drawer opened from the top bar.
- Block spacing comes from `blockSpacing` / `blockSpacingBelow` in `components/Editor/BlockRenderer.tsx`; change it there, not per block.
- Dialogs instead of browser `confirm`/`alert` (`components/Shared/ConfirmDialog`). Toasts via `useToast()` for results of actions.
- Every icon-only button needs an `aria-label`; keyboard paths must exist for mouse actions (shortcut list in `components/Dashboard/ShortcutsDialog.tsx`).

## Homepage

- Editorial poster look: warm paper / ink sections, huge display type, mono labels numbered `(01)`, `(02)`… Keep new sections in that system (`components/Landing/landing.module.css`).
- Colour-flipping text uses `mix-blend-mode: difference` with white text. It only works when no ancestor between the text and the page creates a stacking context: no `z-index`, `transform`, `filter` or `isolation` on those ancestors (the opal canvas uses `z-index: 0` and comes first in the DOM).
- The nav logo sits outside the blended nav so it keeps its own colours.
- Motion: reveal on scroll via `data-reveal`, magnetic buttons via `magnetic`, all disabled by the global `prefers-reduced-motion` rule.
- Phones: the nav hides "Log In" under 560 px (the hero has "Continue with Google"); check 390 px width after layout changes.
