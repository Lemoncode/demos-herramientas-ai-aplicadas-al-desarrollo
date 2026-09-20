# Obsidian Notes MCP Example

This teaching example exposes local Obsidian notes through two MCP tools: `search_notes` and `read_note`.

## Dependency scope

The example is a compatibility baseline for the MCP SDK 1.x and Zod 3.x APIs declared in `package.json`. It does not claim compatibility with newer major versions; review the relevant migration guides before upgrading them.

## Run it locally

```bash
cd mcp-example
npm install
OBSIDIAN_VAULT_PATH=/absolute/path/to/vault npm start
```

Configure the command in your MCP client with `tsx` and the absolute path to `src/index.ts`; the source file includes a Claude Code configuration example.
