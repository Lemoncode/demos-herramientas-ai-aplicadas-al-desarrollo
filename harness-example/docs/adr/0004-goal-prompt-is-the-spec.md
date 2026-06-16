# The Goal prompt is the full spec; no external fetch

The Goal prompt the user types contains everything needed to build the landing page from scratch — brand identity, product catalog, target audience, design direction, the six Sections, and the copy spec per Section. The Orchestrator does not fetch the existing JivaEnergy site, does not invent product details, and does not consult any external source.

We chose this over the "fetch the live site" alternative because (i) the demo becomes reproducible — same Goal prompt always produces the same Fleet dispatch, (ii) the audience can read the prompt on screen and predict what every Worker will build, which makes the parallelism visible, and (iii) it removes WebFetch as a failure mode during live demos (rate limits, site changes, conference Wi-Fi).

Consequence: the Goal prompt is long — closer to a designer brief than a one-line command. It lives in `docs/demo/goal-prompt.md` as the canonical reference, copy-pasted into Claude Code at demo time. The Orchestrator's first job is parsing this brief into one Mission Brief per Section before any code is written.
