# Migration plan — React → Astro

The authoritative input to `/migrate-react-to-astro`. One row per **conversion unit**: one
source file, one target file, one owner.

## Mapping

| # | Source | Target | Notes |
|---|---|---|---|
| M1 | `react-app/src/components/Header.tsx` | `astro-site/src/components/Header.astro` | `const NAV_ITEMS` array moves into the frontmatter; `.map()` becomes JSX-in-template |
| M2 | `react-app/src/components/Hero.tsx` | `astro-site/src/components/Hero.astro` | Props interface → `interface Props` in frontmatter + `Astro.props` |
| M3 | `react-app/src/components/PostCard.tsx` | `astro-site/src/components/PostCard.astro` | Single `post` prop; keep the `<article>` shape |
| M4 | `react-app/src/components/Footer.tsx` | `astro-site/src/components/Footer.astro` | `new Date().getFullYear()` runs at build time in the frontmatter |
| M5 | `react-app/src/data/posts.ts` | `astro-site/src/lib/posts.ts` | Plain TypeScript — strip the React-agnostic types as-is; no `.astro` file |
| M6 | `react-app/src/App.tsx` | `astro-site/src/pages/index.astro` | Composes Header, Hero, the post list and Footer; imports the migrated components |

## Rules that apply to every unit

- The target path for a unit is **exactly** the one in the table. Do not add, rename or split files.
- Preserve the rendered markup and class names exactly. This is a framework swap, not a redesign.
- Props are preserved: same names, same shape. Astro components receive them via `Astro.props`.
- No client-side JS unless a unit genuinely needs interactivity — none of these six do. Do not
  use `.vue`/`client:*` directives.
- The React source is **read-only**. Never edit anything under `react-app/`.

## Acceptance criteria (the verifier checks all of these)

- [ ] M1–M6 all exist at their target paths.
- [ ] `cd astro-site && npm run check` exits 0.
- [ ] `cd astro-site && npm run build` exits 0.
- [ ] `astro-site/src/pages/index.astro` renders Header → Hero → post list → Footer, in that order.
- [ ] The post list contains one `PostCard` per entry in `data/posts.ts` (3 entries).
- [ ] Rendered headings, links and class names match the React source.
- [ ] `react-app/` is byte-for-byte unchanged.
