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

	/**
	 * Adds or replaces a tool implementation by its declared name.
	 *
	 * @param tool Tool implementation to make available to the agent loop.
	 */
	register(tool: Tool): void {
		this.tools.set(tool.definition().name, tool);
	}

	/**
	 * Returns model-facing tool definitions in stable name order.
	 *
	 * Stable ordering keeps provider prompts deterministic, which matters for
	 * prompt caching and makes terminal traces easier to compare.
	 *
	 * @returns Sorted tool definitions.
	 */
	definitions(): ToolDef[] {
		return [...this.tools.values()]
			.sort((a, b) => a.definition().name.localeCompare(b.definition().name))
			.map((t) => t.definition());
	}

	/**
	 * Dispatches a model-requested tool call by name.
	 *
	 * Unknown tools are converted into an error result instead of throwing. That
	 * keeps the provider loop alive and gives the model feedback it can react to.
	 *
	 * @param name Tool name requested by the model.
	 * @param input Raw JSON input requested by the model.
	 * @returns Tool result plus an error marker.
	 */
	async execute(
		name: string,
		input: string,
	): Promise<{ result: string; isError: boolean }> {
		const tool = this.tools.get(name);
		if (!tool) {
			return { result: `unknown tool: ${name}`, isError: true };
		}
		return tool.execute(input);
	}

	/**
	 * Creates a new registry containing only selected tools.
	 *
	 * This is useful when a caller wants to expose a smaller tool surface without
	 * mutating the original registry.
	 *
	 * @param names Tool names to copy into the new registry.
	 * @returns New registry with the matching tools.
	 */
	subset(...names: string[]): Registry {
		const sub = new Registry();
		for (const name of names) {
			const tool = this.tools.get(name);
			if (tool) sub.register(tool);
		}
		return sub;
	}

	/**
	 * Checks whether a tool is registered.
	 *
	 * @param name Tool name to look up.
	 * @returns Whether the registry contains the tool.
	 */
	has(name: string): boolean {
		return this.tools.has(name);
	}
}
