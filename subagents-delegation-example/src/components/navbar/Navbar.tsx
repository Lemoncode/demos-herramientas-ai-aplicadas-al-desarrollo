'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Cargadores', href: '/#catalogo' },
  { label: 'Sostenibilidad', href: '/#sostenibilidad' },
  { label: 'Certificaciones', href: '/#certificaciones' },
  { label: 'FAQ', href: '/#faq' },
] as const

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navegación principal">
        <Link href="/" className={styles.logo} aria-label="JivaEnergy — inicio">
          <span className={styles.logoBolt} aria-hidden="true">⚡</span>
          <span className={styles.logoName}>JivaEnergy</span>
        </Link>

        <ul className={`${styles.links} ${open ? styles.linksOpen : ''}`} role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link href={href} className={styles.link} onClick={() => setOpen(false)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/#contacto" className={styles.cta}>
          Contactar
        </Link>

        <button
          className={styles.burger}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className={`${styles.burgerLine} ${open ? styles.burgerLineTop : ''}`} />
          <span className={`${styles.burgerLine} ${open ? styles.burgerLineMid : ''}`} />
          <span className={`${styles.burgerLine} ${open ? styles.burgerLineBot : ''}`} />
        </button>
      </nav>
    </header>
  )
}
