# Subagents-First — React → Astro Migration

Demo setup for the "AI tools applied to development" course. One `/migrate-react-to-astro`
prompt dispatches an Orchestrator that fans the migration out to one `component-migrator`
per source file, then hands the result to a read-only `astro-verifier` before reporting.

**Stacks:** `react-app/` Vite 8 + React 19 + TS strict · `astro-site/` Astro 5 + TS strict

---

## How to run the demo

Use the `migrate-react-to-astro` prompt (or the `/migrate-react-to-astro` slash command).

| Phase | What happens |
|---|---|
| **1. Convert** | One `component-migrator` per source file, in parallel, each owning one target `.astro` file. |
| **2. Verify** | One read-only `astro-verifier` runs `npm run check` + `npm run build` and diffs structure. |
| **3. Report** | Orchestrator prints the Migration Report (source → target matrix + verify status). HALT. |

The authoritative mapping and acceptance criteria are in `docs/migration-plan.md`.

---

## Worked example — what one unit looks like

```tsx
// react-app/src/components/Header.tsx  (SOURCE — read-only)
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

```astro
---
// astro-site/src/components/Header.astro  (TARGET)
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

Three edits only: `NAV_ITEMS` → frontmatter, `className` → `class`, drop the React `key`.
Everything else is identical. The full worked set is in
`.github/skills/migrate-component/SKILL.md`, Step 3.

## React → Astro mapping (short version)

| React | Astro |
|---|---|
| `interface XProps { ... }` | `interface Props { ... }` + `const { ... } = Astro.props` |
| `className=` | `class=` |
| `key={...}` in `.map()` | drop it |
| `import { X } from './X'` | `import X from './X.astro'` (default) |
| `style={{ ... }}` (static) | a class in `styles.css` |
| `new Date().getFullYear()` in render | move to the frontmatter |
| `useState` / `useEffect` | not needed here — stop and report if you think otherwise |

---

## Agents

| Agent | Dispatched when | Tools |
|---|---|---|
| `component-migrator` | Phase 1, one per source file, in parallel | read, search, edit |
| `astro-verifier` | Phase 2, once, read-only | read, search, execute |

---

## Prompts (reusable slash commands)

| Prompt | Use when |
|---|---|
| `migrate-react-to-astro` | Running the full migration |
| `component-migrator` | Acting as a conversion subagent |
| `astro-verifier` | Acting as the read-only verifier |

---

## Skills

Skills live in `.github/skills/<name>/SKILL.md`.

| Skill | Used by |
|---|---|
| `migrate-react-to-astro` | The Orchestrator |
| `migrate-component` | `component-migrator` agent |

---

## Instructions (auto-loaded by file pattern)

| File | Applied to |
|---|---|
| `astro-components.instructions.md` | `astro-site/src/**/*.astro` |
| `react-app-readonly.instructions.md` | `react-app/**` |

---

## Prerequisites

- Node 20+ and npm.
- `npm install` in both `react-app/` and `astro-site/`.
- Start from `main` with a clean working tree.
