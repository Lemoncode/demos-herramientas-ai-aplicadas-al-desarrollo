import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");

const scannedRoots = [
	path.join(projectRoot, "src"),
	path.join(projectRoot, "docs"),
];

const forbiddenPatterns = [
	/condense/i,
	/standalone/i,
	/Follow-up question/i,
	/CONDENSE_PROMPT_TEMPLATE/,
	/printStandalone/,
	/messagesHistory/,
];

/**
 * Recursively lists source and documentation files that should be checked.
 *
 * Test files, build output, and dependencies are excluded so the scope guard
 * only scans the teaching module itself.
 *
 * @param dir Directory to scan.
 * @returns Absolute paths to `.ts` and `.md` files.
 */
function listTextFiles(dir: string): string[] {
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.flatMap((entry) => {
			const absolutePath = path.join(dir, entry.name);

			if (entry.isDirectory()) {
				if (entry.name === "node_modules" || entry.name === "dist") return [];
				return listTextFiles(absolutePath);
			}

			if (
				entry.name.endsWith(".test.ts") ||
				(!entry.name.endsWith(".ts") && !entry.name.endsWith(".md"))
			) {
				return [];
			}

			return [absolutePath];
		});
}

describe("RAG-04 scope", () => {
	it("does not include standalone-question rewriting concepts", () => {
		const offenders = listTextFiles(projectRoot).flatMap((filePath) => {
			const isInScannedRoot = scannedRoots.some((root) =>
				filePath.startsWith(root),
			);

			if (!isInScannedRoot) return [];

			const content = fs.readFileSync(filePath, "utf-8");
			return forbiddenPatterns
				.filter((pattern) => pattern.test(content))
				.map((pattern) => `${path.relative(projectRoot, filePath)}: ${pattern}`);
		});

		assert.deepEqual(offenders, []);
	});
});
