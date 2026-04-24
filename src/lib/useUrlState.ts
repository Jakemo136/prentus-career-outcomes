import { useCallback, useSyncExternalStore } from 'react'

/**
 * Minimal URLSearchParams-backed state hook. No router dependency —
 * the prototype is a single route, only the query string round-trips.
 *
 * Usage:
 *   const [params, setParams] = useUrlState()
 *   params.get('cohort')            // read
 *   const next = new URLSearchParams(params)
 *   next.set('cohort', 'cyb-sp25')
 *   setParams(next)                 // write (pushState + notify)
 *
 * Passing an empty URLSearchParams clears the query entirely, so the
 * URL drops back to the bare pathname — avoids "/?". Back/forward
 * browser buttons emit `popstate`, which this hook subscribes to so
 * bookmarked / shared URLs restore cleanly.
 */
export function useUrlState(): [
  URLSearchParams,
  (next: URLSearchParams) => void,
] {
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  const setParams = useCallback((next: URLSearchParams) => {
    const nextSearch = next.toString()
    const url = nextSearch
      ? `${window.location.pathname}?${nextSearch}`
      : window.location.pathname
    window.history.pushState({}, '', url)
    notify()
  }, [])

  return [new URLSearchParams(search), setParams]
}

const listeners = new Set<() => void>()

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  window.addEventListener('popstate', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('popstate', cb)
  }
}

function notify(): void {
  for (const cb of listeners) cb()
}

function getSnapshot(): string {
  return window.location.search
}

function getServerSnapshot(): string {
  return ''
}
