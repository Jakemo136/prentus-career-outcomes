import type { Cohort, DashboardFilters } from '../types/readiness'

export const EMPTY_FILTERS: DashboardFilters = {
  program: null,
  term: null,
  source: null,
  verification: null,
}

/**
 * Verification bucket thresholds for the filter dropdown. Picked to
 * give a believable three-way split across the mock cohorts:
 *   ≥ 70%  → verified
 *   50–69% → partial
 *   < 50%  → unverified
 */
const VERIFIED_THRESHOLD = 70
const UNVERIFIED_THRESHOLD = 50

/**
 * Applies the current filter selection to a cohort list. Pure function;
 * no memoization — callers should memoize at the hook layer if needed.
 *
 * Note: the `source` filter intentionally has no effect on the cohort
 * list. Source filtering is an affordance for the Source Health panel,
 * not the cohort table — the Source Health panel is institution-scoped
 * in this prototype.
 */
export function applyFilters(
  cohorts: Cohort[],
  filters: DashboardFilters,
): Cohort[] {
  return cohorts.filter((cohort) => {
    if (filters.program && cohort.program !== filters.program) return false
    if (filters.term && cohort.term !== filters.term) return false
    if (filters.verification) {
      const v = cohort.verifiedEarningsCoveragePct
      if (filters.verification === 'verified' && v < VERIFIED_THRESHOLD)
        return false
      if (filters.verification === 'unverified' && v >= UNVERIFIED_THRESHOLD)
        return false
      if (
        filters.verification === 'partial' &&
        (v < UNVERIFIED_THRESHOLD || v >= VERIFIED_THRESHOLD)
      )
        return false
    }
    return true
  })
}
