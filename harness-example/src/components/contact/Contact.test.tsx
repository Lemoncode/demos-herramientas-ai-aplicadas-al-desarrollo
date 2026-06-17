import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Contact } from './Contact'

describe('Contact', () => {
  it('renders coming soon placeholder', () => {
    render(<Contact />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
