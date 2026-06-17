import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Faq } from './Faq'

describe('Faq', () => {
  it('renders coming soon placeholder', () => {
    render(<Faq />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
