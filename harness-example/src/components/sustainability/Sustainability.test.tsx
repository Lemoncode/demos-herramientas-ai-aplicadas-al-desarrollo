import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Sustainability } from './Sustainability'

describe('Sustainability', () => {
  it('renders a heading for the sustainability section', () => {
    render(<Sustainability />)
    expect(
      screen.getByRole('heading', { name: /sustainability/i }),
    ).toBeInTheDocument()
  })

  it('renders exactly 3 metric tiles', () => {
    render(<Sustainability />)
    const tiles = screen.getAllByRole('article')
    expect(tiles).toHaveLength(3)
  })

  it('renders the CO2 avoided metric with a label and a numeric value', () => {
    render(<Sustainability />)
    expect(screen.getByText(/CO₂ avoided/i)).toBeInTheDocument()
    expect(screen.getByText('48,200')).toBeInTheDocument()
  })

  it('renders the charge sessions metric with a label and a numeric value', () => {
    render(<Sustainability />)
    expect(screen.getByText(/charge sessions/i)).toBeInTheDocument()
    expect(screen.getByText('1.3M')).toBeInTheDocument()
  })

  it('renders the partner countries metric with a label and a numeric value', () => {
    render(<Sustainability />)
    expect(screen.getByText(/partner countries/i)).toBeInTheDocument()
    expect(screen.getByText('34')).toBeInTheDocument()
  })

  it('renders the circular-economy paragraph as a semantic <p> element', () => {
    render(<Sustainability />)
    // getByTestId used here because <p> has no ARIA role distinguishable
    // from other text containers; the tag check is load-bearing per the acceptance criterion
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
