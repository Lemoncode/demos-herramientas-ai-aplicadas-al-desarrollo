# Acme Marketing Site — Agent Instructions

This repository is a fresh **greenfield** Vite + React 19 + TypeScript app. It currently
ships only a hero section. Your job is to grow it by following the rules in this file and
in `.claude/rules/` — **without any extra machinery**: no subagents, no hooks, no slash
commands. The entire setup *is* the instructions.

**Stack:** Vite 8 · React 19 · TypeScript strict · ESLint 10 (flat config)

---

## What this example teaches

An AI setup does not need agents, hooks or MCP servers to be useful. A single, precise
`AGENTS.md` plus a handful of **path-scoped rules** is enough to make an assistant write
code that matches the project the first time. This is the rung of the ladder every other
example builds on.

When a rule conflicts with your own instinct, the rule wins. When a rule conflicts with
explicit user instructions, the user wins — and you should say so.

---

## Project layout

```
src/
├── main.tsx                 ← entry point, imports styles.css
├── App.tsx                  ← default export (exempt from the named-export rule)
├── styles.css               ← ALL styles live here; design tokens on :root
└── components/
    ├── Hero.tsx             ← the only component that exists today
    ├── FeatureCard.tsx      ← you will add this (docs/feature-request.md)
    └── Footer.tsx           ← and this
```

New components always go in `src/components/`, one per file, named after the component.

---

## Non-negotiable conventions

These live in `AGENTS.md` because they are global. Rules that only apply to a subset of
files are **path-scoped** and live in `.claude/rules/` (see the map below).

1. **TypeScript strict, no `any`.** Use `unknown` plus a type guard if the shape is truly unknown.
2. **Named exports for components.** `export function Hero(...)`. Never `export default`
   from a component file (only `src/App.tsx` and `src/main.tsx` are exempt).
3. **One component per file**, in `src/components/`, named exactly like the file.
4. **Semantic HTML first.** Buttons are `<button>`, nav is `<nav>`, sections are `<section>`.
5. **Every interactive element has an accessible name.** Visible text preferred;
   `aria-label` only when there is no visible text.
6. **Never invent dependencies.** If a task seems to need a package, stop and ask.
   The dependency list is frozen: `react`, `react-dom` and the dev tooling.
7. **Match the existing style.** Read a neighbouring file before writing a new one —
   this app has a deliberate, plain house style and no UI library.

---

## Naming at a glance

| Thing | Convention | Example |
|---|---|---|
| Component file | `PascalCase`, matches the component | `src/components/FeatureCard.tsx` |
| Component | `PascalCase`, named export | `export function FeatureCard(...)` |
| Props interface | `<Component>Props`, `interface` | `interface FeatureCardProps` |
| Context consumer hook | `use<Thing>` | `useTheme` |
| CSS class | kebab-case, component-prefixed | `.feature-card`, `.feature-card__title` |
| CSS token | `--category-purpose` | `--color-accent`, `--space-4` |

---

## Canonical component (copy this shape)

```tsx
interface FeatureCardProps {
  title: string
  description: string
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <article className="feature-card">
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
    </article>
  )
}
```

Why this exact shape:

- `interface FeatureCardProps` — typed props, not `React.FC`.
- named export `FeatureCard` — matches the file name.
- `<article>` + `<h3>` + `<p>` — semantic elements, no `<div>` soup.
- classes are prefixed `feature-card__*` and reference tokens from `styles.css`.
- **two props** — well under the ≤ 4 budget.

---

## What a good change looks like (worked example)

The request is *"add a Features section"*. The smallest correct change touches three files:

**1. New file — `src/components/FeatureCard.tsx`** (the canonical shape above).

**2. Edit — `src/App.tsx`** — add a section that maps over data, not copy-pasted JSX:

```tsx
import { Hero } from './components/Hero.tsx'
import { FeatureCard } from './components/FeatureCard.tsx'
import { Footer } from './components/Footer.tsx'

const FEATURES = [
  { title: 'Fast builds', description: 'Ship in seconds, not minutes.' },
  { title: 'Tiny bundles', description: 'Only what the page actually uses.' },
  { title: 'Typed end to end', description: 'Strict TypeScript, no escape hatches.' },
]

export default function App() {
  return (
    <main>
      <Hero
        title="Ship your next product faster"
        subtitle="Acme gives small teams the tooling big teams take for granted."
        ctaLabel="Get started"
        ctaHref="#features"
      />

      <section className="features" aria-labelledby="features-heading">
        <h2 id="features-heading">Features</h2>
        <div className="features__grid">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
```

**3. Edit — `src/styles.css`** — add the classes using tokens, never raw values:

```css
.features__grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}

.feature-card {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}

.feature-card__title {
  margin: 0 0 var(--space-2);
}
```

Note what did **not** happen: no new dependency, no inline styles, no second component in
a file, no `export default` from a component, no re-explaining needed in the prompt.

---

## Common mistakes (and the fix)

| ❌ Wrong | ✅ Right | Why |
|---|---|---|
| `export default function FeatureCard()` | `export function FeatureCard()` | named exports are greppable and consistent |
| `<div className="card" onClick={...}>` | `<button type="button" onClick={...}>` | keyboard + screen-reader accessible for free |
| `style={{ color: '#38bdf8' }}` | `className="..."` with `var(--color-accent)` | one source of truth for design values |
| 6 props on one component | split into two components | the ≤ 4 props budget |
| `const data: any = ...` | `unknown` + a type guard | `any` disables the compiler |
| a second component in the same file | extract to its own file | one component per file |

---

## Rules (path-scoped, auto-loaded)

| Rule file | Applies to | Covers |
|---|---|---|
| `.claude/rules/react-components.md` | `src/components/**/*.tsx` | Component shape, props, composition, a11y |
| `.claude/rules/styling.md` | `src/**/*.css`, `src/**/*.tsx` | Design tokens, class naming, layout |
| `.claude/rules/feature-workflow.md` | `src/**` | How to pick up a feature, the gate, and when to stop |

Claude Code discovers these by their `paths:` patterns. Copilot uses the mirrored
`.github/instructions/*.instructions.md` (`applyTo:` globs). opencode has no per-path
loading, so `opencode.jsonc` lists the same files in its always-on `instructions` array —
the same trade-off documented in `subagents-delegation-example`.

---

## How to work a feature

The current feature request lives in `docs/feature-request.md`. When the user asks you to
build it:

1. Read `docs/feature-request.md` and the acceptance criteria in it.
2. Read one existing component (`src/components/Hero.tsx`) and `src/styles.css` to absorb the house style.
3. Implement the feature in the smallest set of files that satisfies the criteria.
4. `npm run lint` and `npm run build` must both pass. Do not hand a broken build back.
5. Report what you changed and which acceptance criteria each change satisfies.

If an acceptance criterion is ambiguous, ask **one** clarifying question before writing code.

---

## What this setup deliberately does *not* have

- No agents — one assistant, one conversation.
- No hooks — nothing is enforced mechanically; the rules are followed because they are clear.
- No slash commands — you ask in plain language, and the instructions do the work.
- No MCP servers — there is no external system to reach.

That absence is the lesson: **start here.** Add the machinery only when a specific pain
appears, and one of the sibling examples (`ai-setup-example-subagents-first`,
`ai-setup-example-mcp-first`) shows what that looks like.
