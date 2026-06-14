// §19 Agent Memory — file-based persistent memory tools.
// The model reads and writes a markdown memory file to persist information
// across /clear resets and sessions.
//
// §19 Design: memory is explicit — the model calls these tools intentionally.
// The system prompt instructs the model to call read_memory at session start.
//
// The memory file is human-readable markdown — users can inspect and edit it.

import * as fs from "fs/promises";
import * as path from "path";
import type { Tool } from "../tool/registry.js";
import type { ToolDef } from "../api/types.js";

const DEFAULT_MEMORY_FILE = process.env.MEMORY_FILE ?? ".agent-memory.md";

export class ReadMemoryTool implements Tool {
  constructor(private readonly memoryFile = DEFAULT_MEMORY_FILE) {}

  definition(): ToolDef {
    return {
      name: "read_memory",
      description:
        "Read the persistent memory file. Call this at the start of a new conversation " +
        "to recall preferences, project context, and past decisions.",
      inputSchema: {},
      required: [],
    };
  }

  async execute(_input: string): Promise<{ result: string; isError: boolean }> {
    try {
      const content = await fs.readFile(this.memoryFile, "utf-8");
      return { result: content || "(memory is empty)", isError: false };
    } catch (err: unknown) {
      if ((err as { code?: string }).code === "ENOENT") {
        return {
          result: "(no memory file yet — use write_memory to save something)",
          isError: false,
        };
      }
      return { result: err instanceof Error ? err.message : "read failed", isError: true };
    }
  }
}

export class WriteMemoryTool implements Tool {
  constructor(private readonly memoryFile = DEFAULT_MEMORY_FILE) {}

  definition(): ToolDef {
    return {
      name: "write_memory",
      description:
        "Write to the persistent memory file. Saves user preferences, project context, " +
        "and key decisions for future sessions. Overwrites the entire file — read first " +
        "if you want to append.",
      inputSchema: {
        content: {
          type: "string",
          description: "The markdown content to write to the memory file",
        },
      },
      required: ["content"],
    };
  }

  async execute(rawInput: string): Promise<{ result: string; isError: boolean }> {
    let content: string;
    try {
      const parsed = JSON.parse(rawInput) as { content?: string };
      content = parsed.content ?? "";
    } catch {
      return { result: `invalid JSON input: ${rawInput}`, isError: true };
    }

    try {
      await fs.mkdir(path.dirname(this.memoryFile), { recursive: true });
      await fs.writeFile(this.memoryFile, content, "utf-8");
      return { result: `memory written to ${this.memoryFile}`, isError: false };
    } catch (err: unknown) {
      return { result: err instanceof Error ? err.message : "write failed", isError: true };
    }
  }
}
