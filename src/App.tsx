import { useState } from 'react'
import { CoverageMeter } from './components/CoverageMeter'
import { FilterBar } from './components/FilterBar'
import { RiskStatusBadge } from './components/RiskStatusBadge'
import { SidebarNavItem } from './components/SidebarNavItem'
import { TopBar } from './components/TopBar'
import { TrendIndicator } from './components/TrendIndicator'
import type { DashboardFilters } from './types/readiness'

const INITIAL_FILTERS: DashboardFilters = {
  program: null,
  term: null,
  source: null,
  verification: null,
}

export function App() {
  const [filters, setFilters] = useState<DashboardFilters>(INITIAL_FILTERS)

  return (
    <main className="min-h-screen bg-surface p-8">
      <section className="max-w-5xl mx-auto space-y-10">
        <header>
          <h1 className="text-h2 text-ink">Primitives gallery</h1>
          <p className="text-body-s text-muted mt-1">
            Wave 1 leaf components rendered in isolation. Replaced by the real
            dashboard in Wave 4.
          </p>
        </header>

        <section aria-labelledby="sec-topbar" className="space-y-3">
          <h2 id="sec-topbar" className="text-h4 text-ink">TopBar</h2>
          <TopBar
            title="Career Outcomes Readiness"
            subtitle="Admin → Career Outcomes"
            onExport={() => undefined}
          />
        </section>

        <section aria-labelledby="sec-sidebar" className="space-y-3">
          <h2 id="sec-sidebar" className="text-h4 text-ink">SidebarNavItem</h2>
          <nav className="w-60 space-y-1 bg-surface p-3 rounded-md border border-edge-subtle">
            <SidebarNavItem label="Readiness" active />
            <SidebarNavItem label="Review Queue" disabled disabledHint="Coming soon" />
          </nav>
        </section>

        <section aria-labelledby="sec-filterbar" className="space-y-3">
          <h2 id="sec-filterbar" className="text-h4 text-ink">FilterBar</h2>
          <FilterBar
            filters={filters}
            programs={['Data Analytics', 'Full-Stack Web Dev']}
            terms={['Spring 2025', 'Fall 2024']}
            onChange={setFilters}
          />
        </section>

        <section aria-labelledby="sec-badges" className="space-y-3">
          <h2 id="sec-badges" className="text-h4 text-ink">RiskStatusBadge</h2>
          <div className="flex gap-2">
            <RiskStatusBadge status="on-track" />
            <RiskStatusBadge status="watch" />
            <RiskStatusBadge status="at-risk" />
          </div>
        </section>

        <section aria-labelledby="sec-trend" className="space-y-3">
          <h2 id="sec-trend" className="text-h4 text-ink">TrendIndicator</h2>
          <div className="flex gap-4">
            <TrendIndicator direction="up" deltaPct={3.2} />
            <TrendIndicator direction="down" deltaPct={-1.5} />
            <TrendIndicator direction="flat" />
          </div>
        </section>

        <section aria-labelledby="sec-coverage" className="space-y-3 max-w-md">
          <h2 id="sec-coverage" className="text-h4 text-ink">CoverageMeter</h2>
          <CoverageMeter percent={30} label="Verified earnings" />
          <CoverageMeter percent={62} label="Outcomes" />
          <CoverageMeter percent={88} label="Surveys" />
        </section>
      </section>
    </main>
  )
}
