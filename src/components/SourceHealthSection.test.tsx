import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SourceHealthSection } from './SourceHealthSection'
import type { SourceHealth } from '../types/readiness'

const makeSource = (overrides: Partial<SourceHealth> = {}): SourceHealth => ({
  id: 'surveys',
  name: 'Surveys',
  coveragePct: 60,
  lastRefreshedAt: '2026-04-01',
  trust: 'medium',
  hasIssue: false,
  ...overrides,
})

describe('SourceHealthSection', () => {
  it('renders a level-2 "Source health" heading', () => {
    render(<SourceHealthSection sources={[]} />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Source health' }),
    ).toBeInTheDocument()
  })

  it('renders one SourceCard per source in input order', () => {
    const sources: SourceHealth[] = [
      makeSource({ id: 'verified-earnings', name: 'Verified Earnings', trust: 'high' }),
      makeSource({ id: 'surveys', name: 'Surveys' }),
      makeSource({ id: 'linkedin', name: 'LinkedIn' }),
      makeSource({ id: 'self-report', name: 'Self-report', trust: 'low' }),
    ]
    render(<SourceHealthSection sources={sources} />)
    const cardHeadings = screen.getAllByRole('heading', { level: 3 })
    expect(cardHeadings).toHaveLength(4)
  })

  it('renders the Verified Earnings card when included', () => {
    const sources: SourceHealth[] = [
      makeSource({
        id: 'verified-earnings',
        name: 'Verified Earnings',
        trust: 'high',
        hasIssue: true,
        issueNote: 'Payroll feed delayed',
        issueSeverity: 'warning',
      }),
    ]
    render(<SourceHealthSection sources={sources} />)
    expect(
      screen.getByRole('heading', { level: 3, name: 'Verified Earnings' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Payroll feed delayed')
  })

  it('renders the heading but no SourceCard when sources is empty', () => {
    render(<SourceHealthSection sources={[]} />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Source health' }),
    ).toBeInTheDocument()
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })
})
