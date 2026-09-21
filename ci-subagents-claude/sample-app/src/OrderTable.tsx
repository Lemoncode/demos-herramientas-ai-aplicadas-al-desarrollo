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
// Sample order table: prop threading and list rendering.

import type { Order } from "./api";
import { OrderRow } from "./OrderRow";

// Issue (Readability): 9 fields — over the 6-field props budget.
interface OrderTableProps {
  orders: Order[];
  currency: string;
  locale: string;
  timezone: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRetry: (id: string) => void;
  onFlag: (id: string) => void;
  onArchive: (id: string) => void;
}

// Issue (Prop drilling): `currency`, `locale` and `timezone` are threaded
// through this component without ever being used here.
export function OrderTable(props: OrderTableProps) {
  return (
    <table>
      <tbody>
        {props.orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            currency={props.currency}
            locale={props.locale}
            timezone={props.timezone}
            isSelected={order.id === props.selectedId}
            onSelect={props.onSelect}
            onRetry={props.onRetry}
            onFlag={props.onFlag}
            onArchive={props.onArchive}
          />
        ))}
      </tbody>
    </table>
  );
}
