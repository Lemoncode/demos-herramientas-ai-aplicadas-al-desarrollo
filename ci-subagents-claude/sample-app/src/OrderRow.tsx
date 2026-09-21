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
// Sample order row: hooks, casts and interactive controls.

import { useState } from "react";
import { orderTotal, type Order } from "./api";

// Issue (Readability): 9 fields — over the 6-field props budget.
interface OrderRowProps {
  order: Order;
  currency: string;
  locale: string;
  timezone: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRetry: (id: string) => void;
  onFlag: (id: string) => void;
  onArchive: (id: string) => void;
}

export function OrderRow(props: OrderRowProps) {
  const { order } = props;

  // Issue (Hook rules): hook called conditionally, so the hook order changes
  // between renders whenever the status flips.
  if (order.status === "failed") {
    const [retrying] = useState(false);
    console.log("retrying:", retrying);
  }

  // Issue (TypeScript strictness): unchecked cast on an API payload.
  const discount = (order as any).discount;

  return (
    <tr style={{ background: props.isSelected ? "#eef2ff" : "#ffffff" }}>
      <td>
        {/* Issue (Accessibility): image with no alt attribute. */}
        <img src={`https://cdn.example.com/orders/${order.id}.png`} width={48} height={48} />
        {order.customer}
      </td>
      <td>
        {/* Issue (Accessibility): select with no associated label. */}
        <select value={order.status} onChange={() => props.onRetry(order.id)}>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="failed">Failed</option>
        </select>
      </td>
      <td>
        {/* Issue (Accessibility): status conveyed by colour alone. */}
        <span style={{ color: order.status === "failed" ? "red" : "green" }}>{order.status}</span>
      </td>
      <td>
        <PriceTag
          amount={orderTotal(order) - discount}
          currency={props.currency}
          locale={props.locale}
          timezone={props.timezone}
        />
      </td>
      <td>
        {/* Issue (Accessibility): icon-only button with no accessible name. */}
        <button onClick={() => props.onFlag(order.id)}>!</button>
        <button onClick={() => props.onArchive(order.id)}>Archive</button>
      </td>
    </tr>
  );
}

function PriceTag(props: { amount: number; currency: string; locale: string; timezone: string }) {
  return (
    <span>
      {props.amount.toFixed(2)} {props.currency}
    </span>
  );
}
