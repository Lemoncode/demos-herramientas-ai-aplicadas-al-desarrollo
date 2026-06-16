# Harness Example

Demo harness for a course on AI-assisted development. Illustrates a **fleet of autonomous agents** delivering React features in parallel, each agent isolated in its own git worktree.

## Language

**Mission**:
A single self-contained piece of work that one Worker owns end-to-end — from failing test to merged PR. A Mission must not touch files owned by another concurrently-running Mission.
_Avoid_: Ticket, story, task, issue

**Worker**:
A single autonomous agent instance executing one Mission in its own git worktree. Workers do not communicate with each other; they coordinate only through the Orchestrator and through merged main.
_Avoid_: Agent (too generic), bot, assistant

**Fleet**:
The set of Workers running concurrently against a single high-level Goal.
_Avoid_: Swarm, team, group

**Orchestrator**:
The first agent in the session. Takes the user's Goal, decomposes it into independent Missions, and dispatches one Worker per Mission. Does not write feature code itself.
_Avoid_: Coordinator, dispatcher, manager

**Goal**:
The user's single high-level instruction to the Orchestrator, expressed as one prompt at session start. Example: _"Redesign the JivaEnergy homepage."_
_Avoid_: Task, requirement, brief

**Section**:
The unit of parallelism in this harness. One homepage region (Hero, Catalog, FAQ, etc.) owned end-to-end by exactly one Worker. Sections never import from other Sections — only from the Foundation.
_Avoid_: Block, module, panel, widget

**Foundation**:
The shared, read-only substrate every Section depends on: design tokens, layout shell, and primitive UI components. Built sequentially by the Orchestrator before any Worker is dispatched.
_Avoid_: Shell, base, core, scaffold

**Foundation Phase / Fleet Phase**:
The two execution phases of a single session. Foundation Phase is sequential (Orchestrator alone). Fleet Phase is parallel (one Worker per Section, all dispatched together, no further input from the user).
_Avoid_: Setup, build phase

**Mission Brief**:
The structured data payload the Orchestrator passes per Worker at dispatch — Section name, owned file path, copy spec, mock data, and any Section-specific overrides. The `build-section` skill is the behavior; the Mission Brief is the parameters.
_Avoid_: Prompt, ticket spec, instructions, briefing

**Reviewer**:
A read-only specialist subagent dispatched after the Fleet finishes. Reviewers do not write feature code and do not have their own worktree — they read across the 6 Worker worktrees and emit findings. The harness ships three: `react-reviewer`, `accessibility-reviewer`, and `4r-reviewer`.
_Avoid_: Auditor, checker, linter, critic

**4R Framework**:
External code-review framework adopted as the standard for the `4r-reviewer`. The Rs are Risk, Readability, Reliability, Resilience. The canonical rule set lives at `docs/references/4r-framework.md` — the Reviewer reads it; it does not invent criteria.
_Avoid_: Quality framework, review framework, 4-pillar framework

**Final Report**:
The single printed artifact that closes a `/goal` run — a 6×4 pass/fail matrix plus PR URLs. The Orchestrator does not exit until the Final Report is printed; printing it is the explicit stop condition.
_Avoid_: Summary, status, results
