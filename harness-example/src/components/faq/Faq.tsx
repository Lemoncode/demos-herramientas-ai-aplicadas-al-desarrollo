import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'
import { FaqItem } from './FaqItem'

const FAQ_ITEMS = [
  {
    id: '1',
    question: '¿Qué tipos de cargadores ofrecen?',
    answer:
      'Ofrecemos cargadores de nivel 1, nivel 2 y carga rápida DC para uso residencial y comercial, adaptados a las necesidades de cada cliente.',
  },
  {
    id: '2',
    question: '¿Son compatibles con todos los vehículos eléctricos?',
    answer:
      'Sí, nuestros cargadores son compatibles con la gran mayoría de vehículos eléctricos del mercado gracias al conector estándar tipo 2 y adaptadores CCS/CHAdeMO.',
  },
  {
    id: '3',
    question: '¿Cómo gestionan la garantía y el soporte?',
    answer:
      'Todos nuestros equipos incluyen garantía de 2 años y soporte técnico 24/7. Gestionamos incidencias de forma remota siempre que sea posible para minimizar tiempos de inactividad.',
  },
] as const

export function Faq() {
  return (
    <Section id="faq">
      <Heading level={2}>Preguntas Frecuentes</Heading>
      <dl className="faq__list">
        {FAQ_ITEMS.map((item) => (
          <FaqItem
            key={item.id}
            id={item.id}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </dl>
    </Section>
  )
}
