---
applyTo: "astro-site/src/**/*.astro"
---

# Astro Component Rules

This is a **framework swap**: the rendered output must not change.

## Shape

A `.astro` file is a frontmatter block (`---`) followed by a template. No component wrapper,
no default export.

```astro
---
interface Props {
  title: string
  subtitle: string
}

const { title, subtitle } = Astro.props
---

<section class="hero">
  <h1 class="hero__title">{title}</h1>
  <p class="hero__subtitle">{subtitle}</p>
</section>
```

## Props

- Declare `interface Props` and read from `Astro.props`. Keep the source's names and types.

  ```astro
  ---
  // ❌ wrong — React-style props
  export function Hero({ title }: { title: string }) { ... }

  // ✅ right
  interface Props {
    title: string
    subtitle: string
  }
  const { title, subtitle } = Astro.props
  ---
  ```

- Import data types in the frontmatter when a prop mirrors a shape:

  ```astro
  ---
  import type { Post } from '../lib/posts.ts'
  interface Props {
    post: Post
  }
  const { post } = Astro.props
  ---
  ```

## Markup

- Plain HTML attributes: `class`, `for`, `tabindex` — never `className` / `htmlFor`.
- Preserve the source's class names exactly.
- Drop React's `key` prop inside `.map(...)`.

```diff
- <a className="site-header__brand" href="/">Acme</a>
+ <a class="site-header__brand" href="/">Acme</a>

- {posts.map((post) => <PostCard key={post.slug} post={post} />)}
+ {posts.map((post) => <PostCard post={post} />)}
```

- Expressions use `{ ... }` — `.map()`, ternaries and `&&` work inline.

## Frontmatter

- Imports point at the **new** target paths, and `.astro` imports are **default** imports:

  ```astro
  ---
  import Header from '../components/Header.astro'
  import { posts } from '../lib/posts.ts'
  ---
  ```

- Module-level constants move into the frontmatter.
- Build-time expressions (`new Date().getFullYear()`) belong in the frontmatter, never a `useEffect`.

## Interactivity

- **No `client:*` directives.** None of the six units need client-side JS.
- No framework integrations or islands. Interactivity is a separate decision — ask first.
