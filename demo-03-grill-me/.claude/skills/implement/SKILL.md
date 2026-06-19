---
name: implement
description: Implement a piece of work based on a PRD or set of issues in the issues/ directory.
disable-model-invocation: true
---

Implement the work described by the user in the PRD or issues.

Use `/tdd` where possible, at pre-agreed seams.

Run typechecking regularly (`npm run typecheck`), single test files regularly, and the full test suite once at the end (`npm test`).

Mark the issue file `[DONE]` when complete and commit your work to the current branch.

Once done, use `/code-review` to review the work.
