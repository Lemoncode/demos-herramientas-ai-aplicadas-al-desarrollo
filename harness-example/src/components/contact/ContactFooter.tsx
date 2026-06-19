const PHONE = '+34 900 123 456'
const EMAIL = 'hola@jivaenergy.com'
const INSTAGRAM_URL = 'https://instagram.com/jivaenergy'
const LINKEDIN_URL = 'https://linkedin.com/company/jivaenergy'
const PRIVACY_URL = '/privacidad'
const LEGAL_URL = '/aviso-legal'
const COOKIES_URL = '/cookies'
const COPYRIGHT_YEAR = 2024
const COMPANY_NAME = 'JivaEnergy'

export function ContactFooter() {
  return (
    <footer className="contact__footer">
      <div className="contact__footer-container">
        <div className="contact__footer-contact">
          <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="contact__footer-phone">
            {PHONE}
          </a>
          <a href={`mailto:${EMAIL}`} className="contact__footer-email">
            {EMAIL}
          </a>
        </div>

        <div className="contact__footer-social">
          <a
            href={INSTAGRAM_URL}
            rel="noopener noreferrer"
            target="_blank"
            className="contact__footer-link"
            aria-label="Instagram de JivaEnergy"
          >
            Instagram
          </a>
          <a
            href={LINKEDIN_URL}
            rel="noopener noreferrer"
            target="_blank"
            className="contact__footer-link"
            aria-label="LinkedIn de JivaEnergy"
          >
            LinkedIn
          </a>
        </div>

        <nav className="contact__footer-legal" aria-label="Páginas legales">
          <ul className="contact__footer-legal-list">
            <li>
              <a href={PRIVACY_URL} className="contact__footer-link">
                Política de privacidad
              </a>
            </li>
            <li>
              <a href={LEGAL_URL} className="contact__footer-link">
                Aviso legal
              </a>
            </li>
            <li>
              <a href={COOKIES_URL} className="contact__footer-link">
                Política de cookies
              </a>
            </li>
          </ul>
        </nav>

        <p className="contact__footer-copyright">
          &copy; {COPYRIGHT_YEAR} {COMPANY_NAME}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
