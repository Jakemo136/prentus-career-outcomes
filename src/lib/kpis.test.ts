import { describe, expect, it } from 'vitest'
import { MOCK_COHORTS, MOCK_INSTITUTION } from '../mocks/readiness'
import { computeKpisForCohorts } from './kpis'

describe('computeKpisForCohorts', () => {
  it('returns all-"—" (NaN) metrics when given an empty cohort list', () => {
    const result = computeKpisForCohorts([], MOCK_INSTITUTION.kpis)
    expect(result.verifiedEarningsCoverage.value).toBeNaN()
    expect(result.outcomesCoverage.value).toBeNaN()
    expect(result.staleMissingPct.value).toBeNaN()
    expect(result.programsAtRisk.value).toBe(0)
    expect(result.placementRate.value).toBeNaN()
  })

  it('computes graduate-weighted averages for coverage metrics', () => {
    // Two cohorts with different graduate counts
    const cohorts = MOCK_COHORTS.filter((c) => c.id === 'fs-sp25' || c.id === 'fs-f24')
    const result = computeKpisForCohorts(cohorts, MOCK_INSTITUTION.kpis)

    // fs-sp25: 48 grads, 76% verified. fs-f24: 52 grads, 71% verified.
    // weighted: (48*76 + 52*71) / (48+52) = (3648 + 3692) / 100 = 73.4
    expect(result.verifiedEarningsCoverage.value).toBeCloseTo(73.4, 1)
  })

  it('counts at-risk cohorts distinctly', () => {
    const result = computeKpisForCohorts(MOCK_COHORTS, MOCK_INSTITUTION.kpis)
    const expected = MOCK_COHORTS.filter((c) => c.risk === 'at-risk').length
    expect(result.programsAtRisk.value).toBe(expected)
  })

  it('preserves delta + polarity metadata from the baseline snapshot', () => {
    const cohorts = MOCK_COHORTS.slice(0, 2)
    const result = computeKpisForCohorts(cohorts, MOCK_INSTITUTION.kpis)
    expect(result.verifiedEarningsCoverage.polarity).toBe('higher-is-better')
    expect(result.staleMissingPct.polarity).toBe('lower-is-better')
    expect(result.verifiedEarningsCoverage.deltaPct).toBe(
      MOCK_INSTITUTION.kpis.verifiedEarningsCoverage.deltaPct,
    )
  })
})
