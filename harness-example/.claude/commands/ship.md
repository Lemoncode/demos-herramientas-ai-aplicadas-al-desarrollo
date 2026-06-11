Run the full quality gate in sequence: lint → typecheck → tests. Stop at the first failure.

Steps:
1. Run: `npm run lint`
   - If lint errors found: stop immediately, report the errors, do not run the next step.
2. Run: `npx tsc --noEmit`
   - If type errors found: stop immediately, report the errors, do not run the next step.
3. Run: `npm test`
   - Report test results.

Final report:
- All passed: "✓ Ship check passed — lint, types, and tests are all green."
- Any failed: "✗ Ship check failed at [lint|typecheck|tests]: [brief error summary]"
