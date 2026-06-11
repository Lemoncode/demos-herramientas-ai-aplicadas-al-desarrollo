// =============================================================
// Obsidian Notes — MCP Server
// =============================================================
// An MCP (Model Context Protocol) server exposes capabilities
// to an AI assistant (Claude Code, Claude Desktop, etc.) through
// a standardised JSON-RPC protocol over stdin/stdout.
//
// This server adds two tools:
//   • search_notes — find notes whose filename or body contains a keyword
//   • read_note    — return the full markdown content of one note
//
// HOW TO CONFIGURE IN CLAUDE CODE
// --------------------------------
// Add this to your project's .claude/settings.json:
//
//   "mcpServers": {
//     "obsidian-notes": {
//       "command": "npx",
//       "args": ["tsx", "/absolute/path/to/mcp-example/src/index.ts"],
//       "env": {
//         "OBSIDIAN_VAULT_PATH": "/absolute/path/to/your/obsidian/vault"
//       }
//     }
//   }
//
// HOW TO RUN MANUALLY (for testing)
// -----------------------------------
//   cd mcp-example && npm install
//   OBSIDIAN_VAULT_PATH=~/Documents/MyVault npm start
// =============================================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { z } from "zod";

// =============================================================
// Configuration
// =============================================================
// The vault path comes from an environment variable so you can
// point the server at different vaults without changing code.
const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH;

if (!VAULT_PATH) {
  // Log to stderr — stdout is reserved for the MCP JSON-RPC stream
  console.error("Error: OBSIDIAN_VAULT_PATH environment variable is not set.");
  console.error("Example: OBSIDIAN_VAULT_PATH=~/Documents/MyVault npm start");
  process.exit(1);
}

// =============================================================
// Helper: collect every .md file in the vault (recursive)
// =============================================================
async function findMarkdownFiles(dir: string): Promise<string[]> {
  // readdir with withFileTypes gives us Dirent objects so we can
  // tell files apart from directories without an extra stat() call.
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    // Skip hidden folders (.obsidian, .git, …) — they are internal
    // to Obsidian or version control and contain no user notes.
    if (entry.name.startsWith(".")) continue;

    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recurse so we pick up notes nested in sub-folders
      const nested = await findMarkdownFiles(fullPath);
      files.push(...nested);
    } else if (extname(entry.name) === ".md") {
      files.push(fullPath);
    }
  }

  return files;
}

// =============================================================
// MCP Server
// =============================================================
// McpServer is the main class from the SDK.
// name + version are metadata the client sees when it connects.
const server = new McpServer({
  name: "obsidian-notes",
  version: "1.0.0",
});

// =============================================================
// Tool: search_notes
// =============================================================
// Claude calls this tool when it wants to find relevant notes.
// It scans every markdown file and returns matches with a snippet.
server.registerTool(
  "search_notes",
  {
    description:
      "Search Obsidian notes by keyword. Returns matching note paths and a short preview of the matching line.",
    inputSchema: {
      query: z.string().describe("Keyword or phrase to search for"),
      max_results: z
        .number()
        .optional()
        .default(10)
        .describe("Maximum number of results to return (default: 10)"),
    },
  },
  async ({ query, max_results }) => {
    const allFiles = await findMarkdownFiles(VAULT_PATH!);
    const lowerQuery = query.toLowerCase();
    const matches: string[] = [];

    for (const filePath of allFiles) {
      if (matches.length >= max_results!) break;

      // Use vault-relative paths so output is shorter and portable
      const relativePath = relative(VAULT_PATH!, filePath);
      const content = await readFile(filePath, "utf8");

      const nameMatch = relativePath.toLowerCase().includes(lowerQuery);
      const contentMatch = content.toLowerCase().includes(lowerQuery);

      if (nameMatch || contentMatch) {
        // Grab the first line that contains the match as a snippet
        const snippet =
          content
            .split("\n")
            .find((line) => line.toLowerCase().includes(lowerQuery))
            ?.trim() ?? "";

        matches.push(`📄 ${relativePath}\n   ${snippet}`);
      }
    }

    const result =
      matches.length === 0
        ? `No notes found for "${query}".`
        : `Found ${matches.length} note(s) for "${query}":\n\n${matches.join("\n\n")}`;

    // MCP tools always return { content: [{ type, text }] }
    return { content: [{ type: "text", text: result }] };
  },
);

// =============================================================
// Tool: read_note
// =============================================================
// Claude calls this after search_notes to read a full note.
// The path should be relative to the vault root.
server.registerTool(
  "read_note",
  {
    description:
      'Read the full markdown content of an Obsidian note. Use the path returned by search_notes, e.g. "Projects/Ideas.md".',
    inputSchema: {
      path: z
        .string()
        .describe(
          'Path to the note relative to the vault root, e.g. "Projects/Ideas.md"',
        ),
    },
  },
  async ({ path: notePath }) => {
    const fullPath = join(VAULT_PATH!, notePath);

    // Guard against path-traversal attacks like "../../etc/passwd"
    if (!fullPath.startsWith(VAULT_PATH!)) {
      return {
        content: [
          { type: "text", text: "Error: path is outside the vault directory." },
        ],
      };
    }

    const content = await readFile(fullPath, "utf8");

    return { content: [{ type: "text", text: content }] };
  },
);

// =============================================================
// Start
// =============================================================
// StdioServerTransport wires the server to Claude Code via
// stdin/stdout — no port, no auth, just pipes.
// Claude Code spawns this process and speaks MCP JSON-RPC to it.
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Obsidian Notes MCP server running on stdio.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
