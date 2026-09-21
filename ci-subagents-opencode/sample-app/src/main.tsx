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
// Entry point. Nothing to see here - the planted issues live in the other files.

import { createRoot } from "react-dom/client";
import { OrderList } from "./OrderList";

const container = document.getElementById("root");

createRoot(container!).render(
  <OrderList
    currency="EUR"
    locale="es-ES"
    timezone="Atlantic/Canary"
    onSelect={() => {}}
    onRetry={() => {}}
    onFlag={() => {}}
    onArchive={() => {}}
  />,
);
