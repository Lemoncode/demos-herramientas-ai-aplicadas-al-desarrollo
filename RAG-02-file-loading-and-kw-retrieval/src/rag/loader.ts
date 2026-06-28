// Loads the CV markdown file from disk.
// Keeping I/O in its own module makes it easy to swap the source later
// (e.g. fetch from URL, read from a database) without touching the pipeline.

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CV_PATH = path.resolve(__dirname, "../../data/cv.md");

/**
 * Reads the CV markdown file used as the retrieval corpus.
 *
 * @returns Raw markdown content from `data/cv.md`.
 */
export async function loadCV(): Promise<string> {
	return fs.readFile(CV_PATH, "utf-8");
}
