export function printText(text: string): void {
  process.stdout.write(text + "\n");
}

export function printError(message: string): void {
  process.stderr.write(`\x1b[31m[error]\x1b[0m ${message}\n`);
}

export function printInfo(message: string): void {
  process.stdout.write(`\x1b[36m[info]\x1b[0m ${message}\n`);
}

export function printRag(message: string): void {
  process.stdout.write(`\x1b[35m[rag]\x1b[0m ${message}\n`);
}

export function printPrompt(): void {
  process.stdout.write("\x1b[1m> \x1b[0m");
}
