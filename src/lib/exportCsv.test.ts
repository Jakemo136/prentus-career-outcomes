import { describe, it, expect } from 'vitest'
import { cohortsToCsv } from './exportCsv'
import type { Cohort } from '../types/readiness'

const baseCohort: Cohort = {
  id: 'a',
  program: 'Data Analytics',
  term: 'Spring 2025',
  graduates: 30,
  verifiedEarningsCoveragePct: 50,
  outcomesCoveragePct: 70,
  staleMissingPct: 10,
  placementRatePct: 80,
  trend: 'up',
  risk: 'watch',
  sourceMix: {
    'verified-earnings': 25,
    surveys: 50,
    linkedin: 70,
    'self-report': 80,
  },
  suggestedAction: 'Steady state',
  lastVerifiedAt: '2026-04-18',
}

describe('cohortsToCsv', () => {
  it('emits a header row + one row per cohort', () => {
    const csv = cohortsToCsv([baseCohort])
    const lines = csv.split('\n')
    expect(lines).toHaveLength(2)
    expect(lines[0]).toMatch(/^Program,Term,Graduates/)
    expect(lines[1]).toContain('Data Analytics')
    expect(lines[1]).toContain('Spring 2025')
  })

  it('RFC-4180 quotes cells that contain commas', () => {
    const csv = cohortsToCsv([
      { ...baseCohort, program: 'Full-Stack, Web Dev' },
    ])
    expect(csv.split('\n')[1]).toContain('"Full-Stack, Web Dev"')
  })

  it('doubles embedded quotes', () => {
    const csv = cohortsToCsv([
      { ...baseCohort, program: 'Data "Analytics"' },
    ])
    expect(csv.split('\n')[1]).toContain('"Data ""Analytics"""')
  })

  it('returns just the header row when cohorts is empty', () => {
    const csv = cohortsToCsv([])
    expect(csv.split('\n')).toHaveLength(1)
    expect(csv).toMatch(/^Program,Term,/)
  })
})
