import { describe, expect, it } from 'vitest'
import { MOCK_COHORTS } from '../mocks/readiness'
import type { DashboardFilters } from '../types/readiness'
import { applyFilters, EMPTY_FILTERS } from './filters'

describe('applyFilters', () => {
  it('returns all cohorts when no filters are applied', () => {
    expect(applyFilters(MOCK_COHORTS, EMPTY_FILTERS)).toHaveLength(
      MOCK_COHORTS.length,
    )
  })

  it('filters by program', () => {
    const filters: DashboardFilters = {
      ...EMPTY_FILTERS,
      program: 'Cybersecurity',
    }
    const result = applyFilters(MOCK_COHORTS, filters)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((c) => c.program === 'Cybersecurity')).toBe(true)
  })

  it('filters by term', () => {
    const filters: DashboardFilters = {
      ...EMPTY_FILTERS,
      term: 'Fall 2024',
    }
    const result = applyFilters(MOCK_COHORTS, filters)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((c) => c.term === 'Fall 2024')).toBe(true)
  })

  it('composes multiple filters with AND semantics', () => {
    const filters: DashboardFilters = {
      ...EMPTY_FILTERS,
      program: 'Full-Stack Web Development',
      term: 'Spring 2025',
    }
    const result = applyFilters(MOCK_COHORTS, filters)
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('fs-sp25')
  })

  it('returns an empty array when filters match nothing', () => {
    const filters: DashboardFilters = {
      ...EMPTY_FILTERS,
      program: 'Underwater Basket Weaving',
    }
    expect(applyFilters(MOCK_COHORTS, filters)).toEqual([])
  })

  it('treats verification=verified as "verified coverage ≥ 70%"', () => {
    const filters: DashboardFilters = {
      ...EMPTY_FILTERS,
      verification: 'verified',
    }
    const result = applyFilters(MOCK_COHORTS, filters)
    expect(result.every((c) => c.verifiedEarningsCoveragePct >= 70)).toBe(true)
  })

  it('treats verification=unverified as "verified coverage < 50%"', () => {
    const filters: DashboardFilters = {
      ...EMPTY_FILTERS,
      verification: 'unverified',
    }
    const result = applyFilters(MOCK_COHORTS, filters)
    expect(result.every((c) => c.verifiedEarningsCoveragePct < 50)).toBe(true)
  })
})
