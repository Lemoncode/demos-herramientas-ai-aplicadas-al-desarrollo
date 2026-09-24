---
applyTo: "src/components/**/*.tsx"
---

# Component Rules

These rules apply to every file inside `src/components/`. Every rule below comes with a
wrong/right pair — follow the right-hand column.

## Structure

- **Functional components only.** No classes.
- **Named exports only.** Never `export default` from a component file.

  ```tsx
  // ❌ wrong
  export default function FeatureCard(props: FeatureCardProps) { ... }

  // ✅ right
  export function FeatureCard({ title, description }: FeatureCardProps) { ... }
  ```

- **One component per file.** The component name equals the file name.

  ```
  src/components/FeatureCard.tsx   →   export function FeatureCard(...)
  ```

## Props

- Type props with an `interface`, not a `type` alias.
- **Maximum 4 props.** If you need more, compose smaller components.
- No `any`. Use `unknown` plus a type guard when the shape is genuinely unknown.
- Do not use `React.FC` — type the function signature directly.
- Mark optional props with `?`, never `| undefined`.

  ```tsx
  // ❌ wrong
  type FeatureCardProps = {
    title: string
    description: string | undefined
  }
  function FeatureCard(props: React.FC<FeatureCardProps>) { ... }

  // ✅ right
  interface FeatureCardProps {
    title: string
    description?: string
    onClick?: () => void
  }
  export function FeatureCard({ title, description, onClick }: FeatureCardProps) { ... }
  ```

- When props mirror a data shape, import the type rather than re-declaring it:

  ```tsx
  import type { Post } from '../data/posts.ts'

  interface PostCardProps {
    post: Post
  }
  ```

## Composition

Pass children and small render helpers through props instead of stacking boolean flags:

```tsx
// ❌ wrong — grows without bound
interface CardProps {
  title: string
  hasImage: boolean
  isCompact: boolean
  showBorder: boolean
  isClickable: boolean
}

// ✅ right — compose instead
interface CardProps {
  title: string
  children: React.ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <section className="card">
      <h2 className="card__title">{title}</h2>
      {children}
    </section>
  )
}
```

## Semantic HTML

| Intent | Use | Avoid |
|---|---|---|
| Clickable action | `<button type="button">` | `<div onClick>` |
| Navigation link | `<a href>` | `<button onClick={...}>` |
| Page section | `<section>` / `<nav>` / `<footer>` / `<main>` | `<div className="section">` |
| Content unit | `<article>` | `<div>` |
| List | `<ul>` / `<li>` | `<div>` wrappers |
| Heading | `<h1>`–`<h6>` in outline order | skipped levels |

```tsx
// ❌ wrong
<div className="card" onClick={handleClick}>
  <div className="card__title">Features</div>
</div>

// ✅ right
<button type="button" className="card" onClick={handleClick}>
  <span className="card__title">Features</span>
</button>
```

## Accessibility

- Every interactive element has an accessible name (visible text preferred).

  ```tsx
  // ❌ wrong — an icon button with no name
  <button type="button" onClick={onClose}><CloseIcon /></button>

  // ✅ right
  <button type="button" onClick={onClose} aria-label="Close dialog"><CloseIcon /></button>
  ```

- Images have `alt`; decorative images use `alt=""`.

  ```tsx
  <img src={heroImg} alt="Two engineers pairing at a desk" />
  <img src={dividerImg} alt="" />            {/* decorative */}
  ```

- Give a labelled section a heading and reference it:

  ```tsx
  <section className="features" aria-labelledby="features-heading">
    <h2 id="features-heading">Features</h2>
    ...
  </section>
  ```

- Never `onClick` on a non-interactive element without `role` and a key handler.
- Color is never the only way information is conveyed.

  ```tsx
  // ❌ wrong — status conveyed by red alone
  <span className="status status--red">Down</span>

  // ✅ right — color plus text/icon
  <span className="status status--down" role="status">
    <WarningIcon aria-hidden="true" /> Down
  </span>
  ```
