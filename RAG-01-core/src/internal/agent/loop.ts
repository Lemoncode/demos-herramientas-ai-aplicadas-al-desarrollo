// §01 The Agent Loop — the core prompt → send → tool → repeat cycle.
//
// The loop runs while stopReason === "tool_use". On each iteration:
//   1. Send the full message history to the provider
//   2. Append the response to history (assistant turn)
//   3. If any tool_use blocks: execute each tool, append results (user turn)
//   4. If stopReason !== "tool_use": print text output, exit loop
//
// §06 Conversation State: the messages array accumulates across turns.
// The entire history is sent on every API call — models are stateless.
// The caller owns the array and can clear it (/clear command, §05).

import type { Provider } from "../provider/index.js";
import { ProviderError } from "../provider/index.js";
import type { Registry } from "../tool/registry.js";
import type { Message, Block } from "../api/types.js";
import { printText, printError, printToolCall, printToolResult } from "../ui/output.js";
import { confirm } from "../ui/confirm.js";

export interface LoopOptions {
  // When true, every tool call requires interactive y/n approval.
  // §02 The Permission Gate: default is true (always ask).
  requireConfirm?: boolean;
  // Optional confirm function — pass the REPL's readline.question() wrapper
  // to avoid creating a second readline interface on stdin (byte-stealing).
  // Falls back to the standalone confirm() from ../ui/confirm.js.
  confirm?: (prompt: string) => Promise<boolean>;
}

// Run one agent turn: send the latest user message, handle tool calls,
// and return when the model stops requesting tools.
// Mutates `messages` in-place — the caller's array is updated.
export async function runAgentLoop(
  provider: Provider,
  registry: Registry,
  messages: Message[],
  options: LoopOptions = {}
): Promise<void> {
  const { requireConfirm = true, confirm: confirmFn = confirm } = options;

  while (true) {
    let response;
    try {
      response = await provider.send(messages, registry.definitions());
    } catch (err) {
      if (err instanceof ProviderError) {
        printError(`provider error: ${err.message}`);
        return;
      }
      throw err;
    }

    // §06: Append the assistant's full response to history before inspecting it.
    // This must happen BEFORE tool execution so the next loop iteration
    // includes this turn's tool_use blocks.
    messages.push({ role: "assistant", content: response.content });

    if (response.stopReason !== "tool_use") {
      // Print any text blocks and return to the REPL
      for (const block of response.content) {
        if (block.type === "text") {
          printText(block.text);
        }
      }
      return;
    }

    // Collect tool results to append as a single user message.
    // §01: All results from one turn go in one user message — not one per tool.
    const toolResults: Block[] = [];

    for (const block of response.content) {
      if (block.type === "text") {
        // Print any text that accompanies tool use (e.g. "Let me check that...")
        printText(block.text);
      }

      if (block.type === "tool_use") {
        printToolCall(block.toolName, block.toolInput);

        // §02 The Permission Gate: ask before executing
        if (requireConfirm) {
          const approved = await confirmFn(`approve ${block.toolName}?`);
          if (!approved) {
            // §02: Denial returns isError:true — model receives feedback and adapts
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
          block.toolInput
        );

        printToolResult(result, isError);

        // §01 Critical: toolUseId must match the tool_use block's id.
        // Breaking this link causes a 400 API error on the next call.
        toolResults.push({
          type: "tool_result",
          toolUseId: block.toolUseId,
          toolResult: result,
          isError,
        });
      }
    }

    // §06: Append all tool results as a single user-role message.
    // Guard against empty toolResults: if stopReason was "tool_use" but
    // no tool_use blocks appeared (unexpected API behavior), don't push
    // an empty user message, which some providers reject with 400.
    if (toolResults.length > 0) {
      messages.push({ role: "user", content: toolResults });
    }
  }
}
