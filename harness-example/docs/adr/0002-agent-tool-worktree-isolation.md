# Fleet dispatch via Agent tool with native worktree isolation

The Fleet Phase needs to be triggered from a single Orchestrator turn — multiple Workers running in parallel, each physically prevented from editing files outside its Section. We rejected hand-rolled fan-out (one chat per Worker) because it can't start from one prompt, and we rejected single-workspace subagents because nothing stops a misbehaving Worker from stomping on another Section's files.

We use the Claude Code `Agent` tool's native `isolation: "worktree"` parameter. The Orchestrator calls `Agent(..., isolation: "worktree")` once per Section in a single message; the runtime forks a git worktree per Worker from the current HEAD, each Worker writes only inside its worktree, and the tool returns the resulting branch name and path. The Orchestrator then opens one PR per branch.

Consequence: the Foundation Phase **must end with a git commit** before any Worker is dispatched, because worktrees fork from the current HEAD. If the Orchestrator forgets to commit, Workers fork from a state that lacks the design tokens and primitives, and the Fleet drifts — every Section reinvents its own typography. This is the single most failure-prone step of the demo and must be enforced by either a hook or the orchestrator skill itself.
