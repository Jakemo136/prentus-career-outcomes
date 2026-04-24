import type { DashboardFilters, SourceId } from '../types/readiness'

const VERIFICATION_VALUES = new Set(['verified', 'unverified', 'partial'])
const SOURCE_VALUES = new Set<SourceId>([
  'verified-earnings',
  'surveys',
  'linkedin',
  'self-report',
])

const FILTER_KEYS: (keyof DashboardFilters)[] = [
  'program',
  'term',
  'source',
  'verification',
]

export function parseFilters(params: URLSearchParams): DashboardFilters {
  const source = params.get('source')
  const verification = params.get('verification')
  return {
    program: params.get('program') || null,
    term: params.get('term') || null,
    source:
      source && SOURCE_VALUES.has(source as SourceId)
        ? (source as SourceId)
        : null,
    verification:
      verification && VERIFICATION_VALUES.has(verification)
        ? (verification as DashboardFilters['verification'])
        : null,
  }
}

export function writeFilters(
  params: URLSearchParams,
  filters: DashboardFilters,
): URLSearchParams {
  const next = new URLSearchParams(params)
  for (const key of FILTER_KEYS) {
    const value = filters[key]
    if (value) next.set(key, value)
    else next.delete(key)
  }
  return next
}
