Run the React → Astro migration: Convert → Verify → Report.

Invoke the `migrate-react-to-astro` skill and follow it exactly. If the user passed arguments,
treat them as a filter over the conversion-unit ids in `docs/migration-plan.md`
(e.g. `/migrate-react-to-astro M1 M3` migrates only those two units); with no arguments,
migrate every unit.

$ARGUMENTS
