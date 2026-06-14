// §04 UI Polish — terminal spinner shown while the agent is waiting for
// the model to respond. Uses process.stdout.write with \r to overwrite
// the current line — no external dependencies.

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export class Spinner {
  private interval: ReturnType<typeof setInterval> | null = null;
  private frame = 0;

  start(label = "thinking..."): void {
    if (this.interval) return;
    this.frame = 0;
    this.interval = setInterval(() => {
      process.stdout.write(`\r\x1b[36m${FRAMES[this.frame % FRAMES.length]}\x1b[0m ${label}`);
      this.frame++;
    }, 80);
  }

  stop(): void {
    if (!this.interval) return;
    clearInterval(this.interval);
    this.interval = null;
    // Clear the spinner line
    process.stdout.write("\r\x1b[K");
  }
}

// Convenience: run an async task with a spinner
export async function withSpinner<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const spinner = new Spinner();
  spinner.start(label);
  try {
    return await fn();
  } finally {
    spinner.stop();
  }
}
