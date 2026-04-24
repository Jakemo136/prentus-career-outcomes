import { describe, expect, it } from 'vitest'
import { formatShortDate } from './formatDate'

describe('formatShortDate', () => {
  // Using midday ISO (T12:00:00Z) so the assertion is timezone-stable —
  // a bare YYYY-MM-DD parses as UTC midnight which flips to the prior
  // day in any west-of-UTC runner.
  it('returns the month-short + day form', () => {
    expect(formatShortDate('2026-04-18T12:00:00Z')).toBe('Apr 18')
  })

  it('works for single-digit days without zero-padding', () => {
    expect(formatShortDate('2026-03-08T12:00:00Z')).toBe('Mar 8')
  })
})
