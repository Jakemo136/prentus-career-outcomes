import { useEffect, useMemo, useRef } from 'react'
import { AppShell } from './AppShell'
import { CohortDrillInPanel } from './CohortDrillInPanel'
import { CohortRiskTable } from './CohortRiskTable'
import { FilterBar } from './FilterBar'
import { ReadinessSummaryStrip } from './ReadinessSummaryStrip'
import { Section } from './Section'
import { SourceHealthSection } from './SourceHealthSection'
import { cohortsToCsv, downloadCsv } from '../lib/exportCsv'
import { applyFilters } from '../lib/filters'
import { computeKpisForCohorts } from '../lib/kpis'
import { parseFilters, writeFilters } from '../lib/urlParams'
import { useUrlState } from '../lib/useUrlState'
import type {
  Cohort,
  DashboardFilters,
  InstitutionSnapshot,
  SourceHealth,
} from '../types/readiness'

export interface CohortReadinessPageProps {
  institution: InstitutionSnapshot
  cohorts: Cohort[]
  sources: SourceHealth[]
  programs: string[]
  terms: string[]
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
        <Section heading="Filter cohorts">
          <FilterBar
            filters={filters}
            programs={programs}
            terms={terms}
            onChange={handleFilterChange}
          />
        </Section>

        <ReadinessSummaryStrip kpis={kpis} />

        <Section heading="Cohort risk">
          {/* Cap height so Source Health's vertical position doesn't drift
              with row count. Header stays visible; body scrolls within. */}
          <div className="rounded-md border border-edge-subtle bg-surface-raised max-h-96 overflow-y-auto">
            <CohortRiskTable
              cohorts={filteredCohorts}
              onRowClick={handleRowClick}
              selectedCohortId={drillCohort?.id ?? null}
            />
          </div>
        </Section>

        <SourceHealthSection sources={sources} />
      </div>

      <CohortDrillInPanel cohort={drillCohort} onClose={handleClose} />
    </AppShell>
  )
}
