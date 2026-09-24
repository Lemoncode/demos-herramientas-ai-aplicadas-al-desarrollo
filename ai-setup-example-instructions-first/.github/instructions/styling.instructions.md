---
applyTo: "src/**/*.{css,tsx}"
---

# Styling Rules

## Where styles live

- All styles live in `src/styles.css`. No CSS-in-JS, no Tailwind, no per-component stylesheet.
- No inline `style={{ ... }}` except for genuinely dynamic values.

  ```tsx
  // ❌ wrong — a static value belongs in CSS
  <article className="feature-card" style={{ padding: '1rem', background: '#1e293b' }}>

  // ✅ right
  <article className="feature-card">

  // ✅ acceptable — genuinely dynamic
  <div className="bar" style={{ width: `${percent}%` }} />
  ```

## Design tokens

- Colors, spacing and radii come from CSS custom properties declared on `:root`.
- Never hard-code a value that already has a token. Need one that does not exist? Add it to
  `:root` first.

  ```css
  /* ❌ wrong */
  .feature-card { padding: 16px; background: #1e293b; color: #e2e8f0; }

  /* ✅ right */
  .feature-card {
    padding: var(--space-4);
    background: var(--color-surface);
    color: var(--color-text);
  }
  ```

  ```css
  :root {
    --space-4: 1rem;
    --radius-md: 0.5rem;
    --color-surface: #1e293b;
    --color-accent: #38bdf8;
  }
  ```

## Class names

- Kebab-case, one block per component, prefixed with the component name:
  `feature-card`, `feature-card__title`, `hero`, `footer`.
- No utility classes. Do not add a class purely for a one-off margin.

  ```tsx
  // ❌ wrong — utility classes and a one-off margin
  <div className="flex items-center mt-16 gap-4">

  // ✅ right — a named block; spacing is the grid's job
  <div className="features__grid">
  ```

## Layout and responsiveness

- Layout uses `flex` / `grid` with `gap`, not `margin` hacks between siblings.
- Usable down to 360px with no horizontal scrollbar.

  ```css
  /* ❌ wrong — siblings spaced with margins */
  .feature-card { margin-right: 1rem; }
  .feature-card:last-child { margin-right: 0; }

  /* ✅ right — the parent owns the gap */
  .features__grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  }
  ```
