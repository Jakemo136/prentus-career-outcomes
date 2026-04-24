import { useId } from 'react'
import type { Metric, TrendDirection } from '../../types/readiness'
import { TrendIndicator } from '../ui/TrendIndicator'
import { CoverageMeter } from '../ui/CoverageMeter'

export type KpiVariant = 'hero' | 'default' | 'urgent'

export interface KpiCardProps {
  label: string
  metric: Metric
  /**
   * 'hero': primary purple accent, value rendered as h2 size. Lead KPI.
   * 'urgent': warm orange tint (alert-caution-bg). Flags metrics that
   *   need attention without the confrontational red of a warning state.
   * 'default': standard neutral card.
   */
  variant?: KpiVariant
  /** Muted copy shown below the value (e.g. "needs attention"). */
  caption?: string
  /**
   * When provided, render a CoverageMeter below the metric. Use tone='brand'
   * on the hero variant so the meter matches the card's brand identity.
   */
  coveragePct?: number
}

const VARIANT_CLASS: Record<KpiVariant, string> = {
  hero: 'bg-surface-raised shadow-card border-primary-200',
  urgent: 'bg-alert-caution-bg border-edge-subtle',
  default: 'bg-surface-raised shadow-card border-edge-subtle',
}

const VALUE_SIZE: Record<KpiVariant, string> = {
  hero: 'text-h2',
  urgent: 'text-h3',
  default: 'text-h3',
}

function directionFromDelta(deltaPct: number): TrendDirection {
  if (deltaPct > 0) return 'up'
  if (deltaPct < 0) return 'down'
  return 'flat'
}

function formatValue(metric: Metric): string {
  // Empty-filter state: computeKpisForCohorts returns NaN for coverage
  // metrics when the filtered cohort list is empty. Render an em-dash
  // instead of "NaN%" so the strip communicates "no data" honestly.
  if (Number.isNaN(metric.value)) return '—'
  if (metric.unit === '%') return `${Math.round(metric.value)}%`
  return Math.trunc(metric.value).toLocaleString()
}

export function KpiCard({
  label,
  metric,
  variant = 'default',
  caption,
  coveragePct,
}: KpiCardProps) {
  const labelId = useId()
  const direction = directionFromDelta(metric.deltaPct)

  return (
    <article
      aria-labelledby={labelId}
      className={`rounded-md border p-6 flex flex-col gap-2 ${VARIANT_CLASS[variant]}`}
    >
      <span
        id={labelId}
        className="text-body-xs text-muted uppercase tracking-wide"
      >
        {label}
      </span>
      <p className={`${VALUE_SIZE[variant]} text-ink font-semibold`}>
        {formatValue(metric)}
      </p>
      <div className="flex items-center gap-2">
        <TrendIndicator
          direction={direction}
          deltaPct={metric.deltaPct}
          polarity={metric.polarity}
        />
      </div>
      {caption && <p className="text-body-xs text-muted">{caption}</p>}
      {coveragePct !== undefined && (
        <CoverageMeter
          percent={coveragePct}
          tone={variant === 'hero' ? 'brand' : 'threshold'}
        />
      )}
    </article>
  )
}
