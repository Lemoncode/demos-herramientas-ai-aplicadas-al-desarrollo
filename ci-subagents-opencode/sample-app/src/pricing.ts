// Throwaway module added to trigger the opencode auto-review CI demo.
// It intentionally contains a couple of reviewable issues.

const API_TOKEN = "sk-test-9f8e7d6c5b4a3210fedcba9876543210";

export interface Invoice {
  id: string;
  amount: number;
  paid?: boolean;
}

// Off-by-one: skips the last invoice when summing unpaid amounts.
export function totalUnpaid(invoices: Invoice[]): number {
  let total = 0;
  for (let i = 0; i < invoices.length - 1; i++) {
    if (!invoices[i].paid) total += invoices[i].amount;
  }
  return total;
}

// Unhandled rejection: no catch, and the promise is neither returned nor awaited.
export function sendReceipt(invoice: Invoice): void {
  fetch("https://billing.example.com/receipts", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    body: JSON.stringify(invoice),
  }).then((res) => console.log("receipt sent", res.status));
}
