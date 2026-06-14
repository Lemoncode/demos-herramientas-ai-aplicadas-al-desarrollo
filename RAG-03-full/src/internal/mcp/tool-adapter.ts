// §14 MCP Support — adapter that wraps an MCP tool as a harness Tool.
// Lets MCP server tools be registered in the Registry alongside native tools.
//
// §14: Tools are prefixed with "mcp_" to avoid name collisions with native tools
// and to make delegation explicit in the system prompt.

import type { Tool } from "../tool/registry.js";
import type { ToolDef } from "../api/types.js";
import type { McpClient } from "./client.js";

export class McpToolAdapter implements Tool {
  constructor(
    private readonly client: McpClient,
    private readonly toolName: string,
    private readonly toolDescription: string,
    private readonly toolSchema: Record<string, unknown>
  ) {}

  definition(): ToolDef {
    return {
      name: `mcp_${this.toolName}`,
      description: `[MCP] ${this.toolDescription}`,
      inputSchema: this.toolSchema,
    };
  }

  async execute(rawInput: string): Promise<{ result: string; isError: boolean }> {
    let args: Record<string, unknown>;
    try {
      args = JSON.parse(rawInput) as Record<string, unknown>;
    } catch {
      return { result: `invalid JSON input: ${rawInput}`, isError: true };
    }
    return this.client.callTool(this.toolName, args);
  }
}

// Register all tools from an MCP client into the registry.
// Returns the number of tools registered.
export async function registerMcpTools(
  client: McpClient,
  registry: { register: (tool: Tool) => void }
): Promise<number> {
  const tools = await client.listTools();
  for (const tool of tools) {
    registry.register(
      new McpToolAdapter(client, tool.name, tool.description, tool.inputSchema)
    );
  }
  return tools.length;
}
