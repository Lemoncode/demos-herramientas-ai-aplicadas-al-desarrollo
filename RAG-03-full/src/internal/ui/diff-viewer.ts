// §18 Diff Approval — show a unified diff before writing files.
// Intercepts write_file calls so the user can review changes before they land.
// Returns false if rejected — write_file returns isError:true to the model.
//
// Uses the `diff` npm package for unified diff generation.
// Colored output: green = added, red = removed, cyan = header/hunk markers.

import { createTwoFilesPatch } from "diff";
import * as fs from "fs/promises";
import { confirm } from "./confirm.js";
import { printText } from "./output.js";

const ADD    = "\x1b[32m";
const REMOVE = "\x1b[31m";
const META   = "\x1b[36m";
const RESET  = "\x1b[0m";

function colorDiff(diffText: string): string {
  return diffText
    .split("\n")
    .map((line) => {
      if (line.startsWith("+") && !line.startsWith("+++")) return `${ADD}${line}${RESET}`;
      if (line.startsWith("-") && !line.startsWith("---")) return `${REMOVE}${line}${RESET}`;
      if (line.startsWith("@@") || line.startsWith("---") || line.startsWith("+++"))
        return `${META}${line}${RESET}`;
      return line;
    })
    .join("\n");
}

// Show a colored diff between the current file content and proposed new content.
// Returns true if the user approves (or content is unchanged), false if rejected.
export async function approveWriteDiff(
  filePath: string,
  newContent: string
): Promise<boolean> {
  let existingContent = "";
  try {
    existingContent = await fs.readFile(filePath, "utf-8");
  } catch (err: unknown) {
    if ((err as { code?: string }).code !== "ENOENT") throw err;
    // New file — show entire content as additions
  }

  if (existingContent === newContent) return true; // no change — auto-approve

  const patch = createTwoFilesPatch(
    `a/${filePath}`,
    `b/${filePath}`,
    existingContent,
    newContent,
    "",
    "",
    { context: 3 }
  );

  printText("\n" + colorDiff(patch));
  return confirm(`Apply changes to ${filePath}?`);
}
