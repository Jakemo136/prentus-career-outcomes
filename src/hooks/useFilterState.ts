import { useCallback, useMemo } from 'react'
import { parseFilters, writeFilters } from '../lib/urlParams'
import { useUrlState } from '../lib/useUrlState'
import type { DashboardFilters } from '../types/readiness'

export interface FilterState {
  /** Parsed from the current URL. */
  filters: DashboardFilters
  /** Writes a new filter set to the URL. Preserves `?cohort=`. */
  setFilters: (next: DashboardFilters) => void
  /** Currently-open drill-in cohort id, if any. */
  cohortId: string | null
  /** Opens the drill-in for a cohort — writes `?cohort=<id>` to the URL. */
  openCohort: (id: string) => void
  /** Closes the drill-in — removes `?cohort=` from the URL. */
  closeCohort: () => void
}

/**
 * Page-level state hook that wraps URL plumbing. Encapsulates the
 * URLSearchParams clone → mutate → set pattern so the consuming page
 * doesn't need to know about the URL at all.
 */
export function useFilterState(): FilterState {
  const [params, setParams] = useUrlState()
  const filters = useMemo(() => parseFilters(params), [params])
  const cohortId = params.get('cohort')

  const setFilters = useCallback(
    (next: DashboardFilters) => {
      setParams(writeFilters(params, next))
    },
    [params, setParams],
  )

  const openCohort = useCallback(
    (id: string) => {
      const next = new URLSearchParams(params)
      next.set('cohort', id)
      setParams(next)
    },
    [params, setParams],
  )

  const closeCohort = useCallback(() => {
    const next = new URLSearchParams(params)
    next.delete('cohort')
    setParams(next)
  }, [params, setParams])

  return { filters, setFilters, cohortId, openCohort, closeCohort }
}
