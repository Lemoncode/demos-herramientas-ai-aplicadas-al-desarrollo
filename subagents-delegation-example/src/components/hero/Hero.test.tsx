import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders coming soon text', () => {
    render(<Hero />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
