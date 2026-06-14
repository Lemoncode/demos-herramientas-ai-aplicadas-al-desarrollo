// §01 The Agent Loop — read_file tool. Returns file contents as a string.
// §02: File-not-found and permission errors return isError:true, not exceptions.

import * as fs from "fs/promises";
import type { Tool } from "./registry.js";
import type { ToolDef } from "../api/types.js";

export class ReadFileTool implements Tool {
  definition(): ToolDef {
    return {
      name: "read_file",
      description:
        "Read the contents of a file and return them as a string. " +
        "Use absolute paths or paths relative to the current working directory.",
      inputSchema: {
        path: {
          type: "string",
          description: "The file path to read",
        },
      },
      required: ["path"],
    };
  }

  async execute(rawInput: string): Promise<{ result: string; isError: boolean }> {
    let path: string;
    try {
      const parsed = JSON.parse(rawInput) as { path?: string };
      path = parsed.path ?? "";
    } catch {
      return { result: `invalid JSON input: ${rawInput}`, isError: true };
    }

    if (!path.trim()) {
      return { result: "empty path", isError: true };
    }

    try {
      const content = await fs.readFile(path, "utf-8");
      return { result: content, isError: false };
    } catch (err: unknown) {
      const fsErr = err as { message?: string };
      return { result: fsErr.message ?? "read failed", isError: true };
    }
  }
}
