/**
 * Domain types for Cohort Readiness.
 *
 * These are the shapes the mock layer produces and the components
 * consume. When a real backend lands, the GraphQL codegen output
 * should satisfy these (via structural subtyping) with minimal
 * component churn.
 */

export type RiskStatus = 'on-track' | 'watch' | 'at-risk'

export type TrustLevel = 'high' | 'medium' | 'low'

export type SourceId =
  | 'verified-earnings'
  | 'surveys'
  | 'linkedin'
  | 'self-report'

export type TrendDirection = 'up' | 'down' | 'flat'

/**
 * A single headline metric. `deltaPct` is signed — negative means
 * the metric has worsened for "coverage"-style metrics, or improved
 * for "stale/missing"-style metrics. Callers decide whether negative
 * is good or bad based on the metric's semantics.
 */
export interface Metric {
  value: number
  /** Signed percentage-point change vs prior period. */
  deltaPct: number
  /** Whether rising is good (coverage) or bad (stale/missing). */
  polarity: 'higher-is-better' | 'lower-is-better'
  unit: '%' | 'count'
}

export type IssueSeverity = 'warning' | 'caution'

export interface SourceHealth {
  id: SourceId
  name: string
  coveragePct: number
  /** ISO date string. */
  lastRefreshedAt: string
  trust: TrustLevel
  hasIssue: boolean
  issueNote?: string
  /**
   * Severity drives the alert banner tone on SourceCard.
   * 'warning' (red): coverage/quality issues — data is actively wrong or absent.
   * 'caution' (orange, default): staleness / freshness — data exists but is aging.
   * Optional; defaults to 'caution' when absent and hasIssue is true.
   */
  issueSeverity?: IssueSeverity
}

export interface Cohort {
  id: string
  program: string
  term: string
  graduates: number
  verifiedEarningsCoveragePct: number
  outcomesCoveragePct: number
  staleMissingPct: number
  placementRatePct: number
  trend: TrendDirection
  risk: RiskStatus
  // Drill-in extras
  sourceMix: Record<SourceId, number>
  suggestedAction: string
  lastVerifiedAt: string
}

export interface InstitutionSnapshot {
  kpis: {
    verifiedEarningsCoverage: Metric
    outcomesCoverage: Metric
    staleMissingPct: Metric
    programsAtRisk: Metric
    placementRate: Metric
  }
  sources: SourceHealth[]
  cohorts: Cohort[]
}

/**
 * URL-driven filter state. All fields are "all"-able; `null`/absent
 * means "no filter on this field".
 */
export interface DashboardFilters {
  program: string | null
  term: string | null
  source: SourceId | null
  verification: 'verified' | 'unverified' | 'partial' | null
}
