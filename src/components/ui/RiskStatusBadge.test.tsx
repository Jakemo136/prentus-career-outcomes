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

  it('is not announced as a live region (no role="status")', () => {
    // Many badges in a table would create N live regions and spam
    // screen readers on sort/filter. Visible text is the a11y contract.
    render(<RiskStatusBadge status="on-track" />)
    expect(screen.queryByRole('status')).toBeNull()
  })
})
