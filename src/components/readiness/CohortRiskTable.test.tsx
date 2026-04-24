import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CohortRiskTable } from './CohortRiskTable'
import type { Cohort } from '../../types/readiness'

const cohorts: Cohort[] = [
  {
    id: 'ontrack-1',
    program: 'Alpha Program',
    term: 'Spring 2025',
    graduates: 10,
    verifiedEarningsCoveragePct: 80,
    outcomesCoveragePct: 90,
    staleMissingPct: 5,
    placementRatePct: 88,
    trend: 'up',
    risk: 'on-track',
    sourceMix: {
      'verified-earnings': 40,
      surveys: 60,
      linkedin: 80,
      'self-report': 90,
    },
    suggestedAction: 'noop',
    lastVerifiedAt: '2026-04-01',
  },
  {
    id: 'watch-1',
    program: 'Beta Program',
    term: 'Fall 2024',
    graduates: 50,
    verifiedEarningsCoveragePct: 60,
    outcomesCoveragePct: 75,
    staleMissingPct: 15,
    placementRatePct: 72,
    trend: 'flat',
    risk: 'watch',
    sourceMix: {
      'verified-earnings': 30,
      surveys: 50,
      linkedin: 70,
      'self-report': 80,
    },
    suggestedAction: 'noop',
    lastVerifiedAt: '2026-04-01',
  },
  {
    id: 'atrisk-1',
    program: 'Gamma Program',
    term: 'Spring 2025',
    graduates: 25,
    verifiedEarningsCoveragePct: 40,
    outcomesCoveragePct: 60,
    staleMissingPct: 30,
    placementRatePct: 65,
    trend: 'down',
    risk: 'at-risk',
    sourceMix: {
      'verified-earnings': 15,
      surveys: 35,
      linkedin: 55,
      'self-report': 65,
    },
    suggestedAction: 'noop',
    lastVerifiedAt: '2026-03-01',
  },
]

function getDataRows() {
  const rows = screen.getAllByRole('row')
  // subtract header row
  return rows.slice(1)
}

describe('CohortRiskTable', () => {
  it('renders a row per cohort', () => {
    render(<CohortRiskTable cohorts={cohorts} />)
    expect(getDataRows()).toHaveLength(cohorts.length)
  })

  it('default sort is risk desc (at-risk first)', () => {
    render(<CohortRiskTable cohorts={cohorts} />)
    const firstRow = getDataRows()[0]
    expect(within(firstRow).getByText('Gamma Program')).toBeInTheDocument()
  })

  it('clicking Graduates header sorts desc first (largest first)', async () => {
    const user = userEvent.setup()
    render(<CohortRiskTable cohorts={cohorts} />)
    await user.click(screen.getByRole('button', { name: /graduates/i }))
    const firstRow = getDataRows()[0]
    // 50 is largest
    expect(within(firstRow).getByText('50')).toBeInTheDocument()
    const header = screen.getByRole('columnheader', { name: /graduates/i })
    expect(header).toHaveAttribute('aria-sort', 'descending')
  })

  it('clicking active sort column again toggles direction', async () => {
    const user = userEvent.setup()
    render(<CohortRiskTable cohorts={cohorts} />)
    await user.click(screen.getByRole('button', { name: /graduates/i }))
    await user.click(screen.getByRole('button', { name: /graduates/i }))
    const header = screen.getByRole('columnheader', { name: /graduates/i })
    expect(header).toHaveAttribute('aria-sort', 'ascending')
    const firstRow = getDataRows()[0]
    expect(within(firstRow).getByText('10')).toBeInTheDocument()
  })

  it('clicking a data row calls onRowClick with cohort id', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<CohortRiskTable cohorts={cohorts} onRowClick={onRowClick} />)
    const row = screen.getByRole('row', { name: /gamma program/i })
    await user.click(row)
    expect(onRowClick).toHaveBeenCalledWith('atrisk-1')
  })

  it('pressing Enter on a focused row calls onRowClick', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<CohortRiskTable cohorts={cohorts} onRowClick={onRowClick} />)
    const row = screen.getByRole('row', { name: /gamma program/i })
    row.focus()
    await user.keyboard('{Enter}')
    expect(onRowClick).toHaveBeenCalledWith('atrisk-1')
  })

  it('selectedCohortId marks the row via aria-selected', () => {
    render(
      <CohortRiskTable cohorts={cohorts} selectedCohortId="watch-1" />,
    )
    const selectedRow = screen.getByRole('row', { name: /beta program/i })
    expect(selectedRow).toHaveAttribute('aria-selected', 'true')
    const otherRow = screen.getByRole('row', { name: /gamma program/i })
    expect(otherRow).toHaveAttribute('aria-selected', 'false')
  })

  it('renders empty state when cohorts is empty', () => {
    render(<CohortRiskTable cohorts={[]} />)
    expect(
      screen.getByText('No cohorts match these filters.'),
    ).toBeInTheDocument()
  })
})
