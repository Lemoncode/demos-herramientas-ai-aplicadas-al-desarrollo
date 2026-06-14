// §01 write_file tool — updated in §18 to show diff before writing.
// When DIFF_APPROVAL=true (default), shows a colored unified diff and
// asks for confirmation before overwriting files.
// When DIFF_APPROVAL=false, writes silently (for automated pipelines).

import * as fs from "fs/promises";
import * as path from "path";
import type { Tool } from "./registry.js";
import type { ToolDef } from "../api/types.js";
import { approveWriteDiff } from "../ui/diff-viewer.js";

export class WriteFileTool implements Tool {
  private diffApproval: boolean;

  constructor(diffApproval = process.env.DIFF_APPROVAL !== "false") {
    this.diffApproval = diffApproval;
  }

  definition(): ToolDef {
    return {
      name: "write_file",
      description:
        "Write content to a file, creating it (and parent directories) if needed.",
      inputSchema: {
        path: { type: "string", description: "The file path to write to" },
        content: { type: "string", description: "The text content to write" },
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

    if (!filePath.trim()) return { result: "empty path", isError: true };

    // §18: Show diff and ask for approval before writing
    if (this.diffApproval) {
      let approved: boolean;
      try {
        approved = await approveWriteDiff(filePath, content);
      } catch (err: unknown) {
        return {
          result: `diff read error: ${err instanceof Error ? err.message : String(err)}`,
          isError: true,
        };
      }
      if (!approved) {
        return { result: "user rejected the diff — file not written", isError: true };
      }
    }

    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, "utf-8");
      return { result: `wrote ${content.length} chars to ${filePath}`, isError: false };
    } catch (err: unknown) {
      return {
        result: err instanceof Error ? err.message : "write failed",
        isError: true,
      };
    }
  }
}
