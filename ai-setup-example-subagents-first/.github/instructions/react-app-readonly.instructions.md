---
applyTo: "react-app/**"
---

# React Source Is Read-Only

`react-app/` is the frozen input. The migration is only proven when the target reproduces the
source's output **without the source having changed**.

## Forbidden

```bash
# ❌ even to "help" the migration
git mv react-app/src/components/Header.tsx astro-site/src/components/Header.astro
sed -i '' 's/className/class/' react-app/src/components/Header.tsx
rm react-app/src/components/Footer.tsx
```

```tsx
// ❌ do not "fix" the source to make it easier to port
export function Footer() {
  return <footer class="site-footer">...</footer>   // NO — source stays React
}
```

## Expected

```bash
# ✅ read it as much as you like
sed -n '1,40p' react-app/src/components/Header.tsx
```

```tsx
// ✅ the source stays exactly as it is
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

`git status --porcelain react-app` must print **nothing**. Any output fails the migration.

If a conversion seems to require a source change, stop and report `blocked_by` instead of
editing `react-app/`.
