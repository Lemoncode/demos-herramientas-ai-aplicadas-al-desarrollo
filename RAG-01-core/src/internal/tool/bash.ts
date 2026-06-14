// §01 The Agent Loop — bash tool. Executes shell commands and returns output.
// §02: Never throws — stderr and non-zero exit codes become isError:true results.
// The model receives the error text and can attempt a corrected command.

import { exec } from "child_process";
import { promisify } from "util";
import type { Tool } from "./registry.js";
import type { ToolDef } from "../api/types.js";

const execAsync = promisify(exec);

export class BashTool implements Tool {
  definition(): ToolDef {
    return {
      name: "bash",
      description:
        "Execute a shell command and return its stdout + stderr output. " +
        "Use only when the user explicitly asks to run a command or when " +
        "the answer requires command output. Avoid for normal conversation.",
      inputSchema: {
        command: {
          type: "string",
          description: "The shell command to execute",
        },
      },
      required: ["command"],
    };
  }

  async execute(rawInput: string): Promise<{ result: string; isError: boolean }> {
    let command: string;
    try {
      const parsed = JSON.parse(rawInput) as { command?: string };
      command = parsed.command ?? "";
    } catch {
      return { result: `invalid JSON input: ${rawInput}`, isError: true };
    }

    if (!command.trim()) {
      return { result: "empty command", isError: true };
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 30_000,
        maxBuffer: 1024 * 1024,
      });
      const output = (stdout + stderr).trim();
      return { result: output || "(no output)", isError: false };
    } catch (err: unknown) {
      // Node's exec errors carry stdout/stderr on the thrown object.
      // We narrow carefully rather than asserting, since err is unknown.
      const stdout = (err != null && typeof err === "object" && "stdout" in err)
        ? String((err as { stdout: unknown }).stdout ?? "")
        : "";
      const stderr = (err != null && typeof err === "object" && "stderr" in err)
        ? String((err as { stderr: unknown }).stderr ?? "")
        : "";
      const message = err instanceof Error ? err.message : "command failed";
      const output = (stdout + stderr).trim();
      return { result: output || message, isError: true };
    }
  }
}
