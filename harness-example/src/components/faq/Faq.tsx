import { Section } from '@/components/section/Section'
import { Heading } from '@/components/heading/Heading'
import { FaqItem } from './FaqItem'

const FAQ_ITEMS = [
  {
    id: '1',
    question: '¿Qué tipos de cargadores ofrecen?',
    answer:
      'Ofrecemos cargadores AC de nivel 1 y nivel 2, y cargadores DC de carga rápida para uso residencial, comercial y de flotas. Todos cumplen con los estándares IEC 62196 y CHAdeMO.',
  },
  {
    id: '2',
    question: '¿Son compatibles con todos los vehículos eléctricos?',
    answer:
      'Sí. Nuestros equipos son compatibles con la mayoría de vehículos eléctricos e híbridos enchufables del mercado gracias al conector estándar Tipo 2 (IEC 62196-2) y adaptadores CCS Combo / CHAdeMO incluidos en la gama DC.',
  },
  {
    id: '3',
    question: '¿Cómo gestionan la garantía y el soporte?',
    answer:
      'Todos los equipos incluyen garantía de 2 años con sustitución express en 48 h. El soporte técnico es 24/7 por teléfono y portal web. Gestionamos incidencias de forma remota siempre que sea posible para minimizar tiempos de inactividad.',
  },
] as const

export function Faq() {
  return (
    <Section id="faq">
      <Heading level={2} size="section">Preguntas Frecuentes</Heading>
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
