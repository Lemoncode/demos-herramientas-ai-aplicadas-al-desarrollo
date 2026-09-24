---
name: migrate-component
description: Use this skill when dispatched as a component-migrator subagent. Converts exactly one React source file into one Astro target file following a rigid read → map → write → self-check sequence, with a full worked React→Astro example, then returns a structured contract the Orchestrator aggregates into the Migration Report.
---

# migrate-component

**Type: Rigid.** Every step runs in order.

You are a Component Migrator. Your prompt names one conversion unit. You own exactly one
target file. Your job: read the React source, convert it to Astro, write the target, self-check,
and return a structured result.

---

## Step 0 — Pre-flight

Parse your prompt. It MUST contain:

| Field | Example |
|---|---|
| `unit_id` | `M2` |
| `source` | `react-app/src/components/Hero.tsx` |
| `target` | `astro-site/src/components/Hero.astro` |
| `brief` | the plan's notes cell for this unit |

Read `docs/migration-plan.md` and confirm your unit matches a row there. If it does not, stop
and return `migrated: false` with `blocked_by`.

---

## Step 1 — Read the source

Read `source` completely. Note:

- the component's **props** — names, types, optionality,
- the **rendered markup** — elements, class names, nesting,
- any **module-level constants** (e.g. `NAV_ITEMS`) — they move into the frontmatter,
- any **expressions** (`{new Date().getFullYear()}`, `.map(...)`) — they move into the
  frontmatter or stay inline as Astro template expressions.

---

## Step 2 — Map React → Astro

| React | Astro |
|---|---|
| `interface XProps { ... }` | `interface Props { ... }` in the frontmatter |
| `export function X({ a, b }: XProps)` | `const { a, b } = Astro.props` in the frontmatter |
| `export function X()` (no props) | no props destructure needed |
| `{value}` in JSX | `{value}` in the Astro template — same syntax |
| `className=` | `class=` (Astro uses plain HTML attributes) |
| `key={...}` inside `.map()` | drop it — Astro needs no key |
| `{array.map(x => <El .../>)}` | `{array.map((x) => <El ... />)}` — same, in the template |
| `import { X } from './X'` | `import X from './X.astro'` (default import) |
| `import type { Post } from '...'` | same import in the frontmatter |
| `style={{ ... }}` → static | convert to a class in `styles.css` |
| `new Date().getFullYear()` in render | move to the frontmatter |
| `useState` / `useEffect` | none of these units need them — if you think you do, stop and report |

**Do not** add `client:*` directives, framework integrations, or any interactivity.

---

## Step 3 — Worked example (the shape to produce)

**Source — `react-app/src/components/Header.tsx` (unit M1):**

```tsx
const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export function Header() {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="/">Acme</a>
      <nav className="site-header__nav" aria-label="Main">
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
```

**Target — `astro-site/src/components/Header.astro`:**

```astro
---
const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]
---

<header class="site-header">
  <a class="site-header__brand" href="/">Acme</a>
  <nav class="site-header__nav" aria-label="Main">
    <ul>
      {NAV_ITEMS.map((item) => (
        <li>
          <a href={item.href}>{item.label}</a>
        </li>
      ))}
    </ul>
  </nav>
</header>
```

What changed: `NAV_ITEMS` moved into the frontmatter, `className` → `class`, the `key` was
dropped. What did **not** change: every element, every class name, the accessible name on the
`<nav>`.

### Props example — `Hero.tsx` (unit M2) → `Hero.astro`

```tsx
// before
interface HeroProps {
  title: string
  subtitle: string
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="hero">
      <h1 className="hero__title">{title}</h1>
      <p className="hero__subtitle">{subtitle}</p>
    </section>
  )
}
```

```astro
---
// after
interface Props {
  title: string
  subtitle: string
}

const { title, subtitle } = Astro.props
---

<section class="hero">
  <h1 class="hero__title">{title}</h1>
  <p class="hero__subtitle">{subtitle}</p>
</section>
```

### Build-time expression — `Footer.tsx` (unit M4) → `Footer.astro`

```astro
---
// after — the year is computed at build time, no useEffect
const year = new Date().getFullYear()
---

<footer class="site-footer">
  <p class="site-footer__copy">© {year} Acme</p>
  <ul class="site-footer__links">
    <li><a href="/privacy">Privacy</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</footer>
```

### Non-`.astro` unit — `data/posts.ts` (unit M5)

When `target` is `astro-site/src/lib/posts.ts`, write **plain TypeScript**: no frontmatter,
no `.astro`. Copy the types and data as-is.

```ts
export interface Post {
  slug: string
  title: string
  excerpt: string
}

export const posts: Post[] = [
  { slug: 'shipping-fast', title: '...', excerpt: '...' },
]
```

---

## Step 4 — Write the target

- Keep the **exact** rendered markup and class names from the source.
- If `target` is a `.astro` component, it is a `---` frontmatter block then the template.
- Preserve imports, pointing siblings at their **new** target paths
  (`import Header from '../components/Header.astro'`).

---

## Step 5 — Self-check

Before returning, confirm all of these about your target file:

- [ ] No `import React`, no `useState`, no `useEffect`, no `className=`, no `key=`, no `.tsx` import path remains.
- [ ] Every prop the source received is read from `Astro.props` with the same name.
- [ ] Class names are identical to the source.
- [ ] Sibling imports point at the new target paths (default imports for `.astro`).

If a check fails, fix the target and re-run the self-check. Do not return a failing target.

---

## Step 6 — Return contract

**On success:**

```json
{
  "unit_id": "M2",
  "source": "react-app/src/components/Hero.tsx",
  "target": "astro-site/src/components/Hero.astro",
  "migrated": true,
  "files_written": ["astro-site/src/components/Hero.astro"]
}
```

**On failure** (source missing, unit not in the plan, target path would collide):

```json
{
  "unit_id": "M2",
  "source": "react-app/src/components/Hero.tsx",
  "target": "astro-site/src/components/Hero.astro",
  "migrated": false,
  "blocked_by": "<short reason>"
}
```

Return the JSON and stop. **Do not run the build** (that is the Verifier's job) and **do not
touch any file other than `target`.**

---

## Hard constraints

- Exactly one file written: `target`.
- Never edit anything under `react-app/` — the source is read-only.
- Do not run `npm run build`, `npm run check`, or any project script.
- Do not create extra files, tests, or directories.
