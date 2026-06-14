// §10 Project Structure — Agent class.
// Extracts the agent loop into a reusable, configurable object.
// Enables subagents (§11): spawn an Agent with different settings
// (quiet mode, tool subset, different system prompt) without duplication.

import type { Provider } from "../provider/index.js";
import { ProviderError } from "../provider/index.js";
import type { Registry } from "../tool/registry.js";
import type { CompactionStrategy } from "../compact/index.js";
import type { PermissionPolicy } from "../permission/index.js";
import type { Message, Block } from "../api/types.js";
import {
  printText,
  printError,
  printToolCall,
  printToolResult,
  printInfo,
} from "../ui/output.js";
import { withSpinner } from "../ui/spinner.js";

export interface AgentConfig {
  provider: Provider;
  registry: Registry;
  compactor?: CompactionStrategy;
  permissionPolicy?: PermissionPolicy;
  maxTurns?: number;
  // When true, suppress all output — used for subagents (§11)
  quiet?: boolean;
  // Prefix added to log lines — used by subagents for visual nesting
  logPrefix?: string;
}

export class Agent {
  private provider: Provider;
  private registry: Registry;
  private compactor: CompactionStrategy;
  private permissionPolicy: PermissionPolicy;
  private maxTurns: number;
  private quiet: boolean;
  private logPrefix: string;
  // §06: Message history owned by this agent instance
  private messages: Message[] = [];

  constructor(config: AgentConfig) {
    this.provider = config.provider;
    this.registry = config.registry;
    this.compactor = config.compactor ?? { compact: async (m) => m };
    this.permissionPolicy = config.permissionPolicy ?? { check: async () => true };
    this.maxTurns = config.maxTurns ?? 50;
    this.quiet = config.quiet ?? false;
    this.logPrefix = config.logPrefix ?? "";
  }

  // Send a user message and run the agent loop until end_turn.
  // Returns the final text response (useful for subagents).
  async send(userMessage: string): Promise<string> {
    this.messages.push({
      role: "user",
      content: [{ type: "text", text: userMessage }],
    });
    return this.runLoop();
  }

  clearHistory(): void {
    this.messages = [];
  }

  getHistory(): Message[] {
    return [...this.messages];
  }

  private log(message: string): void {
    if (!this.quiet) printText(this.logPrefix + message);
  }

  private logInfo(message: string): void {
    if (!this.quiet) printInfo(this.logPrefix + message);
  }

  private async runLoop(): Promise<string> {
    let turns = 0;
    let finalText = "";

    while (turns < this.maxTurns) {
      // §07: Compact before sending — most passes are no-ops
      this.messages = await this.compactor.compact(this.messages);

      let response;
      try {
        response = await withSpinner(
          "thinking…",
          () => this.provider.send(this.messages, this.registry.definitions())
        );
      } catch (err) {
        if (err instanceof ProviderError) {
          printError(`${this.logPrefix}provider error: ${err.message}`);
          return finalText;
        }
        throw err;
      }

      // §06: Append assistant response before inspecting
      this.messages.push({ role: "assistant", content: response.content });

      if (response.stopReason !== "tool_use") {
        for (const block of response.content) {
          if (block.type === "text") {
            this.log(block.text);
            finalText += block.text;
          }
        }
        return finalText;
      }

      const toolResults: Block[] = [];
      turns++;

      for (const block of response.content) {
        if (block.type === "text") {
          this.log(block.text);
        }

        if (block.type === "tool_use") {
          if (!this.quiet) {
            printToolCall(this.logPrefix + block.toolName, block.toolInput);
          }

          const approved = await this.permissionPolicy.check(
            block.toolName,
            block.toolInput
          );

          if (!approved) {
            toolResults.push({
              type: "tool_result",
              toolUseId: block.toolUseId,
              toolResult: "user denied this tool call",
              isError: true,
            });
            continue;
          }

          const { result, isError } = await this.registry.execute(
            block.toolName,
            block.toolInput
          );

          if (!this.quiet) printToolResult(result, isError);

          toolResults.push({
            type: "tool_result",
            toolUseId: block.toolUseId,
            toolResult: result,
            isError,
          });
        }
      }

      if (toolResults.length > 0) {
        this.messages.push({ role: "user", content: toolResults });
      }
    }

    this.logInfo(`max turns (${this.maxTurns}) reached`);
    return finalText;
  }
}
