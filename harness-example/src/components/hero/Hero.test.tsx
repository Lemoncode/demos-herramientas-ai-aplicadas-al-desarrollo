import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders coming soon placeholder', () => {
    render(<Hero />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
