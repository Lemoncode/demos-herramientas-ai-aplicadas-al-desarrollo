# Migrate harness from Vite to Next.js 15 App Router

The harness was originally Vite + React as a minimal playground. We're shifting it to be the host for a parallel-agent-fleet demo that redesigns a marketing site (JivaEnergy). We considered (i) staying on Vite and filtering the vendored `vercel-react-best-practices` skill down to the ~30 framework-neutral rules and (ii) staying on Vite and dropping the Vercel skill entirely, but both leave the harness with the wrong primitives for marketing-site Sections (no server components, no image optimization, client-only data fetching).

We migrated to Next.js 15 App Router because Sections naturally become server components that own their own `fetch()`, the full Vercel ruleset fires on the code (no dead-weight rules), and the resulting harness teaches the dominant 2026 React-meta stack. The Foundation Phase now scaffolds Next.js (`app/layout.tsx`, `app/page.tsx`, `app/globals.css`, design tokens, primitives) instead of Vite.

Consequence: the harness is no longer a generic React+Vitest playground. If a future course module needs a minimal Vite scaffold, it must live in a separate harness — do not roll Vite back in here.
