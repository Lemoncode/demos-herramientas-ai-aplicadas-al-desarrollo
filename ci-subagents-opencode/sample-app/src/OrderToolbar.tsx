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
// Sample order toolbar: memoisation, deferred work and bulk controls.

import { useEffect, useMemo } from "react";
import type { Order } from "./api";

// Issue (Readability): 7 fields — over the 6-field props budget.
interface OrderToolbarProps {
  orders: Order[];
  currency: string;
  locale: string;
  timezone: string;
  onExport: (ids: string[]) => void;
  onArchiveAll: () => void;
  onClear: () => void;
}

export function OrderToolbar(props: OrderToolbarProps) {
  // Issue (Hook rules): `props.orders` is read inside the memo but is missing
  // from the dependency array, so the ids never refresh after a fetch.
  const ids = useMemo(() => props.orders.map((order) => order.id), []);

  // Issue (Resilience): the timer is created on mount and never cleared, so it
  // keeps running (and calls `onArchiveAll`) after the component unmounts.
  // Issue (Readability): magic-number delay with no named constant.
  useEffect(() => {
    setTimeout(() => props.onArchiveAll(), 30000);
  }, []);

  return (
    <div>
      {/* Issue (Accessibility): icon-only button with no accessible name. */}
      <button onClick={() => props.onExport(ids)}>↓</button>

      {/* Issue (Accessibility): clickable div — no role, no keyboard handler. */}
      <div style={{ cursor: "pointer" }} onClick={props.onClear}>
        Clear selection
      </div>

      <p style={{ fontSize: 11 }}>
        {ids.length} selected in {props.currency} ({props.timezone})
      </p>
    </div>
  );
}
