// =============================================================
// Service Contracts — MCP Server
// =============================================================
// Exposes the two services' contracts to the assistant as *tools*,
// instead of describing them in prose. This is the whole point of
// the mcp-first approach: the model can look up the truth, so the
// setup never goes stale the way a hand-written "old vs new" table
// in an AGENTS.md would.
//
// Tools:
//   • get_contract        — the full OpenAPI text for legacy or new
//   • search_contract     — matching lines (find a path/field/operationId)
//   • read_route_handler  — the server.mjs snippet that handles a route
//
// All three read files from the example root. Set SERVICE_SWAP_ROOT
// to override the root when the client launches from elsewhere.
// =============================================================

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const HERE = dirname(fileURLToPath(import.meta.url));
// src/ → mcp-server/ → example root
const ROOT = process.env.SERVICE_SWAP_ROOT
	? resolve(process.env.SERVICE_SWAP_ROOT)
	: resolve(HERE, "..", "..");

const SERVICE_DIR = {
	legacy: "legacy-service",
	new: "new-service",
} as const;

type ServiceName = keyof typeof SERVICE_DIR;

const serviceSchema = z
	.enum(["legacy", "new"])
	.describe('"legacy" for the service being replaced, "new" for its replacement');

function specPath(service: ServiceName): string {
	return resolve(ROOT, SERVICE_DIR[service], "openapi.yaml");
}

function serverPath(service: ServiceName): string {
	return resolve(ROOT, SERVICE_DIR[service], "server.mjs");
}

const server = new McpServer({
	name: "service-contracts",
	version: "1.0.0",
});

// -------------------------------------------------------------
// Tool: get_contract
// -------------------------------------------------------------
server.registerTool(
	"get_contract",
	{
		description:
			"Return the full OpenAPI contract for a service. Use this to read the legacy and new contracts side by side before planning a swap.",
		inputSchema: { service: serviceSchema },
	},
	async ({ service }) => {
		try {
			const text = await readFile(specPath(service), "utf8");
			return { content: [{ type: "text", text }] };
		} catch (error) {
			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Could not read the ${service} contract at ${specPath(service)}: ${
							error instanceof Error ? error.message : String(error)
						}`,
					},
				],
			};
		}
	},
);

// -------------------------------------------------------------
// Tool: search_contract
// -------------------------------------------------------------
server.registerTool(
	"search_contract",
	{
		description:
			"Search an OpenAPI contract for a term and return matching lines with line numbers. Use this to locate a path, field name or operationId without reading the whole file.",
		inputSchema: {
			service: serviceSchema,
			query: z.string().describe("Case-insensitive term to search for"),
		},
	},
	async ({ service, query }) => {
		const lines = (await readFile(specPath(service), "utf8")).split("\n");
		const needle = query.toLowerCase();
		const matches = lines
			.map((line, index) => ({ line, number: index + 1 }))
			.filter(({ line }) => line.toLowerCase().includes(needle));

		const text = matches.length
			? matches.map(({ line, number }) => `${number}: ${line}`).join("\n")
			: `No matches for "${query}" in the ${service} contract.`;

		return { content: [{ type: "text", text }] };
	},
);

// -------------------------------------------------------------
// Tool: read_route_handler
// -------------------------------------------------------------
server.registerTool(
	"read_route_handler",
	{
		description:
			'Return the server.mjs snippet that handles a route for a service, e.g. "/api/v1/users". Use this to confirm real runtime behavior, not just what the spec claims.',
		inputSchema: {
			service: serviceSchema,
			path: z
				.string()
				.describe('The route path as written in the server, e.g. "/v2/customers"'),
		},
	},
	async ({ service, path }) => {
		const lines = (await readFile(serverPath(service), "utf8")).split("\n");
		const index = lines.findIndex((line) => line.includes(path));

		if (index === -1) {
			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Route "${path}" was not found in the ${service} server.`,
					},
				],
			};
		}

		const start = Math.max(0, index - 4);
		const end = Math.min(lines.length, index + 12);
		const snippet = lines
			.slice(start, end)
			.map((line, offset) => `${start + offset + 1}: ${line}`)
			.join("\n");

		return { content: [{ type: "text", text: snippet }] };
	},
);

// -------------------------------------------------------------
// Start
// -------------------------------------------------------------
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error(`Service Contracts MCP server running on stdio (root: ${ROOT}).`);
}

main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
