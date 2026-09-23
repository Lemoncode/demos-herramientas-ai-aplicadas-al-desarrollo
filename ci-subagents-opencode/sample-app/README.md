# Sample app — intentionally broken

> **This app was written with errors on purpose, for educational reasons.**
>
> It exists so the reviewer agents in `../.github/agents/` have something to find when
> CI runs `pr-review` on a pull request. Every planted mistake is marked in the
> source with an `Issue (...)` comment. **Do not fix them — they are the point,
> and the demo stops working if you do.** Do not copy this code anywhere.

It is also not meant to be run: there is no bundler, no test runner and no
`node_modules`. The files exist to be read and reviewed, nothing else.

```
src/
├── api.ts           secret in source, off-by-one loop, unchecked cast, floating promise
├── main.tsx         entry point (harmless)
├── OrderList.tsx    stale effect, unlabelled input, colour-only state, XSS, clickable div, heading skip, magic numbers
├── OrderTable.tsx   prop drilling, 9-field props interface
├── OrderRow.tsx     conditional hook, `as any`, image without alt, unlabelled select, icon-only button
└── OrderToolbar.tsx stale memo, uncleared timer, magic-number delay, icon-only button, clickable div, 7-field props interface
```

`ci-subagents-opencode/sample-app/` carries a byte-identical copy of `src/`, so
the two tools can be compared against the same input. See the parent README for
the full issue → reviewer mapping.
