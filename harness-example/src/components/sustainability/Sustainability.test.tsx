import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Sustainability } from './Sustainability'

describe('Sustainability', () => {
  it('renders a heading for the sustainability section', () => {
    render(<Sustainability />)
    expect(
      screen.getByRole('heading', { name: /sostenibilidad/i }),
    ).toBeInTheDocument()
  })

  it('renders exactly 3 metric tiles', () => {
    render(<Sustainability />)
    const tiles = screen.getAllByRole('article')
    expect(tiles).toHaveLength(3)
  })

  it('renders the CO2 avoided metric with label and value', () => {
    render(<Sustainability />)
    expect(screen.getByText(/CO₂ evitado/i)).toBeInTheDocument()
    expect(screen.getByText('12.400')).toBeInTheDocument()
  })

  it('renders the charge sessions metric with label and value', () => {
    render(<Sustainability />)
    expect(screen.getByText(/sesiones de carga/i)).toBeInTheDocument()
    expect(screen.getByText('2.800.000')).toBeInTheDocument()
  })

  it('renders the partner countries metric with label and value', () => {
    render(<Sustainability />)
    expect(screen.getByText(/países asociados/i)).toBeInTheDocument()
    expect(screen.getByText('18')).toBeInTheDocument()
  })

  it('renders the circular-economy paragraph as a semantic <p> element', () => {
    render(<Sustainability />)
    // getByTestId used because <p> has no distinguishable ARIA role from other text nodes;
    // the tag check is load-bearing per the acceptance criterion
    const paragraph = screen.getByTestId('circular-economy-paragraph')
    expect(paragraph.tagName).toBe('P')
  })

  it('renders static numeric values that are identical across multiple renders', () => {
    const { unmount } = render(<Sustainability />)
    const firstRender = screen.getAllByRole('article').map(el => el.textContent)
    unmount()
    render(<Sustainability />)
    const secondRender = screen.getAllByRole('article').map(el => el.textContent)
    expect(firstRender).toEqual(secondRender)
  })
})
