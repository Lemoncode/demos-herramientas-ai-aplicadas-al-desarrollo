// Main loop for one assistant response.
//
// The model may answer directly, or it may ask to run one or more tools.
// When tools are requested, this loop runs them, sends the results back to the
// model, and repeats until the model returns a final text answer.
//
// `messages` is the conversation history. It grows during the session because
// each provider call needs the previous user messages, assistant replies, and
// tool results.

import type { Provider } from "../provider/index.js";
import { ProviderError } from "../provider/index.js";
import type { Registry } from "../tool/registry.js";
import type { Message, Block } from "../api/types.js";
import {
  printText,
  printError,
  printToolCall,
  printToolResult,
} from "../ui/output.js";
import { confirm } from "../ui/confirm.js";

export interface LoopOptions {
  // When true, every tool call requires interactive y/n approval.
  // The default is true so commands do not run silently.
  requireConfirm?: boolean;
}

// Runs one user turn. This may involve several provider calls if the model
// needs tools before it can produce the final answer.
// Updates `messages` in place so main.ts keeps the full conversation.
export async function runAgentLoop(
  provider: Provider,
  registry: Registry,
  messages: Message[],
  options: LoopOptions = {},
): Promise<void> {
  const { requireConfirm = true } = options;

  while (true) {
    let response;
    try {
      // Send the full history, plus the list of tools the model can request.
      response = await provider.send(messages, registry.definitions());
    } catch (err) {
      if (err instanceof ProviderError) {
        printError(`provider error: ${err.message}`);
        return;
      }
      throw err;
    }

    // Save the assistant response before running tools. The next provider call
    // must include both the tool request and the matching tool result.
    messages.push({ role: "assistant", content: response.content });

    if (response.stopReason !== "tool_use") {
      // No tool was requested, so print the final answer and return to main.ts.
      for (const block of response.content) {
        if (block.type === "text") {
          printText(block.text);
        }
      }
      return;
    }

    // Collect every tool result from this assistant response.
    // They will be sent back together as one message.
    const toolResults: Block[] = [];

    for (const block of response.content) {
      if (block.type === "text") {
        // The model may explain what it is about to do before using a tool.
        printText(block.text);
      }

      if (block.type === "tool_use") {
        printToolCall(block.toolName, block.toolInput);

        // Ask the user before running the requested tool.
        if (requireConfirm) {
          const approved = await confirm(`approve using: ${block.toolName}?`);

          if (!approved) {
            // Tell the model the user rejected the tool call.
            toolResults.push({
              type: "tool_result",
              toolUseId: block.toolUseId,
              toolResult: "user denied this tool call",
              isError: true,
            });
            continue;
          }
        }

        const { result, isError } = await registry.execute(
          block.toolName,
          block.toolInput,
        );

        printToolResult(result, isError);

        // Link the result to the exact tool request that produced it.
        // Providers reject the next call if this id does not match.
        toolResults.push({
          type: "tool_result",
          toolUseId: block.toolUseId,
          toolResult: result,
          isError,
        });
      }
    }

    // Send tool results back to the model. If the provider claimed there was a
    // tool request but did not include one, avoid sending an empty message.
    if (toolResults.length > 0) {
      messages.push({ role: "user", content: toolResults });
    }
  }
}
