import type { Cohort } from '../types/readiness'

/**
 * CSV export of the current (post-filter) cohort list. Pure function —
 * returns the CSV string. Triggering a download is the caller's job
 * (uses URL.createObjectURL + a temporary <a> click).
 */
export function cohortsToCsv(cohorts: Cohort[]): string {
  const headers = [
    'Program',
    'Term',
    'Graduates',
    'Verified earnings %',
    'Outcomes %',
    'Stale / missing %',
    'Placement %',
    'Trend',
    'Risk',
    'Last verified',
  ]
  const rows = cohorts.map((c) => [
    c.program,
    c.term,
    c.graduates,
    c.verifiedEarningsCoveragePct,
    c.outcomesCoveragePct,
    c.staleMissingPct,
    c.placementRatePct,
    c.trend,
    c.risk,
    c.lastVerifiedAt,
  ])
  return [headers, ...rows].map(encodeRow).join('\n')
}

function encodeRow(row: ReadonlyArray<string | number>): string {
  return row.map(encodeCell).join(',')
}

function encodeCell(value: string | number): string {
  const s = String(value)
  // RFC-4180 quoting: wrap in quotes if the value contains a comma, quote,
  // or newline; double any embedded quotes.
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

/**
 * Trigger a browser download of the given CSV text. Side-effect only.
 */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
