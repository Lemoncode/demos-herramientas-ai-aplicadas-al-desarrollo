// §02 The Permission Gate — pluggable permission policy interface.
// The agent loop calls policy.check() before every tool execution.
// This replaces the hardcoded confirm() in harness-01.
//
// Policies sit between the agent loop and the tool registry:
//   agent loop → permission policy → registry.execute()
//
// Available policies: AlwaysAllow, AlwaysAsk, AllowList

export interface PermissionPolicy {
  // Returns true if the tool call should proceed, false if denied.
  // Denial becomes isError:true feedback to the model — same as a tool failure.
  check(toolName: string, input: string): Promise<boolean>;
}
