// §09 Plug-and-Play Tools — Tool interface and Registry.
// The Registry maps tool names to implementations and dispatches execution.
// The agent loop only calls registry.definitions() and registry.execute() —
// it never imports individual tools directly.
//
// In Go, tools self-register via init(). TypeScript has no init(), so tools
// are registered explicitly in main.ts after the registry is created.

import type { ToolDef } from "../api/types.js";

// Every tool implements this interface.
// execute() NEVER throws — it returns { result, isError: true } on failure.
// §02: Returning isError: true lets the model treat tool failures as feedback
// and attempt self-correction in the next loop iteration.
export interface Tool {
  definition(): ToolDef;
  execute(input: string): Promise<{ result: string; isError: boolean }>;
}

export class Registry {
  private tools = new Map<string, Tool>();

  register(tool: Tool): void {
    this.tools.set(tool.definition().name, tool);
  }

  // Returns tool definitions sorted by name.
  // §17: Stable ordering is required for prompt cache hits — random ordering
  // changes the cache prefix on every call.
  definitions(): ToolDef[] {
    return [...this.tools.values()]
      .sort((a, b) => a.definition().name.localeCompare(b.definition().name))
      .map((t) => t.definition());
  }

  // Dispatch a tool call by name. Returns an error result for unknown tools.
  async execute(
    name: string,
    input: string
  ): Promise<{ result: string; isError: boolean }> {
    const tool = this.tools.get(name);
    if (!tool) {
      return { result: `unknown tool: ${name}`, isError: true };
    }
    return tool.execute(input);
  }

  // §11: Return a new registry containing only the named tools.
  // Used to give subagents a curated, read-only tool subset.
  subset(...names: string[]): Registry {
    const sub = new Registry();
    for (const name of names) {
      const tool = this.tools.get(name);
      if (tool) sub.register(tool);
    }
    return sub;
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }
}
