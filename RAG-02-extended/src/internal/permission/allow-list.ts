// §02 The Permission Gate — AllowList policy.
// Auto-approves tools in the allow list; prompts for all others.
// Example: allow read_file silently, but ask before bash or write_file.

import type { PermissionPolicy } from "./index.js";
import { confirm } from "../ui/confirm.js";

export class AllowList implements PermissionPolicy {
  private allowed: Set<string>;

  constructor(toolNames: string[]) {
    this.allowed = new Set(toolNames);
  }

  async check(toolName: string, input: string): Promise<boolean> {
    if (this.allowed.has(toolName)) return true;
    const preview = input.length > 80 ? input.slice(0, 80) + "…" : input;
    return confirm(`approve ${toolName} ${preview}?`);
  }
}
