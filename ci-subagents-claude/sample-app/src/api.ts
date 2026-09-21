// ===========================================================================
// EDUCATIONAL SAMPLE APP - THIS FILE IS INTENTIONALLY BROKEN.
//
// This app was written with deliberate mistakes so that the reviewer agents
// in CI have something to find. Every "Issue (...)" comment below marks one,
// and the demo is judged on whether the agents catch them.
//
// Do not copy this code, and do not fix the mistakes: they are the point.
// ===========================================================================
//
// Sample data layer: secret handling, order arithmetic and network calls.

// Issue (Risk): credential committed straight into source.
const SUPPLIER_API_KEY = "sk-live-51NcU8aBcDeFgHiJk1234567890abcdef";

export interface Order {
  id: string;
  customer: string;
  status: "pending" | "shipped" | "failed";
  items: { name: string; price: number }[];
}

// Issue (Reliability): off-by-one — the last item never counts towards the
// total, so every order is under-priced by one line item.
export function orderTotal(order: Order): number {
  let total = 0;
  for (let i = 0; i < order.items.length - 1; i++) {
    total += order.items[i].price;
  }
  return total;
}

// Issue (Risk): unchecked cast on a network payload.
export function fetchOrders(endpoint: string): Promise<Order[]> {
  return fetch(endpoint, {
    headers: { Authorization: `Bearer ${SUPPLIER_API_KEY}` },
  }).then((res) => res.json()) as Promise<Order[]>;
}

// Issue (Resilience): no `.catch()` and no `await` — a failed request becomes
// an unhandled promise rejection and the caller never learns about it.
export function notifySupplier(order: Order): void {
  fetch("https://supplier.example.com/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${SUPPLIER_API_KEY}` },
    body: JSON.stringify(order),
  }).then((res) => {
    console.log("Supplier notified:", res.status);
  });
}
