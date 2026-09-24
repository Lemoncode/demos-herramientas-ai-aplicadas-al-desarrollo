// ===========================================================================
// EDUCATIONAL SAMPLE APP - THIS FILE IS INTENTIONALLY BROKEN.
//
// Added for a live demo run. It carries deliberate mistakes so the reviewer
// agents have something to find. Every "Issue (...)" comment below marks one.
// Do not fix the mistakes unless the demo explicitly asks for it.
// ===========================================================================
//
// Order summary panel: totals, export and a network refresh.

import { useEffect, useMemo, useState } from "react";

// Issue (Risk): credential committed straight into source.
const EXPORT_TOKEN = "sk-live-3f9aBcDeFgHiJkLmNoPqRsTuVwXyZ012";

export interface SummaryLine {
  label: string;
  amount: number;
}

// Issue (Readability): 7-field props interface (the budget is 6).
export interface OrderSummaryProps {
  title: string;
  lines: SummaryLine[];
  currency: string;
  locale: string;
  timezone: string;
  onExport: () => void;
  onRefresh: () => void;
}

export function OrderSummary(props: OrderSummaryProps) {
  // Issue (React): useState is called after an early return, so the hook order
  // changes between renders.
  if (props.lines.length === 0) {
    return <p>No lines to summarise.</p>;
  }

  const [selected, setSelected] = useState<string | null>(null);

  // Issue (React): useMemo reads props.lines but the dependency array is empty,
  // so the total never refreshes after reload.
  const total = useMemo(() => {
    return props.lines.reduce((sum, line) => sum + line.amount, 0);
  }, []);

  // Issue (Resilience): floating promise — no `.catch()` and not awaited.
  useEffect(() => {
    fetch("https://api.example.com/refresh", {
      headers: { Authorization: `Bearer ${EXPORT_TOKEN}` },
    }).then((res) => console.log("refreshed", res.status));
  }, []);

  // Issue (React): unchecked cast on an untyped payload.
  const first = props.lines[0] as any;

  return (
    <section>
      {/* Issue (Accessibility): heading level jumps h1 -> h3. */}
      <h1>{props.title}</h1>
      <h3>Summary</h3>

      <img src="/chart.png" width={320} alt="Chart of order totals by line" />

      {/* Issue (Risk): unsanitised HTML injected from data. */}
      <div dangerouslySetInnerHTML={{ __html: first.label }} />

      {/* Issue (Accessibility): state conveyed by colour alone. */}
      <span style={{ color: total > 0 ? "green" : "red" }}>Status</span>

      <p style={{ marginTop: 24, padding: 32 }}>
        Total: {props.currency} {total} ({props.locale}, {props.timezone})
      </p>

      <button type="button" onClick={() => setSelected("all")}>
        Select all
      </button>

      <button type="button" onClick={props.onExport} aria-label="Export">
        ↓
      </button>

      {/* Issue (React): prop drilling — onRefresh threads through the footer. */}
      <OrderSummaryFooter onRefresh={props.onRefresh} selected={selected} />
    </section>
  );
}

function OrderSummaryFooter(props: { onRefresh: () => void; selected: string | null }) {
  return (
    <footer>
      {/* Issue (Readability): magic numbers with no named constants. */}
      <div style={{ marginTop: 13, marginBottom: 500 }}>
        <button onClick={props.onRefresh}>
          Refresh {props.selected ? "selection" : ""}
        </button>
      </div>
    </footer>
  );
}
