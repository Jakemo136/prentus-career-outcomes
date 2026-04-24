import type {
  Cohort,
  InstitutionSnapshot,
  Metric,
} from '../types/readiness'

/**
 * Recomputes the top-strip KPIs for an arbitrary (filtered) cohort list.
 *
 * Coverage-style metrics are graduate-weighted averages, not cohort-count
 * averages — a 50-grad cohort at 80% coverage should dominate a 10-grad
 * cohort at 20%. Delta / polarity metadata is carried from the baseline
 * institution snapshot; recomputing a trusted period-over-period delta
 * from filtered data would require historical data the prototype doesn't
 * carry.
 *
 * When called with an empty cohort list (e.g. filters with no matches)
 * the coverage metrics return `NaN` so the UI can render "—" instead of
 * a misleading zero.
 */
export function computeKpisForCohorts(
  cohorts: Cohort[],
  baseline: InstitutionSnapshot['kpis'],
): InstitutionSnapshot['kpis'] {
  const totalGrads = cohorts.reduce((sum, c) => sum + c.graduates, 0)

  const weightedAverage = (select: (c: Cohort) => number): number => {
    if (totalGrads === 0) return Number.NaN
    const weighted = cohorts.reduce(
      (sum, c) => sum + select(c) * c.graduates,
      0,
    )
    return weighted / totalGrads
  }

  const carryMeta = (base: Metric, value: number): Metric => ({
    value,
    deltaPct: base.deltaPct,
    polarity: base.polarity,
    unit: base.unit,
  })

  return {
    verifiedEarningsCoverage: carryMeta(
      baseline.verifiedEarningsCoverage,
      weightedAverage((c) => c.verifiedEarningsCoveragePct),
    ),
    outcomesCoverage: carryMeta(
      baseline.outcomesCoverage,
      weightedAverage((c) => c.outcomesCoveragePct),
    ),
    staleMissingPct: carryMeta(
      baseline.staleMissingPct,
      weightedAverage((c) => c.staleMissingPct),
    ),
    programsAtRisk: carryMeta(
      baseline.programsAtRisk,
      cohorts.filter((c) => c.risk === 'at-risk').length,
    ),
    placementRate: carryMeta(
      baseline.placementRate,
      weightedAverage((c) => c.placementRatePct),
    ),
  }
}
