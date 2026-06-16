#!/usr/bin/env bash
# Section ownership enforcement — blocks Write/Edit/MultiEdit that targets a path
# outside the current Worker's owned Section folder.
#
# Activation rule: only enforce when the current git branch matches `fleet/<id>`.
# Foundation Phase (main / foundation branch) writes everywhere unrestricted.
#
# A Worker creates `fleet/<id>` as its first build-section step; from that point on,
# any Write/Edit aimed outside `src/sections/<id>/` returns exit 2.
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[ -z "$REPO_ROOT" ] && exit 0

HARNESS="$REPO_ROOT/harness-example"
[ ! -d "$HARNESS" ] && exit 0
cd "$HARNESS"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

if [ "$TOOL_NAME" = "MultiEdit" ]; then
  TARGETS=$(echo "$INPUT" | jq -r '.tool_input.edits[].file_path' | sort -u)
else
  TARGETS=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
fi

[ -z "$TARGETS" ] && exit 0

BRANCH=$(git branch --show-current 2>/dev/null || true)

# Not on a fleet/* branch → Foundation Phase or hand-edit. Unrestricted.
if [[ ! "$BRANCH" =~ ^fleet/(.+)$ ]]; then
  exit 0
fi

SECTION_ID="${BASH_REMATCH[1]}"
ALLOWED="$HARNESS/src/sections/$SECTION_ID"

VIOLATIONS=""
while IFS= read -r TARGET; do
  [ -z "$TARGET" ] && continue
  if [[ "$TARGET" != /* ]]; then
    TARGET="$HARNESS/$TARGET"
  fi
  if [[ "$TARGET" != "$ALLOWED"/* ]] && [[ "$TARGET" != "$ALLOWED" ]]; then
    VIOLATIONS+="  - $TARGET"$'\n'
  fi
done <<< "$TARGETS"

if [ -n "$VIOLATIONS" ]; then
  printf "Section ownership violation — branch '%s' may only Write/Edit inside:\n  %s/\n\nForbidden target(s):\n%s\nThis Worker owns only the '%s' Section. Foundation primitives are read-only from a Worker; if a primitive is missing, build it locally inside src/sections/%s/ — do not modify src/design-system/.\n" \
    "$BRANCH" "$ALLOWED" "$VIOLATIONS" "$SECTION_ID" "$SECTION_ID" >&2
  exit 2
fi

exit 0
