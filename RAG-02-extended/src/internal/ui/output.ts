// §04 UI Polish — consistent terminal output helpers.
// All output goes through here so formatting can change in one place.
// ANSI color codes: \x1b[33m = yellow, \x1b[31m = red, \x1b[32m = green,
// \x1b[36m = cyan, \x1b[0m = reset.

export function printText(text: string): void {
  process.stdout.write(text + "\n");
}

export function printError(message: string): void {
  process.stderr.write(`\x1b[31m[error]\x1b[0m ${message}\n`);
}

// §01: Print every tool invocation before execution — visible audit trail
export function printToolCall(name: string, input: string): void {
  process.stdout.write(`\x1b[33m[tool]\x1b[0m ${name} ${input}\n`);
}

// Truncate long results to keep the terminal readable
export function printToolResult(result: string, isError: boolean): void {
  const prefix = isError ? "\x1b[31m[✗]\x1b[0m" : "\x1b[32m[✓]\x1b[0m";
  const truncated = result.length > 200 ? result.slice(0, 200) + "…" : result;
  process.stdout.write(`${prefix} ${truncated}\n`);
}

export function printInfo(message: string): void {
  process.stdout.write(`\x1b[36m[info]\x1b[0m ${message}\n`);
}

export function printPrompt(): void {
  process.stdout.write("\x1b[1m> \x1b[0m");
}
