#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)/harness-example"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

if [ "$TOOL_NAME" = "MultiEdit" ]; then
  FILES=$(echo "$INPUT" | jq -r '.tool_input.edits[].file_path' | sort -u)
else
  FILES=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
fi

TS_FILES=$(echo "$FILES" | grep -E '\.(ts|tsx)$' || true)

if [ -z "$TS_FILES" ]; then
  exit 0
fi

# Convert newline-separated list to array (bash 3 compatible)
IFS=$'\n' read -r -d '' -a TS_FILE_ARRAY <<< "$TS_FILES" || true

ERRORS=""

if ! LINT_OUTPUT=$(npx eslint --max-warnings=0 "${TS_FILE_ARRAY[@]}" 2>&1); then
  ERRORS+=$'\n--- ESLint ---\n'"$LINT_OUTPUT"
fi

if ! TSC_OUTPUT=$(npx tsc --noEmit 2>&1); then
  ERRORS+=$'\n--- TypeScript ---\n'"$TSC_OUTPUT"
fi

if [ -n "$ERRORS" ]; then
  printf "Quality gate FAILED:%s\n" "$ERRORS"
  exit 2
fi

echo "✓ Quality gate passed"
exit 0
