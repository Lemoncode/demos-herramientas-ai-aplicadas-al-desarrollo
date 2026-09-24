# Acme Marketing Site — Copilot Instructions

This repository is a fresh **greenfield** Vite + React 19 + TypeScript app. It currently
ships only a hero section. Grow it by following the conventions below — **no subagents, no
hooks, no slash commands.** The entire AI setup *is* the instructions.

**Stack:** Vite 8 · React 19 · TypeScript strict · ESLint 10 (flat config)

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

---

## Non-negotiable conventions

1. **TypeScript strict, no `any`.** Use `unknown` plus a type guard if needed.
2. **Named exports for components.** Never `export default` from a component file
   (`src/App.tsx` and `src/main.tsx` are exempt).
3. **One component per file**, named exactly like the file.
4. **Semantic HTML first** — `<button>`, `<nav>`, `<section>`, `<article>`.
5. **Every interactive element has an accessible name.**
6. **Never invent dependencies.** Ask first. The dependency list is frozen.
7. **Match the existing house style** — plain, no UI library.

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

## What a good change looks like

*"add a Features section"* → three files, nothing more:

```tsx
// src/App.tsx — map over data, do not copy-paste JSX
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

```css
/* src/styles.css — tokens only, no raw values */
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
```

## Common mistakes

| ❌ Wrong | ✅ Right |
|---|---|
| `export default function FeatureCard()` | `export function FeatureCard()` |
| `<div onClick={...}>` | `<button type="button">` |
| `style={{ color: '#38bdf8' }}` | `className` + `var(--color-accent)` |
| 6 props on one component | split into two components |
| a second component in the same file | extract to its own file |

---

## Instructions (auto-loaded by file pattern)

| File | Applied to |
|---|---|
| `react-components.instructions.md` | `src/components/**/*.tsx` |
| `styling.instructions.md` | `src/**/*.{css,tsx}` |
| `feature-workflow.instructions.md` | `src/**` |

---

## How to work a feature

1. Read `docs/feature-request.md` and its acceptance criteria.
2. Read `src/components/Hero.tsx` and `src/styles.css` to absorb the house style.
3. Implement in the smallest set of files that satisfies the criteria.
4. `npm run lint` and `npm run build` must both pass.
5. Report the changed files and the criteria each change satisfies.

If a criterion is ambiguous, ask one clarifying question before writing code.

---

## What this setup deliberately does *not* have

No agents. No hooks. No slash commands. No MCP servers. **Start here** — add machinery only
when a specific pain appears. See `ai-setup-example-subagents-first` and
`ai-setup-example-mcp-first` for the next rungs.
