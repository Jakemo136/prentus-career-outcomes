import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReadinessSummaryStrip } from './ReadinessSummaryStrip'
import type { Metric, InstitutionSnapshot } from '../../types/readiness'

type InstitutionKpis = InstitutionSnapshot['kpis']

const makeMetric = (overrides: Partial<Metric> = {}): Metric => ({
  value: 50,
  deltaPct: 0,
  polarity: 'higher-is-better',
  unit: '%',
  ...overrides,
})

const makeKpis = (): InstitutionKpis => ({
  verifiedEarningsCoverage: makeMetric({ value: 72 }),
  outcomesCoverage: makeMetric({ value: 81 }),
  staleMissingPct: makeMetric({
    value: 14,
    polarity: 'lower-is-better',
  }),
  programsAtRisk: makeMetric({ value: 3, unit: 'count', polarity: 'lower-is-better' }),
  placementRate: makeMetric({ value: 88 }),
})

describe('ReadinessSummaryStrip', () => {
  it('renders a level-2 heading "Readiness summary"', () => {
    render(<ReadinessSummaryStrip kpis={makeKpis()} />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Readiness summary' }),
    ).toBeInTheDocument()
  })

  it('renders all 5 KPI card labels in narrative order', () => {
    render(<ReadinessSummaryStrip kpis={makeKpis()} />)
    expect(screen.getByText('Verified earnings coverage')).toBeInTheDocument()
    expect(screen.getByText('Outcomes coverage')).toBeInTheDocument()
    expect(screen.getByText('Stale / missing', { exact: true })).toBeInTheDocument()
    expect(screen.getByText('Programs at risk')).toBeInTheDocument()
    expect(screen.getByText('Placement rate')).toBeInTheDocument()
  })

  it('renders exactly 2 coverage meters (hero + outcomes)', () => {
    render(<ReadinessSummaryStrip kpis={makeKpis()} />)
    expect(screen.getAllByRole('progressbar')).toHaveLength(2)
  })

  it('shows "Needs attention" caption on both urgent cards', () => {
    render(<ReadinessSummaryStrip kpis={makeKpis()} />)
    expect(screen.getAllByText('Needs attention')).toHaveLength(2)
  })

  it('renders Verified earnings coverage as the first card in the strip', () => {
    const { container } = render(<ReadinessSummaryStrip kpis={makeKpis()} />)
    const articles = container.querySelectorAll('article')
    expect(articles.length).toBeGreaterThan(0)
    expect(articles[0]).toHaveTextContent('Verified earnings coverage')
  })
})
