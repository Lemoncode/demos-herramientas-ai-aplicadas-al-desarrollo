# Subagents-First — React → Astro Migration

Demo setup for the "AI tools applied to development" course. Shows the **subagents-first**
approach: one `/migrate-react-to-astro` prompt dispatches an Orchestrator that fans the
migration out to one `component-migrator` subagent per source file, then hands the result
to a read-only `astro-verifier` before reporting.

The use case is a framework migration — a pile of independent, mechanical, parallelizable
conversions. That is exactly the shape of work where delegation pays off.

**Stacks:** `react-app/` Vite 8 + React 19 + TS strict · `astro-site/` Astro 5 + TS strict

> Sibling examples: [`ai-setup-example-instructions-first`](../ai-setup-example-instructions-first)
> (previous rung) and [`ai-setup-example-mcp-first`](../ai-setup-example-mcp-first) (next rung).

---

## How to run the demo

```
/migrate-react-to-astro
```

One prompt. The Orchestrator runs three phases and prints a Migration Report when done.

| Phase | What happens | Visible to the audience |
|---|---|---|
| **1. Convert** | One `component-migrator` per source file, dispatched in parallel. Each owns exactly one target `.astro` file. | 6 transcripts running concurrently |
| **2. Verify** | One read-only `astro-verifier` runs `npm run check` + `npm run build` in `astro-site/` and diffs rendered structure against the React source. | Verification report |
| **3. Report** | Orchestrator prints the Migration Report (source → target matrix, check/build status, verifier findings). HALT. | Migration Report on screen |

Stop condition: the Migration Report prints. Nothing else happens.

---

## The migration

See `docs/migration-plan.md` for the authoritative mapping and acceptance criteria.

| Source (`react-app/src/`) | Target (`astro-site/src/`) |
|---|---|
| `components/Header.tsx` | `components/Header.astro` |
| `components/Hero.tsx` | `components/Hero.astro` |
| `components/PostCard.tsx` | `components/PostCard.astro` |
| `components/Footer.tsx` | `components/Footer.astro` |
| `data/posts.ts` | `lib/posts.ts` (plain TS, no React) |
| `App.tsx` | `pages/index.astro` |

Each source file is owned by exactly one subagent, and each subagent writes exactly one
target file. Different files, different owners — so no two subagents ever write the same
file, and no worktree isolation is needed. (Contrast with
`subagents-delegation-example`, whose tickets *deliberately* share a file and therefore
must use `git worktree` isolation. The isolation mechanism follows the work, not the other
way round.)

---

## Worked example — what one unit looks like

**Source (`react-app/src/components/Header.tsx`):**

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

**Target (`astro-site/src/components/Header.astro`):**

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

Three edits only: `NAV_ITEMS` moved into the frontmatter, `className` → `class`, and the
React `key` was dropped. Everything else — every element, every class name, the accessible
name on `<nav>` — is identical. The full worked set (props, build-time expressions, the
plain-TS unit) is in `.claude/skills/migrate-component/SKILL.md`, Step 3.

---

## React → Astro mapping (the short version)

| React | Astro |
|---|---|
| `interface XProps { ... }` | `interface Props { ... }` in the frontmatter |
| `export function X({ a }: XProps)` | `const { a } = Astro.props` |
| `className=` | `class=` |
| `key={...}` in `.map()` | drop it |
| `import { X } from './X'` | `import X from './X.astro'` (default) |
| `style={{ ... }}` (static) | a class in `styles.css` |
| `new Date().getFullYear()` in render | move to the frontmatter |
| `useState` / `useEffect` | not needed here — if you think they are, stop and report |

---

## Agents

| Agent | Dispatched when | Tools |
|---|---|---|
| `component-migrator` | Phase 1, one per source file, in parallel | Read, Write, Edit, Glob, Grep |
| `astro-verifier` | Phase 2, once, read-only | Read, Bash, Glob, Grep |

## Command

| Command | What it does |
|---|---|
| `/migrate-react-to-astro` | Runs the full migration: Convert → Verify → Report. |

## Skills

| Skill | Invoke when | Used by |
|---|---|---|
| `migrate-react-to-astro` | Running `/migrate-react-to-astro` | the Orchestrator |
| `migrate-component` | Dispatched to convert one file | `component-migrator` |

## Rules

| Rule file | Scope | Covers |
|---|---|---|
| `.claude/rules/astro-components.md` | `astro-site/src/**/*.astro` | Astro component shape, props, frontmatter, semantics |
| `.claude/rules/react-app-readonly.md` | `react-app/**` | The React source is read-only during a migration |

---

## Commands you will run

```bash
# source app
cd react-app && npm install && npm run dev

# target app
cd astro-site && npm install && npm run dev
cd astro-site && npm run check && npm run build   # the verify gate
```

---

## Providers

| Tool | Agents from | Skills from | Commands from | Rules from |
|---|---|---|---|---|
| Claude Code | `.claude/agents/` | `.claude/skills/` | `.claude/commands/` | `.claude/rules/` (path-conditional) |
| GitHub Copilot | `.github/agents/` | `.github/skills/` | `.github/prompts/` | `.github/instructions/` (path-conditional) |
| opencode | `.opencode/agents/` | `.claude/skills/` directly (Claude-compat) | `.opencode/commands/` | `opencode.jsonc` `instructions` (always-on) |

`AGENTS.md` (this file) is read natively by all three. Agents and commands have **no**
cross-tool fallback — opencode reads `.claude/skills/` automatically but not
`.claude/agents/` or `.claude/commands/`, hence the separate `.opencode/` copies.

---

## Prerequisites

- Node 20+ and npm.
- `npm install` in both `react-app/` and `astro-site/`.
- Start from `main` with a clean working tree.
