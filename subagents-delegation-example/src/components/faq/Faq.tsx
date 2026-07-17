'use client'

import { useState } from 'react'
import { Section } from '@/components/section/Section'

interface FaqItem {
  id: string
  question: string
  answer: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '¿Qué tipos de cargadores ofrecen?',
    answer:
      'JivaEnergy fabrica cargadores AC monofásicos y trifásicos (3,7 kW – 22 kW) y cargadores DC de carga rápida (50 kW – 350 kW). Nuestra gama cubre desde instalaciones residenciales y de flotas hasta estaciones de recarga de alta potencia en autopistas y hubs logísticos.',
  },
  {
    id: 'faq-2',
    question: '¿Son compatibles con todos los vehículos eléctricos?',
    answer:
      'Sí. Nuestros cargadores incorporan conectores Tipo 2 (IEC 62196-2) para AC y CCS2 / CHAdeMO para DC, cubriendo la totalidad de los vehículos eléctricos comercializados en Europa. La compatibilidad con el estándar OCPP 2.0.1 garantiza la interoperabilidad con cualquier plataforma de gestión de red de recarga.',
  },
  {
    id: 'faq-3',
    question: '¿Cómo gestionan la garantía y el soporte?',
    answer:
      'Todos los equipos incluyen 3 años de garantía de fábrica con extensión opcional a 5 años. El soporte técnico está disponible 24/7 a través de nuestro portal B2B y línea directa de ingeniería. El tiempo de respuesta SLA para averías críticas es de 4 horas en península.',
  },
]

const PANEL_HIDDEN_STYLE: React.CSSProperties = {
  display: 'none',
}

const PANEL_VISIBLE_STYLE: React.CSSProperties = {
  display: 'block',
  padding: '1rem 1.25rem',
  borderTop: '1px solid #e5e7eb',
  color: '#374151',
  lineHeight: 1.6,
}

const BUTTON_STYLE: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '1.25rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#0e1f16',
}

const ITEM_STYLE: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '0.5rem',
  marginBottom: '0.75rem',
  overflow: 'hidden',
}

interface FaqItemProps {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}

function FaqAccordionItem({ item, isOpen, onToggle }: FaqItemProps) {
  const panelId = `${item.id}-panel`

  return (
    <div style={ITEM_STYLE}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        style={BUTTON_STYLE}
      >
        <span>{item.question}</span>
        <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-label={item.question}
        style={isOpen ? PANEL_VISIBLE_STYLE : PANEL_HIDDEN_STYLE}
      >
        {item.answer}
      </div>
    </div>
  )
}

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(null)

  function handleToggle(id: string) {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <Section id="faq" title="Preguntas frecuentes">
      <dl style={{ marginTop: '2rem' }}>
        {FAQ_ITEMS.map((item) => (
          <FaqAccordionItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </dl>
    </Section>
  )
}
