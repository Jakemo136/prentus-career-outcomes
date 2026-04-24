import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SourceCard } from './SourceCard'
import type { SourceHealth } from '../../types/readiness'

const baseSource: SourceHealth = {
  id: 'verified-earnings',
  name: 'Verified Earnings',
  coveragePct: 82,
  lastRefreshedAt: '2026-04-18',
  trust: 'high',
  hasIssue: false,
}

describe('SourceCard', () => {
  it('renders the source name as a level-3 heading', () => {
    render(<SourceCard source={baseSource} />)
    expect(
      screen.getByRole('heading', { level: 3, name: 'Verified Earnings' }),
    ).toBeInTheDocument()
  })

  it('renders the trust level label', () => {
    render(<SourceCard source={{ ...baseSource, trust: 'high' }} />)
    expect(screen.getByText('High trust')).toBeInTheDocument()
  })

  it('renders the coverage meter as a progressbar', () => {
    render(<SourceCard source={{ ...baseSource, coveragePct: 82 }} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '82')
  })

  it('renders the formatted last-refreshed date', () => {
    render(<SourceCard source={{ ...baseSource, lastRefreshedAt: '2026-04-18' }} />)
    expect(screen.getByText(/Updated Apr/)).toBeInTheDocument()
  })

  it('renders the issue note when hasIssue is true', () => {
    render(
      <SourceCard
        source={{
          ...baseSource,
          hasIssue: true,
          issueNote: 'Coverage below target',
        }}
      />,
    )
    expect(screen.getByText('Coverage below target')).toBeInTheDocument()
  })

  it('does not render an issue row when hasIssue is false', () => {
    render(<SourceCard source={{ ...baseSource, hasIssue: false }} />)
    expect(screen.queryByText(/needs attention|coverage below/i)).toBeNull()
  })
})
