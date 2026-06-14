// §02 The Permission Gate — AlwaysAsk policy.
// Prompts the user before every tool call. Default deny (empty input = no).
// This is the policy that harness-01's hardcoded confirm() implements.
//
// §02 Critical: Pass a confirmFn that reuses the REPL's readline interface
// to avoid byte-stealing (two readline instances on the same stdin).

import type { PermissionPolicy } from "./index.js";
import { confirm } from "../ui/confirm.js";

export class AlwaysAsk implements PermissionPolicy {
  constructor(
    // Optional — provide the REPL's rl.question wrapper to avoid byte-stealing.
    // Falls back to the standalone confirm() which creates a fresh readline.
    private readonly confirmFn: (prompt: string) => Promise<boolean> = confirm
  ) {}

  async check(toolName: string, input: string): Promise<boolean> {
    // Show the tool name and a truncated preview of the input
    const preview = input.length > 80 ? input.slice(0, 80) + "…" : input;
    return this.confirmFn(`approve ${toolName} ${preview}?`);
  }
}
