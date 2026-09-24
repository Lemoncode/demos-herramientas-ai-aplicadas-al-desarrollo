---
description: Conventions for migrated Astro components — frontmatter props, plain HTML attributes, no client-side JS, structure preserved from the React source. Ships a full worked React→Astro example. Auto-loaded when editing .astro files.
paths:
  - "astro-site/src/**/*.astro"
---

# Astro Component Rules

These rules apply to every `.astro` file under `astro-site/src/`. This is a **framework
swap**, so the guiding principle is: the rendered output must not change.

## Shape

A `.astro` file is a frontmatter block (`---`) followed by a template. There is no component
wrapper and no default export — the template *is* the component.

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

- Declare `interface Props` in the frontmatter and read them from `Astro.props`.
- Keep the source's prop **names and types** exactly.
- Destructure once, at the top of the frontmatter.

```astro
---
// ❌ wrong — React-style props
export function Hero({ title }: { title: string }) { ... }

// ✅ right — Astro props
interface Props {
  title: string
  subtitle: string
}
const { title, subtitle } = Astro.props
---
```

When a prop mirrors a data shape, import the type in the frontmatter:

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

- Astro templates use **plain HTML attributes**: `class`, `for`, `tabindex` — never
  `className`, `htmlFor`.
- Preserve the source class names exactly.
- Drop React's `key` prop — Astro does not need it in `.map(...)`.

```diff
- <a className="site-header__brand" href="/">Acme</a>
+ <a class="site-header__brand" href="/">Acme</a>

- {posts.map((post) => (
-   <PostCard key={post.slug} post={post} />
- ))}
+ {posts.map((post) => (
+   <PostCard post={post} />
+ ))}
```

- Expressions use the same `{ ... }` syntax as JSX — `.map()`, ternaries and `&&` work inline.

## Frontmatter

- Imports live in the frontmatter and point at the **new** target paths:

  ```astro
  ---
  import Header from '../components/Header.astro'
  import { posts } from '../lib/posts.ts'
  ---
  ```

  (Astro components use a **default** import — unlike the React source's named exports.)

- Module-level constants that lived in the component file move into the frontmatter.
- Build-time expressions (`new Date().getFullYear()`) belong in the frontmatter or an inline
  `{ }` expression — never a `useEffect`.

## Interactivity

- **No `client:*` directives.** None of the six conversion units need client-side JavaScript.
- Do not add framework integrations or islands. If a future component genuinely needs
  interactivity, that is a separate decision — ask first.
