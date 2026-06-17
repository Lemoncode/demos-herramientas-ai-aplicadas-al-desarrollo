'use client'

import { useState } from 'react'

interface FaqItemProps {
  question: string
  answer: string
  id: string
}

export function FaqItem({ question, answer, id }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  const buttonId = `faq-btn-${id}`
  const panelId = `faq-panel-${id}`

  return (
    <div className="faq__item">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="faq__question"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {question}
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="faq__answer"
      >
        <p>{answer}</p>
      </div>
    </div>
  )
}
