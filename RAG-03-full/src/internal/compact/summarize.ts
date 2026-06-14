// §07 Compaction Strategies — Summarize.
// When messages exceed `threshold`, sends the older half to the model for
// summarization, then replaces those messages with a single synthetic
// "[earlier conversation summary]" user message.
//
// Cost: one extra API call per compaction event.
// Benefit: preserves semantic context that SlidingWindow would discard.
//
// §07 Pitfall — recursion: the summarizer calls provider.send() directly.
// Never invoke compact() inside a provider — infinite recursion.

import type { CompactionStrategy } from "./index.js";
import { safeSplitPoint } from "./index.js";
import type { Message } from "../api/types.js";
import type { Provider } from "../provider/index.js";
import { printInfo } from "../ui/output.js";

const SUMMARIZE_SYSTEM =
  "You are a conversation summarizer. Condense the conversation below into a " +
  "concise summary that preserves key facts, decisions, and code produced. " +
  "Output only the summary — no commentary.";

export class Summarize implements CompactionStrategy {
  constructor(
    private readonly provider: Provider,
    // Compact when history exceeds this many messages
    private readonly threshold: number = 40,
    // Keep this many recent messages untouched after compaction
    private readonly keepRecent: number = 10
  ) {}

  async compact(messages: Message[]): Promise<Message[]> {
    if (messages.length < this.threshold) return messages;

    // Find a safe boundary near (length - keepRecent)
    const desired = messages.length - this.keepRecent;
    const splitAt = safeSplitPoint(messages, desired);

    if (splitAt === 0) return messages; // nothing safe to compact

    const toSummarize = messages.slice(0, splitAt);
    const toKeep = messages.slice(splitAt);

    printInfo(`Compacting ${toSummarize.length} messages into a summary…`);

    // Build a readable transcript of the messages to summarize
    const transcript = toSummarize
      .map((m) => {
        const text = m.content
          .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
          .map((b) => b.text)
          .join("\n");
        return `${m.role.toUpperCase()}: ${text}`;
      })
      .join("\n\n");

    try {
      // Single-shot call — no tools, no loop
      // Prepend summarization instructions to the transcript since Provider.send()
      // has no separate system parameter — the provider was initialized with the
      // main agent's system prompt, so we include our instructions inline.
      const summaryMessages: Message[] = [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${SUMMARIZE_SYSTEM}\n\n---\n\n${transcript}`,
            },
          ],
        },
      ];
      const response = await this.provider.send(summaryMessages, []);
      const summaryText = response.content
        .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
        .map((b) => b.text)
        .join("\n");

      // Synthetic message that replaces the compacted portion
      const syntheticMessage: Message = {
        role: "user",
        content: [
          {
            type: "text",
            text: `[Earlier conversation summary]\n${summaryText}`,
          },
        ],
      };

      return [syntheticMessage, ...toKeep];
    } catch {
      // §07: If summarization fails, fall back to keeping recent messages silently
      printInfo("Summarization failed — falling back to keeping recent messages.");
      return toKeep;
    }
  }
}
