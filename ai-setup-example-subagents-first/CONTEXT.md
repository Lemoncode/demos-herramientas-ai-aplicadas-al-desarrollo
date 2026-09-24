# Subagents-First Example

Demo setup for a course on AI-assisted development. Demonstrates **parallel subagent
delegation**: one prompt fans a React → Astro migration out to one subagent per source
file, then verifies the result with a read-only verifier subagent.

## Language

**Migration**:
Converting the whole of `react-app/` into `astro-site/`, file by file, without changing the
rendered output. The source app is frozen for the duration; only `astro-site/` grows.
_Avoid_: Port (used loosely), rewrite

**Conversion unit**:
One source file and the single target file it maps to, per `docs/migration-plan.md`. It is
the smallest thing a subagent can own end to end.
_Avoid_: Task, ticket (this example has no backlog)

**Component Migrator**:
A subagent that owns exactly one Conversion unit: reads one React file, writes one `.astro`
file, and returns a structured result. Migrators never talk to each other.
_Avoid_: Worker, agent (too generic), bot

**Verifier**:
The read-only `astro-verifier` subagent dispatched after all Migrators finish. It does not
write code — it runs `astro check` + `astro build`, and checks the rendered structure
against the React source. Emits findings, not fixes.
_Avoid_: Reviewer (used by the sibling example for a broader rubric), auditor, linter

**Orchestrator**:
The agent in the main session. Reads `docs/migration-plan.md`, dispatches one Migrator per
Conversion unit, then the Verifier, then prints the Migration Report. Does not migrate
anything itself.
_Avoid_: Coordinator, dispatcher, manager

**Migration Report**:
The single printed artifact that closes a run: a source → target matrix with check/build
status and verifier findings. Printing it is the explicit stop condition.
_Avoid_: Summary, results, status
