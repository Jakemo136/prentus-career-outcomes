import { useMemo } from 'react'
import { AppShell } from './AppShell'
import { CohortDrillInPanel } from './CohortDrillInPanel'
import { CohortRiskTable } from './CohortRiskTable'
import { FilterBar } from './FilterBar'
import { ReadinessSummaryStrip } from './ReadinessSummaryStrip'
import { Section } from './Section'
import { SourceHealthSection } from './SourceHealthSection'
import { useFilterState } from '../hooks/useFilterState'
import { useReturnFocus } from '../hooks/useReturnFocus'
import { cohortsToCsv, downloadCsv } from '../lib/exportCsv'
import { applyFilters } from '../lib/filters'
import { computeKpisForCohorts } from '../lib/kpis'
import type {
  Cohort,
  InstitutionSnapshot,
  SourceHealth,
} from '../types/readiness'

export interface ComplianceReadinessPageProps {
  institution: InstitutionSnapshot
  cohorts: Cohort[]
  sources: SourceHealth[]
  programs: string[]
  terms: string[]
}

function findCohortRow(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `tr[data-cohort-id="${id}"]`,
  )
}

export function ComplianceReadinessPage({
  institution,
  cohorts,
  sources,
  programs,
  terms,
}: ComplianceReadinessPageProps) {
  const { filters, setFilters, cohortId, openCohort, closeCohort } =
    useFilterState()

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

  const rememberTrigger = useReturnFocus(cohortId, findCohortRow)

  const handleRowClick = (id: string) => {
    rememberTrigger(id)
    openCohort(id)
  }

  const handleExport = () => {
    downloadCsv(
      'compliance-readiness.csv',
      cohortsToCsv(filteredCohorts),
    )
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
            onChange={setFilters}
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

      <CohortDrillInPanel cohort={drillCohort} onClose={closeCohort} />
    </AppShell>
  )
}
