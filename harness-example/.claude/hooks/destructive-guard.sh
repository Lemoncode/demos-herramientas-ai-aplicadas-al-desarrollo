#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
LOWERCASE_CMD=$(echo "$COMMAND" | tr '[:upper:]' '[:lower:]')

# Patterns that are considered destructive
DESTRUCTIVE_PATTERNS=(
  '^rm -rf '
  '^rm -fr '
  '^rm --recursive'
  '^rm -r '
  '^git reset --hard'
  '^git push --force'
  '^git push -f'
  '^git push origin \+'
  '^git branch -D'
  '^git clean -f'
  '^dd if='
  '^mkfs\.'
  '^> '
  '^>|'
  'chmod 000'
  'chown -R'
)

for pattern in "${DESTRUCTIVE_PATTERNS[@]}"; do
  if echo "$LOWERCASE_CMD" | grep -qE "$pattern"; then
    echo "🚫 Destructive command blocked by agent hook."
    echo "   Matched pattern: $pattern"
    echo "   Command: $COMMAND"
    echo ""
    echo "   If you are certain, re-run with: DESTRUCTIVE_OVERRIDE=true"
    exit 2
  fi
done

exit 0