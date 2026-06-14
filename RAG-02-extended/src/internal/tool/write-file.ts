// §01 The Agent Loop — write_file tool. Creates or overwrites a file.
// §02: Creates parent directories automatically (mkdirp semantics).
// Errors return isError:true so the model can adapt.

import * as fs from "fs/promises";
import * as path from "path";
import type { Tool } from "./registry.js";
import type { ToolDef } from "../api/types.js";

export class WriteFileTool implements Tool {
  definition(): ToolDef {
    return {
      name: "write_file",
      description:
        "Write content to a file, creating it (and any parent directories) if needed. " +
        "Overwrites existing files. Use absolute or relative paths.",
      inputSchema: {
        path: {
          type: "string",
          description: "The file path to write to",
        },
        content: {
          type: "string",
          description: "The text content to write",
        },
      },
      required: ["path", "content"],
    };
  }

  async execute(rawInput: string): Promise<{ result: string; isError: boolean }> {
    let filePath: string;
    let content: string;
    try {
      const parsed = JSON.parse(rawInput) as { path?: string; content?: string };
      filePath = parsed.path ?? "";
      content = parsed.content ?? "";
    } catch {
      return { result: `invalid JSON input: ${rawInput}`, isError: true };
    }

    if (!filePath.trim()) {
      return { result: "empty path", isError: true };
    }

    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, "utf-8");
      return { result: `wrote ${content.length} chars to ${filePath}`, isError: false };
    } catch (err: unknown) {
      const fsErr = err as { message?: string };
      return { result: fsErr.message ?? "write failed", isError: true };
    }
  }
}
