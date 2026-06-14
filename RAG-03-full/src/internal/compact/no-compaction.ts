// §07 Compaction Strategies — NoCompaction.
// Pass-through strategy: messages are never modified.
// Use when you want to manage context budgets manually via /compact commands.

import type { CompactionStrategy } from "./index.js";
import type { Message } from "../api/types.js";

export class NoCompaction implements CompactionStrategy {
  async compact(messages: Message[]): Promise<Message[]> {
    return messages;
  }
}
