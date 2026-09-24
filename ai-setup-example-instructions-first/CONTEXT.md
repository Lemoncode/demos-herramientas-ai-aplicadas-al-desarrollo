# Instructions-First Example

A course example for AI-assisted development. Demonstrates the **instructions-first**
approach to building an AI setup: `AGENTS.md` plus path-scoped rules, and nothing else.
The use case is adding a feature to a greenfield app.

## Language

**Instructions**:
The always-on or path-scoped prose that tells the assistant how this repository works —
conventions, boundaries, and the shape of a good change. In this example the instructions
are the whole setup.
_Avoid_: Prompt (an instruction is durable; a prompt is a one-off), config

**Path-scoped rule**:
An instruction that only loads when the assistant touches matching files. In Claude Code
these live in `.claude/rules/*.md` with a `paths:` frontmatter; Copilot mirrors them in
`.github/instructions/*.instructions.md` with `applyTo:`. opencode has no equivalent, so
the same files are listed in `opencode.jsonc`.
_Avoid_: Rule file, instruction file (too generic in this doc)

**Feature request**:
The single, written-up task the student is asked to build, in `docs/feature-request.md`.
It carries explicit acceptance criteria so "done" is checkable, not vibes.
_Avoid_: Ticket (this example has exactly one), brief, task

**Minimum viable setup**:
The smallest configuration that meaningfully steers the assistant. For this example: one
`AGENTS.md` and two path-scoped rules.
_Avoid_: Starter kit, boilerplate

**Rung**:
One step on the setup-depth ladder the three examples trace: instructions-first →
subagents-first → mcp-first. This example is the first rung.
_Avoid_: Level, tier
