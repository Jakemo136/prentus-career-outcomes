import { useState, type KeyboardEvent, type ReactNode } from 'react'
import type { Cohort, RiskStatus } from '../../types/readiness'
import { CoverageMeter } from '../ui/CoverageMeter'
import { RiskStatusBadge } from '../ui/RiskStatusBadge'
import { TrendIndicator } from '../ui/TrendIndicator'
import { Icon } from '../ui/Icon'

export type SortDirection = 'asc' | 'desc'

export type CohortSortKey =
  | 'program'
  | 'graduates'
  | 'verifiedEarningsCoveragePct'
  | 'outcomesCoveragePct'
  | 'staleMissingPct'
  | 'placementRatePct'
  | 'risk'

export interface CohortRiskTableProps {
  cohorts: Cohort[]
  /** Called when the user clicks (or Enter-presses) a row. */
  onRowClick?: (cohortId: string) => void
  /** Highlighted row — usually the drill-in target. */
  selectedCohortId?: string | null
  /**
   * Called when the user clicks "Clear filters" in the empty state.
   * When omitted, the empty-state message renders without a clear
   * affordance.
   */
  onClearFilters?: () => void
}

const RISK_ORDER: Record<RiskStatus, number> = {
  'on-track': 0,
  watch: 1,
  'at-risk': 2,
}

const DEFAULT_DIRECTIONS: Record<CohortSortKey, SortDirection> = {
  program: 'asc',
  graduates: 'desc',
  verifiedEarningsCoveragePct: 'desc',
  outcomesCoveragePct: 'desc',
  staleMissingPct: 'desc',
  placementRatePct: 'desc',
  risk: 'desc',
}

function compareCohorts(
  a: Cohort,
  b: Cohort,
  key: CohortSortKey,
  direction: SortDirection,
): number {
  let diff: number
  if (key === 'program') {
    diff = a.program.localeCompare(b.program)
  } else if (key === 'risk') {
    diff = RISK_ORDER[a.risk] - RISK_ORDER[b.risk]
  } else {
    diff = (a[key] as number) - (b[key] as number)
  }
  return direction === 'asc' ? diff : -diff
}

const selectedRowClass: Record<'yes' | 'no', string> = {
  yes: 'bg-surface-muted',
  no: '',
}

export function CohortRiskTable({
  cohorts,
  onRowClick,
  onClearFilters,
  selectedCohortId,
}: CohortRiskTableProps) {
  const [sortKey, setSortKey] = useState<CohortSortKey>('risk')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const sorted = [...cohorts].sort((a, b) =>
    compareCohorts(a, b, sortKey, sortDirection),
  )

  function handleHeaderClick(key: CohortSortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection(DEFAULT_DIRECTIONS[key])
    }
  }

  function handleRowKeyDown(
    e: KeyboardEvent<HTMLTableRowElement>,
    id: string,
  ) {
    if (!onRowClick) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onRowClick(id)
    }
  }

  function sortHeader(key: CohortSortKey, label: string): ReactNode {
    const isActive = sortKey === key
    const ariaSort: 'ascending' | 'descending' | 'none' = isActive
      ? sortDirection === 'asc'
        ? 'ascending'
        : 'descending'
      : 'none'
    return (
      <th
        scope="col"
        aria-sort={ariaSort}
        className="py-2 px-3 text-left text-body-xs text-muted uppercase tracking-wide font-medium"
      >
        <button
          type="button"
          onClick={() => handleHeaderClick(key)}
          className="inline-flex items-center gap-1 uppercase tracking-wide text-body-xs text-muted"
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <Icon name="chevron-up" size={12} />
            ) : (
              <Icon name="chevron-down" size={12} />
            )
          ) : (
            <Icon
              name="arrow-up-arrow-down"
              size={12}
              className="text-muted"
            />
          )}
        </button>
      </th>
    )
  }

  const isEmpty = sorted.length === 0
  const colCount = 8

  return (
    <table className="w-full text-body-s">
      <thead>
        <tr>
          {sortHeader('program', 'Program')}
          {sortHeader('graduates', 'Graduates')}
          {sortHeader('verifiedEarningsCoveragePct', 'Verified earnings')}
          {sortHeader('outcomesCoveragePct', 'Outcomes')}
          {sortHeader('staleMissingPct', 'Stale / Missing')}
          {sortHeader('placementRatePct', 'Placement')}
          <th
            scope="col"
            className="py-2 px-3 text-left text-body-xs text-muted uppercase tracking-wide font-medium"
          >
            Trend
          </th>
          {sortHeader('risk', 'Risk')}
        </tr>
      </thead>
      <tbody>
        {isEmpty ? (
          <tr>
            <td
              colSpan={colCount}
              className="py-6 px-3 text-center text-muted"
            >
              No cohorts match these filters.
              {onClearFilters && (
                <>
                  {' '}
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-primary-600 hover:text-primary-700 underline underline-offset-2"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </td>
          </tr>
        ) : (
          sorted.map((cohort) => {
            const isSelected = cohort.id === selectedCohortId
            const selectedClass =
              selectedRowClass[isSelected ? 'yes' : 'no']
            return (
              <tr
                key={cohort.id}
                tabIndex={0}
                aria-selected={isSelected}
                data-cohort-id={cohort.id}
                onClick={() => onRowClick?.(cohort.id)}
                onKeyDown={(e) => handleRowKeyDown(e, cohort.id)}
                className={`border-t border-edge-subtle cursor-pointer hover:bg-surface-muted focus:outline-none focus-visible:bg-surface-muted ${selectedClass}`}
              >
                <td className="py-3 px-3 align-middle">
                  <div className="flex flex-col gap-1">
                    <span className="text-ink">{cohort.program}</span>
                    <span className="inline-flex self-start text-body-xs text-muted bg-surface-muted rounded-xs px-2 py-0.5">
                      {cohort.term}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 align-middle text-ink">
                  {cohort.graduates.toLocaleString()}
                </td>
                <td className="py-3 px-3 align-middle">
                  <CoverageMeter
                    percent={cohort.verifiedEarningsCoveragePct}
                  />
                </td>
                <td className="py-3 px-3 align-middle text-ink">
                  {cohort.outcomesCoveragePct}%
                </td>
                <td className="py-3 px-3 align-middle text-body">
                  {cohort.staleMissingPct}%
                </td>
                <td className="py-3 px-3 align-middle text-muted">
                  {cohort.placementRatePct}%
                </td>
                <td className="py-3 px-3 align-middle">
                  <TrendIndicator direction={cohort.trend} />
                </td>
                <td className="py-3 px-3 align-middle">
                  <RiskStatusBadge status={cohort.risk} fullWidth />
                </td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
}
