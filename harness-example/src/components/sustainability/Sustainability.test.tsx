import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Sustainability } from './Sustainability'

describe('Sustainability', () => {
  it('renders coming soon placeholder', () => {
    render(<Sustainability />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
