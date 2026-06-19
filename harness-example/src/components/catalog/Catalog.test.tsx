import { render, screen } from '@testing-library/react'
import { Catalog } from './Catalog'

describe('Catalog', () => {
  it('renders the coming soon placeholder', () => {
    render(<Catalog />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
