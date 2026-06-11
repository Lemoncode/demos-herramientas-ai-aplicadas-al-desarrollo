#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)/harness-example"

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if ! echo "$COMMAND" | grep -q 'git commit'; then
  exit 0
fi

echo "Commit guard: running tests before commit..."

if ! TEST_OUTPUT=$(npm test 2>&1); then
  printf "Commit blocked — tests are failing:\n\n%s\n" "$TEST_OUTPUT"
  exit 2
fi

echo "✓ Tests passed — proceeding with commit"
exit 0
