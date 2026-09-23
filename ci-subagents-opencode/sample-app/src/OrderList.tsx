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
// Sample order dashboard: state, effects, semantics and rendering.

import { useEffect, useState } from "react";
import { fetchOrders, type Order } from "./api";
import { OrderTable } from "./OrderTable";
import { OrderToolbar } from "./OrderToolbar";

// Issue (Readability): 7 fields — over the 6-field props budget.
interface OrderListProps {
  currency: string;
  locale: string;
  timezone: string;
  onSelect: (id: string) => void;
  onRetry: (id: string) => void;
  onFlag: (id: string) => void;
  onArchive: (id: string) => void;
}

export function OrderList(props: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const endpoint = `/orders?q=${query}&locale=${props.locale}`;
  const isSynced = orders.length > 0;

  // Issue (Hook rules): `endpoint` is read inside the effect but is missing
  // from the dependency array. Issue (Resilience): the rejection is never
  // handled and there is no loading or error state.
  useEffect(() => {
    fetchOrders(endpoint).then((next) => setOrders(next));
  }, []);

  const visible = orders.filter((order) =>
    order.customer.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section>
      <h1>Orders</h1>

      {/* Issue (Accessibility): placeholder-only input, no associated label. */}
      <input
        placeholder="Search orders"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {/* Issue (Accessibility): sync state is signalled by colour alone. */}
      <p style={{ color: isSynced ? "green" : "red" }}>Sync status</p>

      {/* Issue (Risk): raw HTML injected without sanitisation. */}
      <div dangerouslySetInnerHTML={{ __html: "<p>Updated 2 minutes ago</p>" }} />

      {/* Issue (Accessibility): clickable div — no role, no keyboard handler. */}
      <div style={{ padding: 24, marginTop: 16 }} onClick={() => setOrders([])}>
        Clear all
      </div>

      <OrderToolbar
        orders={visible}
        currency={props.currency}
        locale={props.locale}
        timezone={props.timezone}
        onExport={() => {}}
        onArchiveAll={() => setOrders([])}
        onClear={() => setOrders([])}
      />

      {/* Issue (Accessibility): heading level jumps from h1 to h3. */}
      <h3>Results</h3>

      <OrderTable
        orders={visible}
        currency={props.currency}
        locale={props.locale}
        timezone={props.timezone}
        selectedId={selectedId}
        onSelect={props.onSelect}
        onRetry={props.onRetry}
        onFlag={props.onFlag}
        onArchive={props.onArchive}
      />

      {/* Issue (Readability): magic numbers in JSX with no named constants. */}
      <p style={{ marginTop: 32, fontSize: 13 }}>
        {totalOf(visible) > 500 ? "Free shipping" : "Shipping 9.99"}
      </p>
    </section>
  );
}

function totalOf(orders: Order[]): number {
  return orders.reduce((sum, order) => sum + order.items[0].price, 0);
}
