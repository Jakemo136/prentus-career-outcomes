import type { TrendDirection } from '../../types/readiness'

export interface TrendIndicatorProps {
  direction: TrendDirection
  /** Signed percentage-point change. Optional — when omitted, only the arrow renders. */
  deltaPct?: number
  /**
   * Whether "up" is good or bad. Coverage metrics are higher-is-better
   * (default); stale/missing metrics are lower-is-better.
   */
  polarity?: 'higher-is-better' | 'lower-is-better'
}

const ARROW: Record<TrendDirection, string> = {
  up: '↑',
  down: '↓',
  flat: '→',
}

const COLOR: Record<
  'higher-is-better' | 'lower-is-better',
  Record<TrendDirection, string>
> = {
  'higher-is-better': {
    up: 'text-green-700',
    down: 'text-red-600',
    flat: 'text-muted',
  },
  'lower-is-better': {
    up: 'text-red-600',
    down: 'text-green-700',
    flat: 'text-muted',
  },
}

function formatDelta(direction: TrendDirection, deltaPct: number): string {
  if (direction === 'flat') return '0%'
  const abs = Math.abs(deltaPct).toFixed(1)
  const sign = direction === 'up' ? '+' : '-'
  return `${sign}${abs}%`
}

function buildLabel(direction: TrendDirection, deltaPct?: number): string {
  if (direction === 'flat') return 'Flat'
  const base = direction === 'up' ? 'Trending up' : 'Trending down'
  if (deltaPct === undefined) return base
  return `${base}, ${formatDelta(direction, deltaPct)}`
}

export function TrendIndicator({
  direction,
  deltaPct,
  polarity = 'higher-is-better',
}: TrendIndicatorProps) {
  const colorClass =
    direction === 'flat' ? 'text-muted' : COLOR[polarity][direction]
  const label = buildLabel(direction, deltaPct)
  const showNumeric = deltaPct !== undefined || direction === 'flat'
  const numericText =
    deltaPct !== undefined
      ? formatDelta(direction, deltaPct)
      : direction === 'flat'
        ? '0%'
        : ''

  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex items-center gap-1 text-body-xs font-medium ${colorClass}`}
    >
      <span aria-hidden="true">{ARROW[direction]}</span>
      {showNumeric && numericText ? <span>{numericText}</span> : null}
    </span>
  )
}
