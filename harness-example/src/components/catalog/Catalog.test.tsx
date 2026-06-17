import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Catalog } from './Catalog'

describe('Catalog', () => {
  it('renders coming soon placeholder', () => {
    render(<Catalog />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
