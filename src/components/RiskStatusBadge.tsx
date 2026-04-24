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
  'on-track': 'bg-green-100 text-green-700',
  watch: 'bg-orange-100 text-orange-700',
  'at-risk': 'bg-red-100 text-red-700',
}

export function RiskStatusBadge({ status }: RiskStatusBadgeProps) {
  return (
    <span
      role="status"
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-body-xs font-medium ${toneClass[status]}`}
    >
      {labelMap[status]}
    </span>
  )
}
