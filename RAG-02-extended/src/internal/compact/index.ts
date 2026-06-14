// §07 Compaction Strategies — interface for managing conversation length.
// Compaction runs at the START of each agent loop iteration.
// Most calls pass messages through unchanged; strategies trigger when
// thresholds are exceeded.
//
// Three implementations:
//   NoCompaction     — pass-through (default)
//   SlidingWindow    — drop old messages, keep last N
//   Summarize        — condense old messages into a synthetic summary message

import type { Message } from "../api/types.js";

export interface CompactionStrategy {
  compact(messages: Message[]): Promise<Message[]>;
}

// §07 Critical: "Safe split" — find a message boundary that won't leave
// an orphaned tool_result block. A tool_result without its matching tool_use
// causes a 400 API error.
//
// Walk backward from `desired` to find a user message that contains only
// text blocks (not tool results). That's the safe cut point.
export function safeSplitPoint(messages: Message[], desired: number): number {
  let i = Math.min(desired, messages.length - 1);
  while (i > 0) {
    const msg = messages[i];
    if (
      msg.role === "user" &&
      msg.content.every((b) => b.type === "text")
    ) {
      return i;
    }
    i--;
  }
  return 0; // fallback: keep everything
}
