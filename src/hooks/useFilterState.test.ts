import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFilterState } from './useFilterState'

describe('useFilterState', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('reads filters from the current URL', () => {
    window.history.replaceState(
      {},
      '',
      '/?program=Cybersecurity&source=surveys',
    )
    const { result } = renderHook(() => useFilterState())
    expect(result.current.filters.program).toBe('Cybersecurity')
    expect(result.current.filters.source).toBe('surveys')
  })

  it('setFilters writes to the URL', () => {
    const { result } = renderHook(() => useFilterState())
    act(() => {
      result.current.setFilters({
        program: 'Data Analytics',
        term: null,
        source: null,
        verification: null,
      })
    })
    expect(window.location.search).toContain('program=Data+Analytics')
  })

  it('openCohort writes ?cohort= without disturbing other filters', () => {
    window.history.replaceState({}, '', '/?program=Cybersecurity')
    const { result } = renderHook(() => useFilterState())
    act(() => {
      result.current.openCohort('cyb-sp25')
    })
    expect(window.location.search).toContain('program=Cybersecurity')
    expect(window.location.search).toContain('cohort=cyb-sp25')
  })

  it('closeCohort removes ?cohort= but preserves other filters', () => {
    window.history.replaceState(
      {},
      '',
      '/?program=Cybersecurity&cohort=cyb-sp25',
    )
    const { result } = renderHook(() => useFilterState())
    act(() => {
      result.current.closeCohort()
    })
    expect(window.location.search).toContain('program=Cybersecurity')
    expect(window.location.search).not.toContain('cohort=')
  })

  it('cohortId reflects the URL', () => {
    window.history.replaceState({}, '', '/?cohort=fs-sp25')
    const { result } = renderHook(() => useFilterState())
    expect(result.current.cohortId).toBe('fs-sp25')
  })
})
