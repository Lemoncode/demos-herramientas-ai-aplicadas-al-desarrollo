<!--
SYNC IMPACT REPORT
==================
Version change: UNVERSIONED → 1.0.0
Added sections:
  - Core Principles (7 principles, initial ratification)
  - Technology Stack
  - Development Workflow
  - Governance
Modified principles: N/A (initial ratification)
Removed sections: N/A (initial ratification)
Templates checked:
  - .specify/templates/plan-template.md ✅ Constitution Check section is generic; compatible with all 7 principles
  - .specify/templates/spec-template.md ✅ Mandatory User Scenarios section aligns with Principle I (Test-First)
  - .specify/templates/tasks-template.md ✅ TDD note in Within Each User Story aligns with Principle I; no tech conflicts
  - .specify/templates/commands/ ⚠ Directory not found; skipped
Follow-up TODOs: None — all placeholders resolved
-->

# demo-02-spec-kit Constitution

## Core Principles

### I. Test-First (NON-NEGOTIABLE)

No implementation code MAY be written before a failing test exists and has been confirmed to fail.
The Red-Green-Refactor cycle is mandatory: write the test → confirm failure → implement → confirm
green → refactor. Every task in `tasks.md` MUST list test creation as its first sub-step.

**Rationale**: Catching design issues before implementation is cheaper than refactoring afterward.
This principle ensures specifications are verifiable by construction.

### II. One Component Per File — Named Exports Only

Each React component MUST live in its own dedicated file.
All components MUST use named exports; default exports are prohibited.
The file name MUST match the exported component name in PascalCase.

**Rationale**: Named exports improve discoverability, enable tree-shaking, and prevent import
aliasing that obscures component identity.

### III. React Built-In State Only

External state management libraries (Redux, Zustand, Jotai, MobX, XState, etc.) are prohibited.
State MUST be managed exclusively with `useState`, `useReducer`, and `useContext`.
State shape MUST be defined with TypeScript interfaces or type aliases.

**Rationale**: Demonstrates how far native React primitives carry a project before complexity
forces external tooling. Keeps the dependency footprint minimal for a demo context.

### IV. Accessibility

Every interactive element (buttons, links, inputs, custom controls) MUST have an accessible name
via `aria-label`, `aria-labelledby`, or an associated `<label>`.
All interactive elements MUST be keyboard-operable: focusable and activatable via Enter/Space
where appropriate.
Color MUST NOT be the sole means of conveying information.
WCAG 2.1 AA is the minimum compliance target.

**Rationale**: Accessibility is a non-negotiable quality attribute, not a post-launch retrofit.
Building it in from the start costs less than adding it later.

### V. No Backend Dependencies

No `fetch`, `axios`, WebSocket, or any external API call MAY appear in this codebase.
All data MUST be static, derived in-memory, or supplied via props or context from local fixtures.
No environment variables pointing to remote services are allowed.

**Rationale**: This is a frontend demo. Eliminating backend coupling lets anyone run the app
without infrastructure and keeps spec scope tight and self-contained.

### VI. Feature-Based Folder Structure

Components MUST live under `src/components/[feature]/` — one folder per feature.
Shared, cross-feature utilities belong in `src/utils/` or `src/hooks/`.
Generic "catch-all" folders (`components/misc/`, `components/shared/` as a dumping ground)
are prohibited.

**Rationale**: Co-locating by feature makes ownership clear, reduces merge conflicts, and maps
directly to specs in `specs/[###-feature-name]/`.

### VII. TypeScript Strict Mode — No `any`

`"strict": true` MUST be set in `tsconfig.json`.
The `any` type is prohibited in all production and test code.
Use `unknown` when the type is genuinely unknown and narrow before use.
Type assertions (`as`) require an inline comment explaining why they are safe.

**Rationale**: Strict TypeScript catches entire categories of bugs at compile time and makes
refactoring safer. `any` silently disables those guarantees.

## Technology Stack

This project uses the following technology constraints for the duration of this demo:

- **Language**: TypeScript (`"strict": true`)
- **UI Library**: React (latest stable)
- **Bundler/Framework**: As configured in `package.json` (Vite or Create React App)
- **Testing**: Jest + React Testing Library, or Vitest if Vite-based
- **Styling**: CSS Modules or Tailwind — no CSS-in-JS runtime library unless already present
- **Backend / API / Database**: None — intentionally excluded (see Principle V)

These constraints are binding for this demo. Relaxing any of them requires a constitutional
amendment with documented rationale.

## Development Workflow

1. Read the feature spec and verify alignment with all seven Core Principles before writing code.
2. Write a failing test first (Principle I). Run the test and confirm it fails with the expected
   error message.
3. Implement the minimal code that makes the test pass.
4. Refactor while keeping all tests green.
5. Open a PR; reviewers MUST verify the Constitution Check section in `plan.md`.
6. Merge only when all constitution gates pass.

Any deviation from this workflow MUST be justified in the PR description and flagged for
constitutional review.

## Governance

This Constitution supersedes all other coding standards, README guidance, and verbal agreements
within this project.

**Amendment procedure**:
1. Author proposes a change with rationale and a migration plan for existing code.
2. The proposal is documented in a dedicated PR.
3. At least one reviewer approves with explicit sign-off.
4. The version line is bumped according to the versioning policy below.
5. `LAST_AMENDED_DATE` is updated to the date of merge.

**Versioning policy**:
- **MAJOR**: Removing or fundamentally redefining a principle (backward-incompatible governance
  change).
- **MINOR**: Adding a new principle or materially expanding guidance in an existing one.
- **PATCH**: Clarifications, wording fixes, or non-semantic refinements.

**Compliance review**: Every PR MUST include a "Constitution Check" section listing each of the
seven principles and confirming it is satisfied or justifying any variance. The Constitution Check
gate in `plan.md` enforces this at planning time.

**Version**: 1.0.0 | **Ratified**: 2026-07-17 | **Last Amended**: 2026-07-17
