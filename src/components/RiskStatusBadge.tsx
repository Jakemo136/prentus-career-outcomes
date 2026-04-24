import type { RiskStatus } from '../types/readiness'

export interface RiskStatusBadgeProps {
  status: RiskStatus
  /**
   * When true, the pill fills its container width with centered content.
   * Use in table cells where each column should render a consistent-width
   * affordance. Default false keeps the inline pill shape for use next
   * to text (e.g. in the drill-in summary row).
   */
  fullWidth?: boolean
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

const BASE =
  'items-center rounded-xs px-2.5 py-0.5 text-body-xs font-medium'

export function RiskStatusBadge({
  status,
  fullWidth = false,
}: RiskStatusBadgeProps) {
  const layoutClass = fullWidth
    ? 'flex w-full justify-center'
    : 'inline-flex'
  // Deliberately NO role="status": that's an ARIA live region, and a
  // table with N rows would announce N live regions on every sort/filter
  // — noisy and misleading. The visible text is the accessible name.
  return (
    <span className={`${layoutClass} ${BASE} ${toneClass[status]}`}>
      {labelMap[status]}
    </span>
  )
}
