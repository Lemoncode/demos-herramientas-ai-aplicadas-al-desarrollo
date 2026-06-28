// §02 The Permission Gate — interactive y/n before tool execution.
// Default deny: empty input, EOF, or unrecognized characters all return false.
// This is the conservative stance required for shell commands.
// §02 Critical: Only one readline reader on stdin at a time — multiple
// readers cause byte-stealing races. Use closeConfirm() on REPL exit.

import * as readline from "readline";

/**
 * Asks the user to approve a potentially sensitive tool action.
 *
 * This helper defaults to denial: only `y` or `yes` approves the action. Empty
 * input, EOF, or any other answer returns `false`.
 *
 * @param prompt Human-readable approval prompt.
 * @returns Whether the user explicitly approved.
 */
export async function confirm(prompt: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Create a fresh readline for each question. Safe because the REPL
    // is suspended (awaiting the agent loop) when confirm() is called.
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`\x1b[33m${prompt}\x1b[0m [y/n] `, (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();
      // Explicit "y" or "yes" only — default deny
      resolve(trimmed === "y" || trimmed === "yes");
    });
  });
}
