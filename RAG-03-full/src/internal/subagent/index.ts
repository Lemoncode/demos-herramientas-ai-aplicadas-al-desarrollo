// §11 Subagents — interface and registry.
// A subagent is a nested Agent with its own context, tool subset, and system prompt.
// It runs synchronously (from the parent's perspective) and returns its output as a string.
//
// The parent agent invokes a subagent via a DelegateTool registered in main.ts.
// DelegateTool lives in main.ts (not here) to avoid the import cycle:
//   tool → subagent → agent → tool  ← cycle!
//
// §11 Registration: subagents require runtime registration (not init()-style)
// because they need provider/tool references that don't exist at module load.

export interface Subagent {
  name(): string;
  description(): string;
  run(task: string): Promise<string>;
}

export class SubagentRegistry {
  private subagents = new Map<string, Subagent>();

  register(subagent: Subagent): void {
    this.subagents.set(subagent.name(), subagent);
  }

  get(name: string): Subagent | undefined {
    return this.subagents.get(name);
  }

  all(): Subagent[] {
    return [...this.subagents.values()];
  }
}
