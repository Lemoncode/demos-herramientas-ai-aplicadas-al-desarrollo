// Sample order-processing module used to demo an AI code reviewer.
// NOTE: This file contains 3 intentionally planted issues for teaching
// purposes. Do not use as a reference implementation.

// Issue 1: hardcoded secret committed to source.
const STRIPE_API_KEY = "sk-live-51NcU8aBcDeFgHiJk1234567890abcdef";

interface Order {
  id: string;
  items: { name: string; price: number }[];
}

// Issue 2: off-by-one bug — the last item in the order is never discounted.
export function applyBulkDiscount(order: Order, discountRate: number): number {
  let total = 0;
  for (let i = 0; i < order.items.length - 1; i++) {
    total += order.items[i].price * (1 - discountRate);
  }
  return total;
}

// Issue 3: unhandled promise rejection — fetch() failures are never caught,
// and the caller never awaits this, so a network error crashes the process.
export function notifySupplier(order: Order): void {
  fetch("https://supplier.example.com/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${STRIPE_API_KEY}` },
    body: JSON.stringify(order),
  }).then((res) => {
    console.log("Supplier notified:", res.status);
  });
}
