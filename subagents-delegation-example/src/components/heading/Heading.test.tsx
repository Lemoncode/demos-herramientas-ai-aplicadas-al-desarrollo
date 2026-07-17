import { render, screen } from '@testing-library/react'
import { Heading } from './Heading'

describe('Heading', () => {
  it('renders an h1 when level is 1', () => {
    render(<Heading level={1}>JivaEnergy</Heading>)
    expect(screen.getByRole('heading', { level: 1, name: 'JivaEnergy' })).toBeInTheDocument()
  })

  it('renders an h2 when level is 2', () => {
    render(<Heading level={2}>Cargadores</Heading>)
    expect(screen.getByRole('heading', { level: 2, name: 'Cargadores' })).toBeInTheDocument()
  })

  it('renders an h3 when level is 3', () => {
    render(<Heading level={3}>Modelo</Heading>)
    expect(screen.getByRole('heading', { level: 3, name: 'Modelo' })).toBeInTheDocument()
  })
})
