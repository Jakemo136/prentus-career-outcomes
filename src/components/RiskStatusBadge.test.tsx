import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RiskStatusBadge } from './RiskStatusBadge'

describe('RiskStatusBadge', () => {
  it('renders "On track" when status is on-track', () => {
    render(<RiskStatusBadge status="on-track" />)
    expect(screen.getByText('On track')).toBeInTheDocument()
  })

  it('renders "Watch" when status is watch', () => {
    render(<RiskStatusBadge status="watch" />)
    expect(screen.getByText('Watch')).toBeInTheDocument()
  })

  it('renders "At risk" when status is at-risk', () => {
    render(<RiskStatusBadge status="at-risk" />)
    expect(screen.getByText('At risk')).toBeInTheDocument()
  })

  it('exposes role="status"', () => {
    render(<RiskStatusBadge status="on-track" />)
    expect(screen.getByRole('status')).toHaveTextContent('On track')
  })
})
