# Editorial Energy direction delivered via frontend-design skill

The JivaEnergy redesign is the demo artifact for an autonomous-agent-fleet harness. Six Workers must converge on a single coherent aesthetic without coordinating, so the Foundation Phase locks an opinionated visual direction the Fleet inherits read-only.

We chose **Editorial Energy** — editorial serif H1, neutral sans body, deep forest green + bone + sulfur accent, 8px-grid generous whitespace — because it produces the strongest before/after contrast with the existing dated site, fits a B2B EV-charger buyer (fleets, distributors), and gives six parallel agents a small enough rule set to converge on (3 type sizes, 3 colors, one spacing scale).

We rejected **Hard-Tech Industrial** (Workers would each invent a different shade of "tech aesthetic") and **Soft Eco** (brand mismatch with commercial buyer).

Design tokens, type scale, layout shell, and primitive components (`Button`, `Card`, `Section`, `Container`) are generated during the Foundation Phase by invoking the `frontend-design` skill with the Editorial Energy constraints. Workers do not invoke `frontend-design` — they consume what the Foundation produced. This keeps the aesthetic decisions in one place and prevents per-Section drift.
