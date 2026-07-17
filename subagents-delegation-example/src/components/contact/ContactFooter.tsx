const PHONE = '+34 900 123 456'
const EMAIL = 'info@jivaenergy.es'
const INSTAGRAM_HANDLE = '@jivaenergy'
const INSTAGRAM_URL = 'https://www.instagram.com/jivaenergy'
const LINKEDIN_URL = 'https://linkedin.com/company/jivaenergy'
const CURRENT_YEAR = 2026

export function ContactFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid #e0e0e0',
        paddingTop: '2rem',
        marginTop: '3rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <p style={{ margin: 0 }}>
            <strong>Teléfono:</strong>{' '}
            <a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a>
          </p>
          <p style={{ margin: '0.5rem 0 0' }}>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>

        <div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <a href={INSTAGRAM_URL} aria-label="Instagram" rel="noopener noreferrer" target="_blank">
                {INSTAGRAM_HANDLE} — Instagram
              </a>
            </li>
            <li style={{ marginTop: '0.5rem' }}>
              <a href={LINKEDIN_URL} aria-label="LinkedIn" rel="noopener noreferrer" target="_blank">
                JivaEnergy — LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
        }}
      >
        <p style={{ margin: 0 }}>
          &copy; {CURRENT_YEAR} JivaEnergy. Todos los derechos reservados.
        </p>
        <nav aria-label="Legal">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1rem' }}>
            <li>
              <a href="/legal/privacidad">Política de privacidad</a>
            </li>
            <li>
              <a href="/legal/aviso">Aviso legal</a>
            </li>
            <li>
              <a href="/legal/cookies">Cookies</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
