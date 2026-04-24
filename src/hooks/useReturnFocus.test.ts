import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useReturnFocus } from './useReturnFocus'

describe('useReturnFocus', () => {
  it('focuses the remembered element when current transitions to null', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)
    const focusSpy = vi.spyOn(el, 'focus')

    const { result, rerender } = renderHook(
      ({ current }: { current: string | null }) =>
        useReturnFocus(current, () => el),
      { initialProps: { current: 'row-1' as string | null } },
    )

    // Before transition: remember the trigger.
    act(() => {
      result.current('row-1')
    })
    expect(focusSpy).not.toHaveBeenCalled()

    // Transition to null — effect should focus the remembered element.
    rerender({ current: null })
    expect(focusSpy).toHaveBeenCalledTimes(1)
    document.body.removeChild(el)
  })

  it('does nothing if nothing was remembered', () => {
    const el = document.createElement('button')
    const focusSpy = vi.spyOn(el, 'focus')

    const { rerender } = renderHook(
      ({ current }: { current: string | null }) =>
        useReturnFocus(current, () => el),
      { initialProps: { current: 'a' as string | null } },
    )
    rerender({ current: null })
    expect(focusSpy).not.toHaveBeenCalled()
  })

  it('clears the remembered value after restoring focus', () => {
    const el = document.createElement('button')
    const focusSpy = vi.spyOn(el, 'focus')

    const { result, rerender } = renderHook(
      ({ current }: { current: string | null }) =>
        useReturnFocus(current, () => el),
      { initialProps: { current: 'a' as string | null } },
    )
    act(() => {
      result.current('a')
    })
    rerender({ current: null })
    expect(focusSpy).toHaveBeenCalledTimes(1)

    // Second open-close cycle without remembering — should not re-focus.
    rerender({ current: 'b' })
    rerender({ current: null })
    expect(focusSpy).toHaveBeenCalledTimes(1)
  })
})
