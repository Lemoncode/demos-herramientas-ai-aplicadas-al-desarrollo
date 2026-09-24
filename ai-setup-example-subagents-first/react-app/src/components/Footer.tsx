export function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__copy">© {new Date().getFullYear()} Acme</p>
      <ul className="site-footer__links">
        <li>
          <a href="/privacy">Privacy</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </footer>
  )
}
