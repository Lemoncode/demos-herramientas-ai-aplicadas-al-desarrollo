---
applyTo: "src/**"
---

# Feature Workflow

Follow this order. Do not skip step 1.

## 1. Read the request

`docs/feature-request.md` holds the current feature and its acceptance criteria.

## 2. Absorb the house style

Read `src/components/Hero.tsx` and `src/styles.css` before creating anything. Match what you
find rather than inventing a new pattern.

```tsx
// Hero.tsx shows the shape you should imitate:
interface HeroProps {
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
}

export function Hero({ title, subtitle, ctaLabel, ctaHref }: HeroProps) {
  return (
    <section className="hero">
      <h1 className="hero__title">{title}</h1>
      <p className="hero__subtitle">{subtitle}</p>
      <a className="hero__cta" href={ctaHref}>{ctaLabel}</a>
    </section>
  )
}
```

## 3. Keep the change minimal

Fewest files that satisfy the criteria. No unrelated refactors, no new dependencies.

```
✅ good change to "add a Features section":
   → src/components/FeatureCard.tsx   (new)
   → src/App.tsx                       (render the section)
   → src/styles.css                    (add .features__grid, .feature-card)

❌ too much:
   + rename Hero → HeroSection
   + extract a ThemeContext
   + add a CSS framework
```

## 4. Gate on the scripts

Both must exit 0:

```bash
npm run lint
npm run build
```

## 5. Report

List the files changed and map each to the acceptance criteria it satisfies:

```
Changed:
- src/components/FeatureCard.tsx (new) — AC: named export, own file, <article> + <h3>
- src/App.tsx — AC: hero → features → footer order; three cards from an array
- src/styles.css — AC: token-based styles, grid layout

Gate: npm run lint ✅  npm run build ✅
```

## When to stop and ask

- A criterion is ambiguous or contradictory.
- The feature needs a new dependency or a build-config change.
- The task would require editing files outside `src/`.
