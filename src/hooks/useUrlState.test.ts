import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useUrlState } from './useUrlState'

describe('useUrlState', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('returns an empty URLSearchParams when the URL has no query', () => {
    const { result } = renderHook(() => useUrlState())
    expect(result.current[0].toString()).toBe('')
  })

  it('exposes existing query params on first read', () => {
    window.history.replaceState({}, '', '/?cohort=cyb-sp25&program=Data%20Analytics')
    const { result } = renderHook(() => useUrlState())
    const [params] = result.current
    expect(params.get('cohort')).toBe('cyb-sp25')
    expect(params.get('program')).toBe('Data Analytics')
  })

  it('updates the URL and re-renders when setParams is called', () => {
    const { result } = renderHook(() => useUrlState())
    act(() => {
      const next = new URLSearchParams()
      next.set('cohort', 'fs-sp25')
      result.current[1](next)
    })
    expect(window.location.search).toBe('?cohort=fs-sp25')
    expect(result.current[0].get('cohort')).toBe('fs-sp25')
  })

  it('clears the query entirely when passed empty URLSearchParams', () => {
    window.history.replaceState({}, '', '/?cohort=x')
    const { result } = renderHook(() => useUrlState())
    act(() => {
      result.current[1](new URLSearchParams())
    })
    expect(window.location.search).toBe('')
    expect(window.location.pathname).toBe('/')
  })

  it('re-renders when popstate fires (browser back/forward simulation)', () => {
    window.history.replaceState({}, '', '/?cohort=b')
    const { result } = renderHook(() => useUrlState())
    expect(result.current[0].get('cohort')).toBe('b')

    // Simulate the browser rewinding history + firing popstate. jsdom's
    // history.back() doesn't synchronously update location.search, so
    // we replaceState directly and dispatch the event the hook listens for.
    act(() => {
      window.history.replaceState({}, '', '/?cohort=a')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(result.current[0].get('cohort')).toBe('a')
  })
})
