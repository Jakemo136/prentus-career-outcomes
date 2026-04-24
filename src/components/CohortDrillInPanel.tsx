/**
 * CohortDrillInPanel
 *
 * A controlled right-side drawer for cohort details.
 *
 * Deferrals / out-of-scope:
 * - Exhaustive focus trap: the prototype only lands focus on the close
 *   button on open. A real focus trap can come later via a library
 *   (e.g. focus-trap-react).
 * - Return focus on close: the parent owns the trigger row and is
 *   responsible for returning focus when the panel closes.
 */
import { useEffect, useId, useRef } from 'react'
import type { Cohort, SourceId } from '../types/readiness'
import { RiskStatusBadge } from './RiskStatusBadge'
import { CoverageMeter } from './CoverageMeter'
import { Icon } from './Icon'

export interface CohortDrillInPanelProps {
  /** Controlled: when null, panel renders nothing. */
  cohort: Cohort | null
  /** Called when the user dismisses: close button, Escape, or backdrop click. */
  onClose: () => void
}

const sourceLabels: Record<SourceId, string> = {
  'verified-earnings': 'Verified earnings',
  surveys: 'Surveys',
  linkedin: 'LinkedIn scans',
  'self-report': 'Self-report',
}

const SOURCE_ORDER: SourceId[] = [
  'verified-earnings',
  'surveys',
  'linkedin',
  'self-report',
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function CohortDrillInPanel({
  cohort,
  onClose,
}: CohortDrillInPanelProps) {
  const headingId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const isOpen = cohort !== null

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus()
  }, [isOpen])

  if (!cohort) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-ink/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="fixed top-0 right-0 h-screen w-[480px] bg-surface-raised shadow-lg z-50 flex flex-col"
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-edge-subtle">
          <div>
            <h2 id={headingId} className="text-h4 text-ink">
              {cohort.program}
            </h2>
            <p className="text-body-xs text-muted mt-1">{cohort.term}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close drill-in"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-surface-muted"
          >
            <Icon name="cancel" size={16} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
          <section className="flex items-center justify-between">
            <span className="text-body-m text-ink">
              {cohort.graduates} graduates
            </span>
            <RiskStatusBadge status={cohort.risk} />
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-h5 text-ink">Source coverage</h3>
            {SOURCE_ORDER.map((id) => (
              <CoverageMeter
                key={id}
                label={sourceLabels[id]}
                percent={cohort.sourceMix[id]}
                tone={id === 'verified-earnings' ? 'brand' : 'threshold'}
              />
            ))}
          </section>

          <section className="flex flex-col gap-1">
            <span className="text-body-s text-body">
              Last verified {formatDate(cohort.lastVerifiedAt)}
            </span>
            <span className="text-body-s text-body">
              {cohort.staleMissingPct}% stale or missing
            </span>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-h5 text-ink">Suggested action</h3>
            <p className="text-body-s text-body">{cohort.suggestedAction}</p>
          </section>

          <section className="flex gap-2">
            <button
              type="button"
              title="Prototype — not wired up"
              className="rounded-md border border-edge-strong px-3 py-1.5 text-body-s"
            >
              Export
            </button>
            <button
              type="button"
              title="Prototype — not wired up"
              className="rounded-md border border-edge-strong px-3 py-1.5 text-body-s"
            >
              View full records →
            </button>
          </section>
        </div>
      </aside>
    </>
  )
}
