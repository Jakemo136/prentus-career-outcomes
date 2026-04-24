import { useState } from 'react'
import { CohortDrillInPanel } from './components/CohortDrillInPanel'
import { CohortRiskTable } from './components/CohortRiskTable'
import { CoverageMeter } from './components/CoverageMeter'
import { FilterBar } from './components/FilterBar'
import { KpiCard } from './components/KpiCard'
import { RiskStatusBadge } from './components/RiskStatusBadge'
import { Sidebar } from './components/Sidebar'
import { SourceCard } from './components/SourceCard'
import { TopBar } from './components/TopBar'
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
    <div className="min-h-screen bg-surface flex">
      <Sidebar activeKey="readiness" />

      <main className="flex-1 flex flex-col">
        <TopBar
          title="Career Outcomes Readiness"
          subtitle="Admin → Career Outcomes"
          onExport={() => undefined}
        />

        <div className="p-8 flex flex-col gap-8">
          <FilterBar
            filters={filters}
            programs={MOCK_PROGRAMS}
            terms={MOCK_TERMS}
            onChange={setFilters}
          />

          <section aria-labelledby="sec-kpis" className="flex flex-col gap-3">
            <h2 id="sec-kpis" className="text-h4 text-ink">
              Readiness summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <KpiCard
                label="Verified earnings coverage"
                metric={MOCK_INSTITUTION.kpis.verifiedEarningsCoverage}
                variant="hero"
                coveragePct={MOCK_INSTITUTION.kpis.verifiedEarningsCoverage.value}
              />
              <KpiCard
                label="Outcomes coverage"
                metric={MOCK_INSTITUTION.kpis.outcomesCoverage}
                variant="default"
                coveragePct={MOCK_INSTITUTION.kpis.outcomesCoverage.value}
              />
              <KpiCard
                label="Stale / missing"
                metric={MOCK_INSTITUTION.kpis.staleMissingPct}
                variant="urgent"
                caption="Needs verification"
              />
              <KpiCard
                label="Programs at risk"
                metric={MOCK_INSTITUTION.kpis.programsAtRisk}
                variant="urgent"
                caption="Needs attention"
              />
              <KpiCard
                label="Placement rate"
                metric={MOCK_INSTITUTION.kpis.placementRate}
                variant="default"
              />
            </div>
          </section>

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

          <section aria-labelledby="sec-sources" className="flex flex-col gap-3">
            <h2 id="sec-sources" className="text-h4 text-ink">
              Source health
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_SOURCES.map((source) => (
                <SourceCard
                  key={source.id}
                  source={source}
                  isHero={source.id === 'verified-earnings'}
                />
              ))}
            </div>
          </section>

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
      </main>

      <CohortDrillInPanel
        cohort={drillCohort}
        onClose={() => setDrillCohort(null)}
      />
    </div>
  )
}
