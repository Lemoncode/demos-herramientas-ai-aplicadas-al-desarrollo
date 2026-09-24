---
description: The React source app is read-only during a migration. Never edit, rename, delete or move anything under react-app/. Auto-loaded when editing files in the React source.
paths:
  - "react-app/**"
---

# React Source Is Read-Only

During a migration, `react-app/` is the frozen input. The migration is only proven when the
target reproduces the source's rendered output **without the source having changed**.

## What is forbidden

```bash
# ❌ all of these are wrong, even to "help" the migration
git mv react-app/src/components/Header.tsx astro-site/src/components/Header.astro
sed -i '' 's/className/class/' react-app/src/components/Header.tsx
rm react-app/src/components/Footer.tsx
```

```tsx
// ❌ do not "fix" the source to make it easier to port
// react-app/src/components/Footer.tsx
export function Footer() {
  return <footer class="site-footer">...</footer>   // NO — source stays React
}
```

## What is expected

```bash
# ✅ read it as much as you like — it is the reference
sed -n '1,40p' react-app/src/components/Header.tsx
```

```tsx
// ✅ the source stays exactly as it is
// react-app/src/components/Header.tsx
export function Header() {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="/">Acme</a>
      ...
    </header>
  )
}
```

## The check

The Verifier runs:

```bash
git status --porcelain react-app
```

It must print **nothing**. Any output means the source was touched and the migration fails.

If a conversion seems to require a source change (a genuinely un-portable pattern), stop and
report it as `blocked_by` instead of editing `react-app/`.
