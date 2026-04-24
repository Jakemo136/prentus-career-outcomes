import { useId } from 'react'
import type { InstitutionSnapshot } from '../types/readiness'
import { KpiCard } from './KpiCard'

type InstitutionKpis = InstitutionSnapshot['kpis']

export interface ReadinessSummaryStripProps {
  kpis: InstitutionKpis
}

export function ReadinessSummaryStrip({ kpis }: ReadinessSummaryStripProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-h4 text-ink">
        Readiness summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Verified earnings coverage"
          metric={kpis.verifiedEarningsCoverage}
          variant="hero"
          coveragePct={kpis.verifiedEarningsCoverage.value}
        />
        <KpiCard
          label="Outcomes coverage"
          metric={kpis.outcomesCoverage}
          variant="default"
          coveragePct={kpis.outcomesCoverage.value}
        />
        <KpiCard
          label="Stale / missing"
          metric={kpis.staleMissingPct}
          variant="urgent"
          caption="Needs attention"
        />
        <KpiCard
          label="Programs at risk"
          metric={kpis.programsAtRisk}
          variant="urgent"
          caption="Needs attention"
        />
        <KpiCard
          label="Placement rate"
          metric={kpis.placementRate}
          variant="default"
        />
      </div>
    </section>
  )
}
