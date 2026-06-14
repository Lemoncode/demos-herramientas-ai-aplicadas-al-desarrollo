// §14 MCP Support — MCP client connecting to a stdio MCP server.
// MCP (Model Context Protocol) is an open standard for connecting AI agents
// to external data sources and tools.
//
// Usage: instantiate McpClient, call connectStdio(command), then listTools()
// to get available tools. Pass each through McpToolAdapter to register it.

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { printInfo, printError } from "../ui/output.js";

export interface McpToolInfo {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export class McpClient {
  private client: Client;
  private connected = false;

  constructor() {
    this.client = new Client({ name: "harness-03", version: "1.0.0" });
  }

  // Connect to an MCP server launched via a shell command.
  // Example: "npx -y @modelcontextprotocol/server-filesystem /tmp"
  async connectStdio(command: string): Promise<void> {
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0];
    if (!cmd) throw new Error("MCP_SERVER_CMD is empty — provide a valid command");
    const args = parts.slice(1);

    const transport = new StdioClientTransport({ command: cmd, args });
    await this.client.connect(transport);
    this.connected = true;
    printInfo(`MCP: connected to ${command}`);
  }

  async listTools(): Promise<McpToolInfo[]> {
    if (!this.connected) return [];
    const { tools } = await this.client.listTools();
    return tools.map((t) => ({
      name: t.name,
      description: t.description ?? "",
      // inputSchema.properties contains the parameter definitions
      inputSchema: (t.inputSchema as { properties?: Record<string, unknown> }).properties ?? {},
    }));
  }

  async callTool(
    name: string,
    args: Record<string, unknown>
  ): Promise<{ result: string; isError: boolean }> {
    try {
      const response = await this.client.callTool({ name, arguments: args });
      const text = (response.content as Array<{ type: string; text?: string }>)
        .filter((c) => c.type === "text")
        .map((c) => c.text ?? "")
        .join("\n");
      return {
        result: text || "(no output)",
        isError: response.isError === true,
      };
    } catch (err: unknown) {
      printError(`MCP tool error: ${err instanceof Error ? err.message : String(err)}`);
      return { result: err instanceof Error ? err.message : String(err), isError: true };
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.close();
      this.connected = false;
    }
  }
}
