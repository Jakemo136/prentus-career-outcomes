import type { RiskStatus } from '../types/readiness'

export interface RiskStatusBadgeProps {
  status: RiskStatus
}

const labelMap: Record<RiskStatus, string> = {
  'on-track': 'On track',
  watch: 'Watch',
  'at-risk': 'At risk',
}

const toneClass: Record<RiskStatus, string> = {
  'on-track': 'bg-alert-success-bg text-ink',
  watch: 'bg-alert-caution-bg text-ink',
  'at-risk': 'bg-alert-warning-bg text-ink',
}

export function RiskStatusBadge({ status }: RiskStatusBadgeProps) {
  return (
    <span
      role="status"
      className={`inline-flex items-center rounded-xs px-2.5 py-0.5 text-body-xs font-medium ${toneClass[status]}`}
    >
      {labelMap[status]}
    </span>
  )
}
