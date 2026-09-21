Four "quality gates" applied to every PR so that AI-assisted delivery does not compromise maintainability or production stability. The framework's load-bearing claim: **the reviewer applies criteria defined ahead of time, it does not invent them on the fly**.

Shared by the `4r-reviewer` agent in `ci-subagents-claude/` and
`ci-subagents-opencode/`, and by the fleet demo in
`subagents-delegation-example/`.

## The four Rs

### 1. Risk

Does this change introduce security risk, can it break production, does it touch a sensitive zone without sufficient guardrails?

**Verifiable signals for React / TypeScript code:**
- Secrets, tokens or API keys committed to source (or to a `NEXT_PUBLIC_` / `VITE_` variable).
- `dangerouslySetInnerHTML` without sanitisation.
- Untrusted URL props passed to `<a href>`, `<img src>` or `<iframe src>`.
- `eval`, `new Function`, or dynamic `import()` of a user-supplied string.
- Third-party scripts loaded at runtime without `defer` / Subresource Integrity.
- Auth, session or payment code changed without a corresponding guard or validation.

### 2. Readability

Is the code understandable? Does it respect the complexity budget? Or are we accepting an AI-generated "ball of mud" that just happens to work?

**Verifiable signals for React / TypeScript code:**
- Component file under 200 LOC.
- JSX nesting depth ≤ 4 levels.
- No magic numbers in JSX (px values, indices, thresholds) without a named constant.
- Props interface ≤ 6 fields per component (otherwise compose).
- No `any` (explicit or inferred) and no unchecked `as` casts on external data.
- Named exports only; named function declarations for components.

### 3. Reliability

Is it really tested? Useful coverage, not vanity coverage. Explicit edge cases. Errors handled. Timeouts considered.

**Verifiable signals for React / TypeScript code:**
- A colocated `*.test.tsx` / `*.test.ts` exists for every component and module.
- At least one test asserts user-visible behaviour (`getByRole`, `getByLabelText`), not implementation details.
- Edge case tests are named explicitly: empty state, error state, loading state, long copy.
- No snapshot tests for logic.
- Boundary arithmetic (loop bounds, `length - 1`, pagination offsets) is covered by a test.

### 4. Resilience

What happens when this fails? Retries, graceful degradation, observability? Or does a local failure cause a cascade?

**Verifiable signals for React / TypeScript code:**
- An error boundary covers the component tree.
- A loading state exists (Suspense, `isLoading`, or a skeleton) — not just an empty render.
- A failed `fetch()` resolves to a fallback render or an error state, never an unhandled rejection.
- No floating promises: every `fetch(...).then(...)` has a `.catch()` or an `await` inside `try/catch`.
- No unbounded `while` loops or recursive renders.
- Caught errors are logged or reported (`console.error`, telemetry) — never swallowed.

## How a 4R Reviewer applies these

1. Reads the changed files.
2. For each of the four Rs, runs the verifiable signals against the diff.
3. Emits findings with severity (`blocker | major | minor | info`) and an R-tag.
4. Produces a verdict: `ready_to_merge | merge_with_fixes | do_not_merge`.
5. Never invents criteria not listed above. If a concern is real but not on the list, the Reviewer says so and recommends updating this document.

## Output schema

Every reviewer agent in CI — not just `4r-reviewer` — returns the same
finding shape, so the orchestrator can post one inline PR comment per
finding without translating formats:

```json
{
  "agent": "4r-reviewer",
  "verdict": "merge_with_fixes",
  "findings": [
    {
      "r": "readability",
      "severity": "major",
      "file": "ci-subagents-claude/sample-app/src/OrderList.tsx",
      "line": 62,
      "issue": "Magic number 500 in JSX without a named constant",
      "fix": "Extract as FREE_SHIPPING_THRESHOLD at module level"
    }
  ],
  "tally": { "blocker": 0, "major": 1, "minor": 2, "info": 0 }
}
```

`file` is the repository-relative path, `line` is the 1-based line number
in the **new** version of the file (`RIGHT` side of the diff).
