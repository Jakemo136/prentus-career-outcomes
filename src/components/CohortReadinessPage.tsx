import { useEffect, useMemo, useRef } from 'react'
import { AppShell } from './AppShell'
import { CohortDrillInPanel } from './CohortDrillInPanel'
import { CohortRiskTable } from './CohortRiskTable'
import { FilterBar } from './FilterBar'
import { ReadinessSummaryStrip } from './ReadinessSummaryStrip'
import { SourceHealthSection } from './SourceHealthSection'
import { cohortsToCsv, downloadCsv } from '../lib/exportCsv'
import { applyFilters } from '../lib/filters'
import { computeKpisForCohorts } from '../lib/kpis'
import { useUrlState } from '../lib/useUrlState'
import type {
  Cohort,
  DashboardFilters,
  InstitutionSnapshot,
  SourceHealth,
  SourceId,
} from '../types/readiness'

export interface CohortReadinessPageProps {
  institution: InstitutionSnapshot
  cohorts: Cohort[]
  sources: SourceHealth[]
  programs: string[]
  terms: string[]
}

const VERIFICATION_VALUES = new Set(['verified', 'unverified', 'partial'])
const SOURCE_VALUES = new Set<SourceId>([
  'verified-earnings',
  'surveys',
  'linkedin',
  'self-report',
])

function parseFilters(params: URLSearchParams): DashboardFilters {
  const source = params.get('source')
  const verification = params.get('verification')
  return {
    program: params.get('program') || null,
    term: params.get('term') || null,
    source:
      source && SOURCE_VALUES.has(source as SourceId)
        ? (source as SourceId)
        : null,
    verification:
      verification && VERIFICATION_VALUES.has(verification)
        ? (verification as DashboardFilters['verification'])
        : null,
  }
}

function writeFilters(
  params: URLSearchParams,
  filters: DashboardFilters,
): URLSearchParams {
  const next = new URLSearchParams(params)
  const fields: (keyof DashboardFilters)[] = [
    'program',
    'term',
    'source',
    'verification',
  ]
  for (const key of fields) {
    const value = filters[key]
    if (value) next.set(key, value)
    else next.delete(key)
  }
  return next
}

export function CohortReadinessPage({
  institution,
  cohorts,
  sources,
  programs,
  terms,
}: CohortReadinessPageProps) {
  const [params, setParams] = useUrlState()
  const filters = useMemo(() => parseFilters(params), [params])
  const cohortId = params.get('cohort')

  // Cohort lookup — tolerate a stale/unknown ?cohort= by rendering no drawer.
  const drillCohort = useMemo<Cohort | null>(() => {
    if (!cohortId) return null
    return cohorts.find((c) => c.id === cohortId) ?? null
  }, [cohortId, cohorts])

  const filteredCohorts = useMemo(
    () => applyFilters(cohorts, filters),
    [cohorts, filters],
  )

  const kpis = useMemo(
    () => computeKpisForCohorts(filteredCohorts, institution.kpis),
    [filteredCohorts, institution.kpis],
  )

  // Remember the row that opened the drawer so we can restore focus on close.
  const lastTriggerId = useRef<string | null>(null)
  useEffect(() => {
    if (!cohortId && lastTriggerId.current) {
      const row = document.querySelector<HTMLElement>(
        `tr[data-cohort-id="${lastTriggerId.current}"]`,
      )
      row?.focus()
      lastTriggerId.current = null
    }
  }, [cohortId])

  const handleFilterChange = (next: DashboardFilters) => {
    setParams(writeFilters(params, next))
  }

  const handleRowClick = (id: string) => {
    lastTriggerId.current = id
    const next = new URLSearchParams(params)
    next.set('cohort', id)
    setParams(next)
  }

  const handleClose = () => {
    const next = new URLSearchParams(params)
    next.delete('cohort')
    setParams(next)
  }

  const handleExport = () => {
    downloadCsv('cohort-readiness.csv', cohortsToCsv(filteredCohorts))
  }

  return (
    <AppShell
      pageTitle="Compliance Readiness"
      pageSubtitle="Admin → Career Outcomes"
      onExport={handleExport}
    >
      <div className="flex flex-col gap-8">
        <section aria-labelledby="sec-filters" className="flex flex-col gap-3">
          <h2 id="sec-filters" className="text-h4 text-ink">
            Filter cohorts
          </h2>
          <FilterBar
            filters={filters}
            programs={programs}
            terms={terms}
            onChange={handleFilterChange}
          />
        </section>

        <ReadinessSummaryStrip kpis={kpis} />

        <section aria-labelledby="sec-cohorts" className="flex flex-col gap-3">
          <h2 id="sec-cohorts" className="text-h4 text-ink">
            Cohort risk
          </h2>
          {/* Cap height so Source Health's vertical position doesn't drift
              with row count. Header stays visible; body scrolls within. */}
          <div className="rounded-md border border-edge-subtle bg-surface-raised max-h-96 overflow-y-auto">
            <CohortRiskTable
              cohorts={filteredCohorts}
              onRowClick={handleRowClick}
              selectedCohortId={drillCohort?.id ?? null}
            />
          </div>
        </section>

        <SourceHealthSection sources={sources} />
      </div>

      <CohortDrillInPanel cohort={drillCohort} onClose={handleClose} />
    </AppShell>
  )
}
