import { useEffect, useRef } from 'react'

/**
 * Restores focus to a noted element when `current` transitions to
 * null / undefined. Intended for overlay-close → return-focus-to-trigger
 * flows (drill-in panels, modals, menus).
 *
 * Usage:
 *   const rememberTrigger = useReturnFocus(cohortId, (id) =>
 *     document.querySelector(`tr[data-cohort-id="${id}"]`)
 *   )
 *
 *   const onRowClick = (id) => {
 *     rememberTrigger(id)  // stash it before the overlay opens
 *     openOverlay(id)
 *   }
 *
 * The effect re-runs whenever `current` changes — when it drops to a
 * falsy value and we have a stashed id, we run `findElement(id)?.focus()`
 * and clear the stash.
 */
export function useReturnFocus<T>(
  current: T | null | undefined,
  findElement: (value: T) => HTMLElement | null,
): (value: T) => void {
  const remembered = useRef<T | null>(null)

  useEffect(() => {
    if (!current && remembered.current !== null) {
      findElement(remembered.current)?.focus()
      remembered.current = null
    }
  }, [current, findElement])

  return (value: T) => {
    remembered.current = value
  }
}
