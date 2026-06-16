Four "quality gates" applied to every PR so that AI-assisted delivery does not compromise maintainability or production stability. The framework's load-bearing claim: **the reviewer applies criteria defined ahead of time, it does not invent them on the fly**.

## The four Rs

### 1. Risk
Does this change introduce security risk, can it break production, does it touch a sensitive zone without sufficient guardrails?

**Verifiable signals for UI / Next.js code:**
- Use of `dangerouslySetInnerHTML` without sanitization.
- Untrusted URL props passed to `<a href>`, `<img src>`, `<iframe src>`.
- Server actions exposed without auth / input validation.
- Third-party scripts loaded at runtime without `defer` / Subresource Integrity.
- Changes to `app/layout.tsx`, `middleware.ts`, `next.config.js`, or any file under `app/api/`.

### 2. Readability
Is the code understandable? Does it respect the complexity budget? Or are we accepting an AI-generated "ball of mud" that just happens to work?

**Verifiable signals for UI / React code:**
- Component file under 200 LOC.
- JSX nesting depth ≤ 4 levels.
- No magic numbers in JSX (px values, indices, thresholds) without a named constant.
- Props interface ≤ 6 fields per component (otherwise compose).
- No `any` (explicit or inferred).
- Named exports only; named functions over arrow assignments for components.

### 3. Reliability
Is it really tested? Useful coverage, not vanity coverage. Explicit edge cases. Errors handled. Timeouts considered.

**Verifiable signals for UI / Vitest + RTL code:**
- Colocated `*.test.tsx` exists for every component.
- At least one test asserts user-visible behavior (`getByRole`, `getByLabelText`), not implementation details.
- Edge case tests are named explicitly: empty state, error state, loading state, long copy, RTL.
- No snapshot tests for logic.
- Async behavior uses `findBy*` or `waitFor`, not arbitrary `setTimeout`.

### 4. Resilience
What happens when this fails? Retries, graceful degradation, observability? Or does a local failure cause a cascade?

**Verifiable signals for UI / Next.js code:**
- Error boundary or `error.tsx` covers the Section.
- Loading state via `loading.tsx` or Suspense boundary.
- Failed `fetch()` in a server component returns a fallback render, not an uncaught throw.
- No unbounded `while` / recursive renders.
- `console.error` or telemetry hook is invoked on caught errors (not swallowed).

## How a 4R Reviewer applies these

For each PR (or each worktree in a Fleet Phase) the Reviewer:

1. Reads the changed files.
2. For each of the 4 Rs, runs the verifiable signals against the diff.
3. Emits findings with severity (`blocker | major | minor | info`) and a R-tag.
4. Produces a per-PR verdict: `ready_to_merge | merge_with_fixes | do_not_merge`.
5. Never invents criteria not listed above. If a concern is real but not on the list, the Reviewer says so and recommends updating this document.

## Output schema

```json
{
  "pr": "section-hero",
  "verdict": "merge_with_fixes",
  "findings": [
    {
      "r": "readability",
      "severity": "major",
      "file": "src/sections/hero/Hero.tsx",
      "line": 42,
      "issue": "Magic number 0.85 in JSX without a named constant",
      "fix": "Extract as HERO_OPACITY constant at module level"
    }
  ],
  "tally": { "blocker": 0, "major": 1, "minor": 2, "info": 0 }
}
```
