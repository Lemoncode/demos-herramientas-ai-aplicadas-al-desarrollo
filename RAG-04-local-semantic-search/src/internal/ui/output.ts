import process from "node:process";

export function printText(text: string): void {
	console.log(text);
}

export function printInfo(text: string): void {
	console.log(`\x1b[2m${text}\x1b[0m`);
}

export function printError(text: string): void {
	console.error(`\x1b[31m${text}\x1b[0m`);
}

export function printPrompt(): void {
	process.stdout.write("\x1b[36m>\x1b[0m ");
}

export function printRag(text: string): void {
	console.log(`\x1b[33m[rag]\x1b[0m ${text}`);
}

export function printEmbedding(text: string): void {
	console.log(`\x1b[32m[embedding]\x1b[0m ${text}`);
}
