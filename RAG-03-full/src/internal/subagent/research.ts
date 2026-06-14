// §11 Subagents — Research subagent.
// Spawns a read-only agent to investigate files or gather information.
// Uses a curated tool subset (read_file only) — no bash, no write_file.
//
// §11: Subagents use quiet:true so their output doesn't pollute the parent's
// terminal.
//
// §11 Critical: The model tends to solve problems directly rather than
// delegating. The parent's system prompt must EXPLICITLY instruct
// "call delegate_research rather than reading files yourself."

import type { Subagent } from "./index.js";
import type { Provider } from "../provider/index.js";
import type { Registry } from "../tool/registry.js";
import { Agent } from "../agent/agent.js";
import { AlwaysAllow } from "../permission/always-allow.js";

export class ResearchSubagent implements Subagent {
  constructor(
    private readonly provider: Provider,
    // Receives a read-only subset of the parent registry: only read_file
    private readonly tools: Registry
  ) {}

  name(): string { return "research"; }

  description(): string {
    return (
      "Delegate a read-only investigation task to a research sub-agent. " +
      "The sub-agent can only read files (no bash, no writes). " +
      "Use when you need to read and analyze multiple files. Returns a summary of findings."
    );
  }

  async run(task: string): Promise<string> {
    // §11: quiet=true (no terminal output), AlwaysAllow (no permission gate for subagents)
    const agent = new Agent({
      provider: this.provider,
      registry: this.tools,
      permissionPolicy: new AlwaysAllow(),
      maxTurns: 10,
      quiet: true,
      logPrefix: "  ↳ ",
    });
    // Note: sub-agent inherits the parent provider's system prompt.
    // Its role is constrained by the read-only tool subset, not a separate system prompt.
    return agent.send(task);
  }
}
