import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { KpiCard } from './KpiCard'
import type { Metric } from '../../types/readiness'

const pctMetric: Metric = {
  value: 62.4,
  deltaPct: 2.1,
  polarity: 'higher-is-better',
  unit: '%',
}

const countMetric: Metric = {
  value: 12345,
  deltaPct: -1.2,
  polarity: 'lower-is-better',
  unit: 'count',
}

describe('KpiCard', () => {
  it('renders the label text', () => {
    render(<KpiCard label="Verified Earnings" metric={pctMetric} />)
    expect(screen.getByText('Verified Earnings')).toBeInTheDocument()
  })

  it('renders a percent value correctly', () => {
    render(<KpiCard label="Outcomes Coverage" metric={pctMetric} />)
    expect(screen.getByText('62%')).toBeInTheDocument()
  })

  it('renders a count value with thousands separator', () => {
    render(<KpiCard label="Graduates" metric={countMetric} />)
    expect(screen.getByText('12,345')).toBeInTheDocument()
  })

  it('renders a TrendIndicator with correct direction', () => {
    render(<KpiCard label="Verified Earnings" metric={pctMetric} />)
    expect(
      screen.getByRole('img', { name: /trending up/i })
    ).toBeInTheDocument()
  })

  it('renders a CoverageMeter when coveragePct is provided', () => {
    render(
      <KpiCard
        label="Verified Earnings"
        metric={pctMetric}
        coveragePct={72}
      />
    )
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('does not render a CoverageMeter when coveragePct is omitted', () => {
    render(<KpiCard label="Verified Earnings" metric={pctMetric} />)
    expect(screen.queryByRole('progressbar')).toBeNull()
  })
})
