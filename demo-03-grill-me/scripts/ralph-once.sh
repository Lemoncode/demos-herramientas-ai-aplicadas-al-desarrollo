#!/bin/bash
# ralph-once.sh
# Runs one iteration of the Ralph loop: picks the next AFK issue, implements it, marks it done.
# Run this manually first to observe behaviour before looping.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ISSUES_DIR="$PROJECT_ROOT/issues"
OUTPUT_FILE="/tmp/ralph-output.txt"

# Gather context
ISSUES=$(cat "$ISSUES_DIR"/*.md 2>/dev/null || echo "No issue files found.")
COMMITS=$(git -C "$PROJECT_ROOT" log --oneline -5 2>/dev/null || echo "No commits yet.")
PROMPT=$(cat "$SCRIPT_DIR/ralph-prompt.md")

FULL_PROMPT="$PROMPT

## Current issue backlog

$ISSUES

## Recent commits

$COMMITS
"

echo "▶ Starting Ralph loop..."
echo "  Issues dir: $ISSUES_DIR"
echo "  Token-saving mode: feeding $(echo "$ISSUES" | wc -w) words of backlog"
echo ""

# Run Claude in acceptEdits mode so it can write files without prompting
claude --permission-mode acceptEdits -p "$FULL_PROMPT" | tee "$OUTPUT_FILE"

echo ""
if grep -q "NO MORE TASKS" "$OUTPUT_FILE"; then
  echo "✅ All AFK tasks complete. Ralph loop finished."
  exit 0
else
  echo "▶ Task completed. Run again to pick the next one."
  exit 0
fi
