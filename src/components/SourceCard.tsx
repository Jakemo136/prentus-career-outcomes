import { useId } from 'react'
import type { SourceHealth } from '../types/readiness'
import { CoverageMeter } from './CoverageMeter'
import { Icon } from './Icon'

export interface SourceCardProps {
  source: SourceHealth
  /**
   * When true, card uses brand (purple) treatment: primary-500 border
   * and tone='brand' on the CoverageMeter. Reserved for Verified
   * Earnings (the highest-trust / lead source).
   */
  isHero?: boolean
}

const trustPillClass = {
  high: 'bg-alert-success-bg text-ink',
  medium: 'bg-alert-warning-bg text-ink',
  low: 'bg-grey-100 text-body',
} as const

const trustLabel = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
} as const

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function SourceCard({ source, isHero = false }: SourceCardProps) {
  const nameId = useId()
  const borderClass = isHero
    ? 'border-primary-500 shadow-card'
    : 'border-edge-subtle'
  const issueNote =
    source.hasIssue && (source.issueNote ?? 'Needs attention')

  return (
    <article
      aria-labelledby={nameId}
      className={`rounded-md bg-surface-raised p-4 flex flex-col gap-3 border ${borderClass}`}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 id={nameId} className="text-body-m text-ink font-medium">
          {source.name}
        </h3>
        <span
          className={`inline-flex items-center rounded-xs px-2 py-0.5 text-body-xs font-medium ${trustPillClass[source.trust]}`}
        >
          {trustLabel[source.trust]} trust
        </span>
      </div>
      <CoverageMeter
        percent={source.coveragePct}
        tone={isHero ? 'brand' : 'threshold'}
      />
      <span className="text-body-xs text-muted">
        Updated {formatDate(source.lastRefreshedAt)}
      </span>
      {source.hasIssue && (
        <div className="flex items-center gap-1">
          <Icon name="cancel-circle" size={14} className="text-red-500" />
          <span className="text-body-xs text-red-700">{issueNote}</span>
        </div>
      )}
    </article>
  )
}
