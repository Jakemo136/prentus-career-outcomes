export type CoverageMeterTone = 'threshold' | 'brand'

export interface CoverageMeterProps {
  /** Percent 0–100. Caller clamps; component also clamps internally. */
  percent: number
  /**
   * Optional label shown above the bar. When provided, it's rendered as
   * text and used as the accessible name; when omitted, the accessible
   * name falls back to `${Math.round(percent)}% coverage`.
   */
  label?: string
  /**
   * Thresholds for color state. Default { low: 50, medium: 75 }.
   * Only used when tone="threshold".
   */
  thresholds?: { low: number; medium: number }
  /**
   * "threshold" (default): fill color derives from percent vs thresholds
   * (red / orange / green). Best for triage — the color IS the signal.
   *
   * "brand": fill is brand primary (purple) regardless of percent. Use
   * for the single hero KPI where brand identity outweighs triage —
   * e.g. Verified Earnings on the summary strip.
   */
  tone?: CoverageMeterTone
}

const thresholdClass = {
  low: 'bg-red-500',
  medium: 'bg-orange-500',
  high: 'bg-green-500',
} as const

export function CoverageMeter({
  percent,
  label,
  thresholds = { low: 50, medium: 75 },
  tone = 'threshold',
}: CoverageMeterProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  const rounded = Math.round(clamped)
  const level: keyof typeof thresholdClass =
    clamped < thresholds.low
      ? 'low'
      : clamped < thresholds.medium
        ? 'medium'
        : 'high'
  const fillClass =
    tone === 'brand' ? 'bg-primary-500' : thresholdClass[level]
  const accessibleName = label ?? `${rounded}% coverage`

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between text-body-xs text-muted mb-1">
          <span>{label}</span>
          <span>{rounded}%</span>
        </div>
      )}
      <div
        className="h-4 w-full bg-edge-subtle rounded-xs overflow-hidden"
        role="progressbar"
        aria-valuenow={rounded}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={accessibleName}
      >
        <div
          className={`h-full rounded-xs ${fillClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
