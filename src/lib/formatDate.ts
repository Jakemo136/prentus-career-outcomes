/**
 * Formats an ISO date string as "Apr 18"-style short display copy used
 * on cards and in the drill-in panel. Caller owns I18N — this is
 * en-US only per the prototype's scope.
 */
export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
