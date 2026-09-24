# Instructions-First — Greenfield Feature

The **first rung** of the AI-setup ladder. A complete, runnable Vite + React 19 app whose
entire AI setup is **`AGENTS.md` + three path-scoped rule files** — no agents, no hooks, no
slash commands, no MCP servers.

The use case is deliberately mundane: grow a fresh marketing site by adding a "Features"
section and a footer. The point is not the feature — it's watching the rules shape the code
without anyone re-explaining the house style.

> Part of the "AI tools applied to development" course. Sibling examples:
> [`ai-setup-example-subagents-first`](../ai-setup-example-subagents-first) (next rung) and
> [`ai-setup-example-mcp-first`](../ai-setup-example-mcp-first) (top rung).

---

## What this example teaches

| Lesson | Where you see it |
|---|---|
| An AI setup can be **just instructions** and still work well | `AGENTS.md` + `.claude/rules/` |
| **Path-scoped** rules keep the assistant focused on the files it is editing | `paths:` frontmatter in `.claude/rules/*.md` |
| The same setup is **portable across tools** with a thin mirror | `.claude/` → `.github/instructions/` → `opencode.jsonc` |
| "Done" is checkable, not vibes | acceptance criteria in `docs/feature-request.md` |

---

## The technique: instructions-first

Everything an assistant needs is written down once, in prose, in the files it already reads:

- **`AGENTS.md`** — the global conventions (TS strict, named exports, semantic HTML, no new deps).
- **`.claude/rules/react-components.md`** — loads only when editing `src/components/**/*.tsx`.
- **`.claude/rules/styling.md`** — loads only when editing styles or components.
- **`.claude/rules/feature-workflow.md`** — loads for all of `src/`: read the request, absorb the style, keep it small, gate on lint + build, report.

There is no enforcement layer. Nothing stops a mistake mechanically. The bet is that a
precise, well-placed instruction is enough — and for a greenfield app of this size, it is.

---

## Folder layout

```
ai-setup-example-instructions-first/
├── AGENTS.md                       ← the setup (read natively by all three tools)
├── CONTEXT.md                      ← vocabulary for this example
├── opencode.jsonc                  ← opencode: always-on instructions array
├── .claude/
│   ├── settings.json               ← minimal permissions
│   └── rules/                      ← the three path-scoped rules
├── .github/
│   ├── copilot-instructions.md     ← Copilot's global instructions
│   └── instructions/               ← the same three rules, `applyTo:` form
├── docs/feature-request.md         ← the task + its acceptance criteria
└── src/
    ├── main.tsx · App.tsx · styles.css · vite-env.d.ts
    └── components/Hero.tsx          ← the only component that exists today
```

---

## Getting started

**Prerequisites:** Node 20+ and npm.

```bash
npm install
npm run dev      # → http://localhost:5173
```

Scripts:

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc --noEmit && vite build` |
| `npm run lint` | ESLint (flat config) |
| `npm run preview` | Preview the production build |

---

## How to run the example (the whole point)

There is **no command to type**. That is the lesson.

1. Open your AI assistant (Claude Code, Copilot, or opencode) in this folder.
2. Ask, in plain language:

   > Read `docs/feature-request.md` and build it.

3. Watch what you *don't* have to say. The assistant should produce `FeatureCard.tsx` and
   `Footer.tsx` as **named exports, one per file, semantic HTML, ≤ 4 props, token-based
   styles** — because the rules said so, not because you repeated them.
4. Run the gate yourself:

   ```bash
   npm run lint && npm run build
   ```

If the assistant strays, the fix is not a longer prompt — it's a sharper rule file. That
editing loop *is* the technique.

---

## Minimum viable version (the fork path)

To lift this into your own project, you need three things and nothing else:

1. An `AGENTS.md` with your global conventions (keep it under ~40 lines).
2. One path-scoped rule per file-type cluster you care about (components, styles, tests…).
3. A one-page feature request with checkable acceptance criteria.

Delete everything else. Add agents/hooks/MCP only when a concrete pain shows up — which is
exactly what the sibling examples demonstrate.

---

## Providers

The same instructions reach all three tools; only the discovery mechanism differs.

| Tool | Reads | Mechanism |
|---|---|---|
| Claude Code | `AGENTS.md`, `.claude/rules/*.md` | `paths:` frontmatter → path-conditional |
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` | `applyTo:` glob → path-conditional |
| opencode | `AGENTS.md`, `opencode.jsonc` | `instructions` array → always-on (no per-path loading) |
