import type { Plugin } from "@opencode-ai/plugin"

export default (async ({ config, $ }) => {
  const isCLAUDE = await $`test -f .claude/settings.json && echo yes || echo no`.text().then(s => s.trim() === "yes")
  if (!isCLAUDE) return {}

  return {
    // Plugin config hooks
  }
}) satisfies Plugin