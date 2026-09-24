# Subagents-First — React → Astro Migration

The **second rung** of the AI-setup ladder. A complete, runnable repo pair — a React app to
migrate *from* and an Astro app to migrate *to* — whose AI setup delegates the work to
**one subagent per file**, then verifies the result with a read-only verifier.

The use case is a framework migration: a pile of independent, mechanical, parallelizable
conversions. That is exactly the shape of work where **delegation** pays off.

> Part of the "AI tools applied to development" course. Sibling examples:
> [`ai-setup-example-instructions-first`](../ai-setup-example-instructions-first) (previous rung)
> and [`ai-setup-example-mcp-first`](../ai-setup-example-mcp-first) (next rung).

---

## What this example teaches

| Lesson | Where you see it |
|---|---|
| Fan a big task out to **parallel subagents**, one per unit | `migrate-react-to-astro` skill, Phase 1 |
| Subagents are **isolated by file ownership** — no worktree needed when units don't share files | `docs/migration-plan.md` |
| **Verification is a separate, read-only role** — the producer never grades its own work | `astro-verifier` agent |
| A structured **contract** between orchestrator and subagent keeps results aggregatable | `migrate-component` Step 5 |
| The source is **frozen** — a migration is measured, not improvised | `.claude/rules/react-app-readonly.md` |

---

## The technique: subagents-first

One prompt (`/migrate-react-to-astro`) starts an Orchestrator that:

1. reads `docs/migration-plan.md` (the six conversion units),
2. dispatches a `component-migrator` **per unit, in parallel** — each owns exactly one target file,
3. dispatches the read-only `astro-verifier` once, to build and check,
4. prints the Migration Report and halts.

Contrast with `subagents-delegation-example`, where tickets *deliberately* share a file and so
must use `git worktree` isolation. Here the six units own six different files, so file
ownership alone prevents collisions — **the isolation mechanism follows the work, not the
reverse.** That contrast is itself part of the lesson.

---

## Folder layout

```
ai-setup-example-subagents-first/
├── AGENTS.md                       ← global setup + provider map
├── CONTEXT.md                      ← vocabulary
├── opencode.jsonc                  ← opencode: always-on instructions
├── react-app/                      ← the SOURCE (read-only during a migration)
│   └── src/{main,App,styles,data/posts,components/*}
├── astro-site/                      ← the TARGET (starts as a buildable placeholder)
│   └── src/{layouts/Base,pages/index(placeholder),styles.css,components/}
├── docs/migration-plan.md          ← the authoritative mapping + acceptance criteria
├── .claude/
│   ├── commands/migrate-react-to-astro.md
│   ├── agents/{component-migrator,astro-verifier}.md
│   ├── skills/{migrate-react-to-astro,migrate-component}/SKILL.md
│   ├── rules/{astro-components,react-app-readonly}.md
│   └── settings.json
├── .github/                        ← Copilot mirror: agents/, prompts/, skills/, instructions/, copilot-instructions.md
└── .opencode/                      ← opencode: agents/, commands/
```

---

## Getting started

**Prerequisites:** Node 20+ and npm.

```bash
# source app
cd react-app && npm install && npm run dev      # → http://localhost:5173

# target app (also confirms the baseline builds before migrating)
cd ../astro-site && npm install && npm run check && npm run build
```

| App | Scripts |
|---|---|
| `react-app` | `dev`, `build`, `lint`, `preview` |
| `astro-site` | `dev`, `build`, `preview`, `check` |

---

## How to run the example

1. From this folder, open your assistant.
2. Run:

   ```
   /migrate-react-to-astro
   ```
   (opencode: same command; Copilot: the `migrate-react-to-astro` prompt.)
3. Watch six `component-migrator` subagents run in parallel, each producing one `.astro` file.
4. Watch the single `astro-verifier` run `npm run check` + `npm run build` and check the
   acceptance criteria.
5. Read the Migration Report.

To migrate a subset: `/migrate-react-to-astro M1 M3`.

---

## Minimum viable version (the fork path)

To lift this pattern into your own migration:

1. Write a **migration plan** with one row per file and explicit acceptance criteria.
2. Write **one rigid skill** for the per-file conversion (the mapping rules).
3. Write **one orchestration skill** that fans out one subagent per row, then verifies.
4. Keep the **verification role read-only** and separate from the producers.

Everything else — commands, mirrors, settings — is packaging.

---

## Providers

| Tool | Agents from | Skills from | Commands from | Rules from |
|---|---|---|---|---|
| Claude Code | `.claude/agents/` | `.claude/skills/` | `.claude/commands/` | `.claude/rules/` (path-conditional) |
| GitHub Copilot | `.github/agents/` | `.github/skills/` | `.github/prompts/` | `.github/instructions/` (path-conditional) |
| opencode | `.opencode/agents/` | `.claude/skills/` (Claude-compat) | `.opencode/commands/` | `opencode.jsonc` `instructions` (always-on) |

`AGENTS.md` is read natively by all three. Agents and commands have no cross-tool fallback —
opencode reads `.claude/skills/` directly but not `.claude/agents/` or `.claude/commands/`.
