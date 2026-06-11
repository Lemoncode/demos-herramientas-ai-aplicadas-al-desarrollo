#!/usr/bin/env bash

cd "$(git rev-parse --show-toplevel 2>/dev/null)/harness-example" 2>/dev/null || exit 0

echo ""
echo "━━━ Quality Status ━━━━━━━━━━━━━━━━━━━━━━━━━"

if npx eslint . --max-warnings=0 --quiet 2>/dev/null 1>/dev/null; then
  echo "  ESLint      ✓  no errors"
else
  echo "  ESLint      ✗  errors found — run /lint"
fi

if npx tsc --noEmit 2>/dev/null 1>/dev/null; then
  echo "  TypeScript  ✓  no type errors"
else
  echo "  TypeScript  ✗  type errors found — run /typecheck"
fi

if npm test 2>/dev/null | grep -q "passed"; then
  echo "  Tests       ✓  all passing"
else
  echo "  Tests       ✗  failures or no tests run — run /test"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
