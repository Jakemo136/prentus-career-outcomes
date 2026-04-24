import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { CohortDrillInPanel } from './components/CohortDrillInPanel'
import { CohortRiskTable } from './components/CohortRiskTable'
import { CoverageMeter } from './components/CoverageMeter'
import { FilterBar } from './components/FilterBar'
import { ReadinessSummaryStrip } from './components/ReadinessSummaryStrip'
import { RiskStatusBadge } from './components/RiskStatusBadge'
import { SourceHealthSection } from './components/SourceHealthSection'
import { TrendIndicator } from './components/TrendIndicator'
import {
  MOCK_COHORTS,
  MOCK_INSTITUTION,
  MOCK_PROGRAMS,
  MOCK_SOURCES,
  MOCK_TERMS,
} from './mocks/readiness'
import type { Cohort, DashboardFilters } from './types/readiness'

const INITIAL_FILTERS: DashboardFilters = {
  program: null,
  term: null,
  source: null,
  verification: null,
}

export function App() {
  const [filters, setFilters] = useState<DashboardFilters>(INITIAL_FILTERS)
  const [drillCohort, setDrillCohort] = useState<Cohort | null>(null)

  const openDrillIn = (id: string) => {
    const next = MOCK_COHORTS.find((c) => c.id === id) ?? null
    setDrillCohort(next)
  }

  return (
    <AppShell
      pageTitle="Career Outcomes Readiness"
      pageSubtitle="Admin → Career Outcomes"
      onExport={() => undefined}
    >
      <div className="flex flex-col gap-8">
        <FilterBar
          filters={filters}
          programs={MOCK_PROGRAMS}
          terms={MOCK_TERMS}
          onChange={setFilters}
        />

        <ReadinessSummaryStrip kpis={MOCK_INSTITUTION.kpis} />

        <section aria-labelledby="sec-cohorts" className="flex flex-col gap-3">
          <h2 id="sec-cohorts" className="text-h4 text-ink">
            Cohort risk
          </h2>
          <div className="rounded-md border border-edge-subtle bg-surface-raised overflow-hidden">
            <CohortRiskTable
              cohorts={MOCK_COHORTS}
              onRowClick={openDrillIn}
              selectedCohortId={drillCohort?.id ?? null}
            />
          </div>
        </section>

        <SourceHealthSection sources={MOCK_SOURCES} />

        <section
          aria-labelledby="sec-primitives"
          className="flex flex-col gap-4 pt-6 border-t border-edge-subtle"
        >
          <h2 id="sec-primitives" className="text-h4 text-muted">
            Primitive gallery
          </h2>
          <div className="flex gap-2">
            <RiskStatusBadge status="on-track" />
            <RiskStatusBadge status="watch" />
            <RiskStatusBadge status="at-risk" />
          </div>
          <div className="flex gap-4">
            <TrendIndicator direction="up" deltaPct={3.2} />
            <TrendIndicator direction="down" deltaPct={-1.5} />
            <TrendIndicator direction="flat" />
          </div>
          <div className="max-w-md flex flex-col gap-2">
            <CoverageMeter percent={30} label="Meter — threshold (low)" />
            <CoverageMeter percent={62} label="Meter — threshold (medium)" />
            <CoverageMeter percent={88} label="Meter — threshold (high)" />
            <CoverageMeter
              percent={30}
              label="Meter — brand tone"
              tone="brand"
            />
          </div>
        </section>
      </div>

      <CohortDrillInPanel
        cohort={drillCohort}
        onClose={() => setDrillCohort(null)}
      />
    </AppShell>
  )
}
