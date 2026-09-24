---
description: Styling conventions for this app — design tokens from CSS custom properties, kebab-case class names, no inline styles, no CSS-in-JS, no UI library, with worked examples. Auto-loaded when editing styles or components.
paths:
  - "src/**/*.css"
  - "src/**/*.tsx"
---

# Styling Rules

## Where styles live

- All styles live in `src/styles.css`. There is no CSS-in-JS, no Tailwind, and no
  component-level stylesheet.
- Components never inline `style={{ ... }}` objects except for a genuinely dynamic value
  (e.g. a computed width). Static appearance belongs in the stylesheet.

  ```tsx
  // ❌ wrong — a static value belongs in CSS
  <article className="feature-card" style={{ padding: '1rem', background: '#1e293b' }}>

  // ✅ right — class only
  <article className="feature-card">

  // ✅ acceptable — genuinely dynamic
  <div className="bar" style={{ width: `${percent}%` }} />
  ```

## Design tokens

Colors, spacing and radii come from CSS custom properties declared on `:root` in
`src/styles.css`.

- Use `var(--color-accent)`, `var(--space-4)`, etc. — never hard-code a hex value or a
  raw pixel value that already has a token.

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

- If a value you need has no token, add the token to `:root` first, then use it. Do not
  sprinkle magic values through the app.

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
- No utility classes. Do not add a class purely for a one-off margin — spacing belongs to
  the layout of the parent.

  ```tsx
  // ❌ wrong — utility classes and a one-off margin
  <div className="flex items-center mt-16 gap-4">

  // ✅ right — a named block; spacing is the grid's job
  <div className="features__grid">
  ```

## Layout and responsiveness

- Layout uses `flex` / `grid` with `gap`. Avoid `margin` hacks for spacing between siblings.
- The page must be usable down to 360px wide with no horizontal scrollbar.

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
