import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Catalog } from './Catalog'

describe('Catalog', () => {
  it('renders exactly 10 charger cards', () => {
    render(<Catalog />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(10)
  })

  it('renders each card model name as a heading', () => {
    render(<Catalog />)
    expect(
      screen.getByRole('heading', { name: /jc-duo premium/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /jc-dc ts premium/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /jc-ac wall/i }),
    ).toBeInTheDocument()
  })

  it('renders the power rating for each card', () => {
    render(<Catalog />)
    expect(screen.getAllByText(/kw/i).length).toBeGreaterThanOrEqual(10)
  })

  it('renders the connector type for each card', () => {
    render(<Catalog />)
    const connectorValues = screen.getAllByText(/type 2/i)
    expect(connectorValues.length).toBeGreaterThanOrEqual(1)
  })

  it('renders residential/commercial badge with visible text (not color-only)', () => {
    render(<Catalog />)
    const residentialBadges = screen.getAllByText(/residential/i)
    const commercialBadges = screen.getAllByText(/commercial/i)
    expect(residentialBadges.length + commercialBadges.length).toBeGreaterThanOrEqual(10)
  })

  it('renders a link to the product page for each card', () => {
    render(<Catalog />)
    const links = screen.getAllByRole('link', { name: /view product/i })
    expect(links).toHaveLength(10)
  })
})
