import Link from 'next/link'
import styles from './Footer.module.css'

const PRODUCT_LINKS = [
  { label: 'Cargadores AC', href: '/#catalogo' },
  { label: 'Cargadores DC', href: '/#catalogo' },
  { label: 'Para flotas', href: '/#contacto' },
  { label: 'Certificaciones', href: '/#certificaciones' },
] as const

const COMPANY_LINKS = [
  { label: 'Sostenibilidad', href: '/#sostenibilidad' },
  { label: 'Preguntas frecuentes', href: '/#faq' },
  { label: 'Contacto', href: '/#contacto' },
  { label: 'Aviso legal', href: '/legal' },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer} aria-label="Pie de página">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="JivaEnergy — inicio">
            <span aria-hidden="true">⚡</span>
            <span className={styles.logoName}>JivaEnergy</span>
          </Link>
          <p className={styles.tagline}>
            Cargadores certificados para vehículos eléctricos. Soluciones para hogares, flotas y sector público en toda Europa.
          </p>
        </div>

        <nav aria-label="Productos">
          <p className={styles.colTitle}>Productos</p>
          <ul className={styles.colList} role="list">
            {PRODUCT_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={styles.colLink}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Empresa">
          <p className={styles.colTitle}>Empresa</p>
          <ul className={styles.colList} role="list">
            {COMPANY_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={styles.colLink}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.contact}>
          <p className={styles.colTitle}>Contacto</p>
          <address className={styles.address}>
            <a href="mailto:info@jivaenergy.eu" className={styles.colLink}>
              info@jivaenergy.eu
            </a>
            <a href="tel:+34900123456" className={styles.colLink}>
              +34 900 123 456
            </a>
            <span className={styles.location}>Madrid, España · UE</span>
          </address>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>© {currentYear} JivaEnergy S.L. Todos los derechos reservados.</p>
        <p className={styles.copy}>Comprometidos con la movilidad sostenible</p>
      </div>
    </footer>
  )
}
