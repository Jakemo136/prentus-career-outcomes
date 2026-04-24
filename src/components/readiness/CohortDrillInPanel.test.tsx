import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CohortDrillInPanel } from './CohortDrillInPanel'
import type { Cohort } from '../../types/readiness'

const cohort: Cohort = {
  id: 'fs-sp25',
  program: 'Full-Stack Web Development',
  term: 'Spring 2025',
  graduates: 48,
  verifiedEarningsCoveragePct: 76,
  outcomesCoveragePct: 94,
  staleMissingPct: 6,
  placementRatePct: 89,
  trend: 'up',
  risk: 'on-track',
  sourceMix: {
    'verified-earnings': 42,
    surveys: 68,
    linkedin: 88,
    'self-report': 94,
  },
  suggestedAction:
    'Maintain current verification cadence; flagship cohort — use as benchmark.',
  lastVerifiedAt: '2026-04-18',
}

describe('CohortDrillInPanel', () => {
  it('renders nothing when cohort is null', () => {
    render(<CohortDrillInPanel cohort={null} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders a dialog with accessible name matching the cohort program', () => {
    render(<CohortDrillInPanel cohort={cohort} onClose={() => {}} />)
    expect(
      screen.getByRole('dialog', { name: cohort.program }),
    ).toBeInTheDocument()
  })

  it('renders the cohort term near the heading', () => {
    render(<CohortDrillInPanel cohort={cohort} onClose={() => {}} />)
    expect(screen.getByText(cohort.term)).toBeInTheDocument()
  })

  it('renders a risk status badge reflecting the cohort risk', () => {
    render(<CohortDrillInPanel cohort={cohort} onClose={() => {}} />)
    expect(screen.getByText('On track')).toBeInTheDocument()
  })

  it('renders four coverage meters (one per source id)', () => {
    render(<CohortDrillInPanel cohort={cohort} onClose={() => {}} />)
    expect(screen.getAllByRole('progressbar')).toHaveLength(4)
  })

  it('renders the suggested action text', () => {
    render(<CohortDrillInPanel cohort={cohort} onClose={() => {}} />)
    expect(screen.getByText(cohort.suggestedAction)).toBeInTheDocument()
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<CohortDrillInPanel cohort={cohort} onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<CohortDrillInPanel cohort={cohort} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
