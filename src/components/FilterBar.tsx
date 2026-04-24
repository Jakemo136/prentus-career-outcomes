import { useId, type ReactNode } from 'react'
import type { DashboardFilters, SourceId } from '../types/readiness'
import { Icon } from './Icon'

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
  'appearance-none rounded-md border border-edge bg-surface-raised text-body-s text-ink pl-3 pr-9 py-2 w-full'
const labelClass = 'flex flex-col gap-1'
const labelTextClass = 'text-body-xs text-body font-medium'

interface SelectFieldProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: ReactNode
}

function SelectField({ label, value, onChange, children }: SelectFieldProps) {
  const id = useId()
  return (
    <div className={labelClass}>
      <label htmlFor={id} className={labelTextClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={selectClass}
          value={value}
          onChange={onChange}
        >
          {children}
        </select>
        <Icon
          name="chevron-down"
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
    </div>
  )
}

export function FilterBar({
  filters,
  programs,
  terms,
  onChange,
}: FilterBarProps) {
  function setFilter<K extends keyof DashboardFilters>(
    key: K,
    rawValue: string,
  ) {
    const value = (rawValue === '' ? null : rawValue) as DashboardFilters[K]
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <SelectField
        label="Program"
        value={filters.program ?? ''}
        onChange={(e) => setFilter('program', e.target.value)}
      >
        <option value="">All</option>
        {programs.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Graduation term"
        value={filters.term ?? ''}
        onChange={(e) => setFilter('term', e.target.value)}
      >
        <option value="">All</option>
        {terms.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Source type"
        value={filters.source ?? ''}
        onChange={(e) => setFilter('source', e.target.value)}
      >
        <option value="">All</option>
        {SOURCE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Verification status"
        value={filters.verification ?? ''}
        onChange={(e) => setFilter('verification', e.target.value)}
      >
        <option value="">All</option>
        {VERIFICATION_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </SelectField>
    </div>
  )
}
