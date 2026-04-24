import type { DashboardFilters, SourceId } from '../types/readiness'

export interface FilterBarProps {
  filters: DashboardFilters
  programs: string[]
  terms: string[]
  onChange: (next: DashboardFilters) => void
}

const SOURCE_OPTIONS: ReadonlyArray<{ value: SourceId; label: string }> = [
  { value: 'verified-earnings', label: 'Verified Earnings' },
  { value: 'surveys', label: 'Surveys' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'self-report', label: 'Self-report' },
]

const VERIFICATION_OPTIONS: ReadonlyArray<{
  value: NonNullable<DashboardFilters['verification']>
  label: string
}> = [
  { value: 'verified', label: 'Verified' },
  { value: 'unverified', label: 'Unverified' },
  { value: 'partial', label: 'Partial' },
]

const selectClass =
  'rounded-md border border-edge bg-surface-raised text-body-s text-ink px-3 py-2'
const labelClass = 'flex flex-col gap-1'
const labelTextClass = 'text-body-xs text-muted'

export function FilterBar({
  filters,
  programs,
  terms,
  onChange,
}: FilterBarProps) {
  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value
    onChange({ ...filters, program: v === '' ? null : v })
  }

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value
    onChange({ ...filters, term: v === '' ? null : v })
  }

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value
    onChange({ ...filters, source: v === '' ? null : (v as SourceId) })
  }

  const handleVerificationChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const v = e.target.value
    onChange({
      ...filters,
      verification:
        v === ''
          ? null
          : (v as NonNullable<DashboardFilters['verification']>),
    })
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className={labelClass}>
        <span className={labelTextClass}>Program</span>
        <select
          className={selectClass}
          value={filters.program ?? ''}
          onChange={handleProgramChange}
        >
          <option value="">All</option>
          {programs.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>Graduation term</span>
        <select
          className={selectClass}
          value={filters.term ?? ''}
          onChange={handleTermChange}
        >
          <option value="">All</option>
          {terms.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>Source type</span>
        <select
          className={selectClass}
          value={filters.source ?? ''}
          onChange={handleSourceChange}
        >
          <option value="">All</option>
          {SOURCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>Verification status</span>
        <select
          className={selectClass}
          value={filters.verification ?? ''}
          onChange={handleVerificationChange}
        >
          <option value="">All</option>
          {VERIFICATION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
