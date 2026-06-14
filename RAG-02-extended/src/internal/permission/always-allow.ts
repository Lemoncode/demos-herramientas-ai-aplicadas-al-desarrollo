// §02 The Permission Gate — AlwaysAllow policy.
// Auto-approves every tool call. Use in automated pipelines or trusted environments.
// WARNING: grants the model unrestricted shell access.

import type { PermissionPolicy } from "./index.js";

export class AlwaysAllow implements PermissionPolicy {
  async check(_toolName: string, _input: string): Promise<boolean> {
    return true;
  }
}
