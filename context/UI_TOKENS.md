# UI Tokens

Design variables for Opal Labs: the app theme (`styles/theme.ts`) and the homepage tokens
(`components/Landing/landing.module.css`). Use these values instead of new ones; update this file when a token changes.

## App theme (`getTheme('light' | 'dark')`)

| Token                    | Light                 | Dark                    |
| ------------------------ | --------------------- | ----------------------- |
| background.default       | `#FFFFFF`             | `#191919`               |
| background.paper         | `#FFFFFF`             | `#232323`               |
| text.primary / secondary | `#2F3437` / `#787774` | `#E8E8E6` / `#9B9B98`   |
| primary                  | `#1A9E7E`             | `#54D8B3` (brand mint)  |
| sidebar.background       | `#F7F7F5`             | `#202020`               |
| divider                  | `rgba(55,53,47,.09)`  | `rgba(255,255,255,.09)` |

- Font: Inter (`next/font`), mono for code `"JetBrains Mono", Menlo`. Radius 8 (menus 10, dialogs 14).
- Block text colours and highlights: `TEXT_COLORS` / `HIGHLIGHT_COLORS` in `lib/blocks/styling.ts` (readable in both modes).
- Page covers: `COVERS` in `lib/blocks/covers.ts`.

## Homepage

| Token                      | Light                                                   | Dark                                                     |
| -------------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| `--paper`                  | `#efebe3`                                               | `#0f0f0f`                                                |
| `--ink`                    | `#0d0d0d`                                               | `#efebe3`                                                |
| `--muted`                  | `#6b665e`                                               | `#9b968c`                                                |
| `--iris` (text on page bg) | deep: `#0fb38a → #2f80ff → #7b4dff → #ff3ea5 → #ff9f1c` | light: `#54d8b3 → #7cc8ff → #b69cff → #ff8fd1 → #ffd27a` |

- `.onInk` sections swap to the inverse tokens (`--muted-inv`, `--line-inv`, `--iris-inv`).
- Type: Bricolage Grotesque 800 (`'wdth' 78`, letter-spacing −0.03em) for display, Instrument Serif italic for accents, JetBrains Mono 12 px uppercase for labels, Inter for body.
- Brand: `public/logo.svg` (iridescent opal), favicons generated from it; Open Graph image `public/og-image.png` (1280×640).
