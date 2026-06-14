// §07 Compaction Strategies — SlidingWindow.
// Retains only the last `windowSize` messages. Zero API cost.
// Trade-off: loses historical context. Good for short-lived tasks.
//
// Uses safeSplitPoint() to avoid orphaning tool_result blocks.

import type { CompactionStrategy } from "./index.js";
import { safeSplitPoint } from "./index.js";
import type { Message } from "../api/types.js";

export class SlidingWindow implements CompactionStrategy {
  constructor(private readonly windowSize: number = 20) {}

  async compact(messages: Message[]): Promise<Message[]> {
    if (messages.length <= this.windowSize) return messages;

    const desired = messages.length - this.windowSize;
    const splitAt = safeSplitPoint(messages, desired);

    // Keep everything from splitAt onward
    return messages.slice(splitAt);
  }
}
