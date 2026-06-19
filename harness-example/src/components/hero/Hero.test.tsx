import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the coming soon placeholder', () => {
    render(<Hero />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
