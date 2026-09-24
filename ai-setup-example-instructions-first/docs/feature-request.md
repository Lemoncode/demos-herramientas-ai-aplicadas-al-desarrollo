# Feature request — "Features" section + footer

This is the one task this example exists to demonstrate. Read it, then ask your assistant
to build it. The point is not the feature itself — it's watching the rules in
`.claude/rules/` shape the code without you having to re-explain the house style.

## Context

The Acme marketing site currently has a single `Hero` section (see `src/App.tsx`). We want
to turn it into a complete one-page marketing site.

## What to build

1. A **"Features" section** below the hero: three feature cards, each with a title and a
   one-sentence description.
2. A **`Footer`** with a copyright line and two links (Privacy, Contact).

Content can be invented — this is a demo, not a real product.

## Acceptance criteria

- [ ] `src/App.tsx` renders the hero, then the features section, then the footer, in that order.
- [ ] The features section is exactly **three** cards, driven by an array (not copy-pasted JSX).
- [ ] Each card is an `<article>` with an `<h3>` title and a `<p>` description.
- [ ] `FeatureCard.tsx` is a named export in its own file under `src/components/`.
- [ ] `Footer.tsx` is a named export in its own file under `src/components/`.
- [ ] The two footer links are real `<a href>` elements with non-empty hrefs.
- [ ] No component receives more than 4 props.
- [ ] `npm run lint` exits 0.
- [ ] `npm run build` exits 0.

## What "good" looks like

The assistant should produce the components **without you restating** that components are
named exports, one per file, semantic HTML, ≤ 4 props. If it doesn't, the rules need to be
sharper — that's the exercise.
