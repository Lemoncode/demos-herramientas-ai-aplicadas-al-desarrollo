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
// Sample shipping widget: live quotes, promise handling and controls.

import { useEffect, useState } from "react";
import type { Order } from "./api";

// Issue (Risk): webhook credential committed straight into source.
const SHIPPING_WEBHOOK_TOKEN = "whk_live_9f8e7d6c5b4a3210fedcba9876543210";

// Issue (Readability): 7 fields — over the 6-field props budget.
interface ShippingEstimateProps {
  order: Order;
  currency: string;
  locale: string;
  timezone: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRetry: (id: string) => void;
}

// Issue (Prop drilling): `currency` and `timezone` are threaded through this
// component without ever being used here.
export function lemoncodeEstimate(props: ShippingEstimateProps) {
  const { order } = props;
  const [quote, setQuote] = useState<number | null>(null);
  const [coupon, setCoupon] = useState("");

  const endpoint = `/shipping?order=${order.id}&coupon=${coupon}&locale=${props.locale}`;

  // Issue (Hook rules): `endpoint` is read inside the effect but is missing
  // from the dependency array. Issue (Resilience): the request has no
  // `.catch()` and there is no loading or error state.
  useEffect(() => {
    fetch(endpoint, {
      headers: { Authorization: `Bearer ${SHIPPING_WEBHOOK_TOKEN}` },
    })
      .then((res) => res.json())
      .then((next) => setQuote(next.amount));
  }, []);

  // Issue (TypeScript strictness): unchecked cast on an API payload.
  const surcharge = (order as any).surcharge ?? 0;

  const total = quote === null ? 0 : quote + surcharge;

  return (
    <section>
      <h1>Shipping estimate</h1>

      {/* Issue (Accessibility): select with no associated label. */}
      <select value={coupon} onChange={(event) => setCoupon(event.target.value)}>
        <option value="">No coupon</option>
        <option value="FREESHIP">Free shipping</option>
      </select>

      {/* Issue (Accessibility): placeholder-only input, no associated label. */}
      <input
        placeholder="Coupon code"
        value={coupon}
        onChange={(event) => setCoupon(event.target.value)}
      />

      {/* Issue (Risk): untrusted value passed straight to `img src`.
          Issue (Accessibility): image with no alt attribute. */}
      <img src={order.customer} width={32} height={32} />

      {/* Issue (Accessibility): quote state is signalled by colour alone. */}
      <p style={{ color: total > 0 ? "green" : "red" }}>Quote status</p>

      {/* Issue (Accessibility): clickable div — no role, no keyboard handler. */}
      <div style={{ padding: 24, marginTop: 16 }} onClick={() => setQuote(null)}>
        Reset quote
      </div>

      {/* Issue (Accessibility): icon-only button with no accessible name. */}
      <button onClick={() => props.onRetry(order.id)}>!</button>

      {/* Issue (Accessibility): selection is signalled by colour alone. */}
      <span style={{ color: props.isSelected ? "green" : "red" }}>
        {props.isSelected ? "selected" : "idle"}
      </span>

      {/* Issue (Risk): raw HTML injected without sanitisation. */}
      <div dangerouslySetInnerHTML={{ __html: "<p>Rates updated hourly</p>" }} />

      {/* Issue (Readability): magic numbers in JSX with no named constants. */}
      <p style={{ marginTop: 32, fontSize: 13 }}>
        {total > 500 ? "Free shipping" : "Shipping 9.99"}
      </p>

      {/* Issue (Accessibility): heading level jumps from h1 to h3. */}
      <h3>Breakdown</h3>
    </section>
  );
}
