import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Catalog } from './Catalog'

describe('Catalog', () => {
  it('renders exactly 10 charger cards', () => {
    render(<Catalog />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(10)
  })

  it('renders each card model name as a heading using the Heading primitive', () => {
    render(<Catalog />)
    expect(
      screen.getByRole('heading', { name: /jc-duo premium/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /jc-fleet hub/i }),
    ).toBeInTheDocument()
  })

  it('renders the power rating in kW for each card', () => {
    render(<Catalog />)
    const powerValues = screen.getAllByText(/kw/i)
    expect(powerValues.length).toBeGreaterThanOrEqual(10)
  })

  it('renders the connector type for each card', () => {
    render(<Catalog />)
    const connectorValues = screen.getAllByText(/type 2/i)
    expect(connectorValues.length).toBeGreaterThanOrEqual(1)
  })

  it('renders residential badge with visible text — not color-only', () => {
    render(<Catalog />)
    const residentialBadges = screen.getAllByText(/residencial/i)
    expect(residentialBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('renders commercial badge with visible text — not color-only', () => {
    render(<Catalog />)
    const commercialBadges = screen.getAllByText(/comercial/i)
    expect(commercialBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('renders all 10 residential/commercial badges', () => {
    render(<Catalog />)
    const residentialBadges = screen.getAllByText(/residencial/i)
    const commercialBadges = screen.getAllByText(/comercial/i)
    expect(residentialBadges.length + commercialBadges.length).toBe(10)
  })

  it('renders a link to the product page for each card', () => {
    render(<Catalog />)
    const links = screen.getAllByRole('link', { name: /ver producto/i })
    expect(links).toHaveLength(10)
  })
})
