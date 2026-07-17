import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Catalog } from './Catalog'

describe('Catalog', () => {
  it('renders exactly 10 charger cards', () => {
    render(<Catalog />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(10)
  })

  it('renders the model name as a heading for each card', () => {
    render(<Catalog />)
    expect(screen.getByRole('heading', { name: /JC-DUO Premium/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /JC-DC TS Premium/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /JC-AC Wall/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /JC-Fleet Hub/i })).toBeInTheDocument()
  })

  it('renders the power rating for each card', () => {
    render(<Catalog />)
    // Two chargers share 22 kW (JC-DUO Premium and JC-AC Pole), so use getAllByText
    expect(screen.getAllByText(/22\s*kW/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/360\s*kW/i)).toBeInTheDocument()
  })

  it('renders the connector type for each card', () => {
    render(<Catalog />)
    expect(screen.getAllByText(/Type 2/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/CCS2/i).length).toBeGreaterThan(0)
  })

  it('renders a residential badge with visible text — not color-only', () => {
    render(<Catalog />)
    const residentialBadges = screen.getAllByText(/residencial/i)
    expect(residentialBadges.length).toBeGreaterThan(0)
  })

  it('renders a commercial badge with visible text — not color-only', () => {
    render(<Catalog />)
    const commercialBadges = screen.getAllByText(/comercial/i)
    expect(commercialBadges.length).toBeGreaterThan(0)
  })

  it('renders a link to the product page for each charger', () => {
    render(<Catalog />)
    const links = screen.getAllByRole('link', { name: /ver producto/i })
    expect(links).toHaveLength(10)
  })
})
