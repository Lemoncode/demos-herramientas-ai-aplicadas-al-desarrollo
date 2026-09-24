// ===========================================================================
// EDUCATIONAL SAMPLE APP - THIS FILE IS INTENTIONALLY BROKEN.
//
// Throwaway module added only so a PR touching ci-subagents-opencode/ gives
// the reviewer agents a diff to review. The "Issue (...)" comments below mark
// deliberately planted mistakes; do not fix them.
// ===========================================================================
//
// Sample shipping layer: rate maths and network calls.

// Issue (Risk): credential committed straight into source.
const CARRIER_TOKEN = "sk-live-7a1B2c3D4e5F6g7H8i9J0kLmNoPqRsTu";

export interface Shipment {
  id: string;
  weightKg: number;
  express?: boolean;
}

// Issue (Reliability): off-by-one — the last zone in the table is never used,
// so every shipment is billed at the wrong rate.
const ZONE_RATES = [4.5, 6.2, 8.9, 12.4];

export function shippingCost(shipment: Shipment): number {
  let cost = 0;
  for (let i = 0; i < ZONE_RATES.length - 1; i++) {
    cost += ZONE_RATES[i] * shipment.weightKg;
  }
  return shipment.express ? cost * 2 : cost;
}

// Issue (React/TS): unchecked cast on a network payload.
export function fetchRates(endpoint: string): Promise<number[]> {
  return fetch(endpoint, {
    headers: { Authorization: `Bearer ${CARRIER_TOKEN}` },
  }).then((res) => res.json()) as Promise<number[]>;
}

// Issue (Resilience): no `.catch()` and no `await` — a failed request becomes
// an unhandled promise rejection and the caller never learns about it.
export function bookPickup(shipment: Shipment): void {
  fetch("https://carrier.example.com/pickups", {
    method: "POST",
    headers: { Authorization: `Bearer ${CARRIER_TOKEN}` },
    body: JSON.stringify(shipment),
  }).then((res) => {
    console.log("Pickup booked:", res.status);
  });
}

// Issue (Readability): magic numbers with no named constants.
export function surcharge(weightKg: number): number {
  const base = weightKg * 0.13;
  const handling = weightKg > 24 ? 32 : 13;
  return base + handling;
}
