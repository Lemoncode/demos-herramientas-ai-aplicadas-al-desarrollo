import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Page from './page'

describe('Page', () => {
  it('renders at least one heading', () => {
    render(<Page />)
    expect(screen.getAllByRole('heading').length).toBeGreaterThan(0)
  })
})
