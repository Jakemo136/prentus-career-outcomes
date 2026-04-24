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
import { useEffect, useId, useRef, useState } from 'react'
import { formatShortDate } from '../../lib/formatDate'
import type { Cohort, SourceId } from '../../types/readiness'
import { RiskStatusBadge } from '../ui/RiskStatusBadge'
import { CoverageMeter } from '../ui/CoverageMeter'
import { Icon } from '../ui/Icon'

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

const TRANSITION_MS = 200

export function CohortDrillInPanel({
  cohort,
  onClose,
}: CohortDrillInPanelProps) {
  const headingId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const isOpen = cohort !== null

  // Two-state animation dance:
  // - `renderCohort` trails the `cohort` prop: set immediately on open,
  //   cleared TRANSITION_MS later on close. That keeps the DOM mounted
  //   through the exit transition.
  // - `isVisible` drives the actual CSS transform / opacity: flips to
  //   true on the frame after mount (so the browser paints the
  //   off-screen state first, then transitions), and back to false
  //   when cohort becomes null (triggering the exit).
  const [renderCohort, setRenderCohort] = useState<Cohort | null>(cohort)
  const [isVisible, setIsVisible] = useState(false)

  // The setState-in-effect lint rule flags the setRenderCohort calls
  // below, but the pattern IS canonical for "delayed unmount through
  // an exit transition": state has to follow a prop and a timer, and
  // there's no external system that cleanly substitutes. Disabled
  // per-line with explanation rather than inventing a workaround that
  // makes the code harder to read.
  useEffect(() => {
    if (cohort) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRenderCohort(cohort)
      // Double rAF: a single rAF fires BEFORE the paint that renders the
      // off-screen state, so the transition has no "from" frame and the
      // drawer just pops in. Nesting rAFs guarantees one paint happens
      // at translate-x-full, then the next frame flips to translate-x-0
      // and the browser interpolates between the two.
      let outerRaf = 0
      let innerRaf = 0
      outerRaf = requestAnimationFrame(() => {
        innerRaf = requestAnimationFrame(() => setIsVisible(true))
      })
      return () => {
        cancelAnimationFrame(outerRaf)
        cancelAnimationFrame(innerRaf)
      }
    }
    setIsVisible(false)
    const timeoutId = window.setTimeout(
      () => setRenderCohort(null),
      TRANSITION_MS,
    )
    return () => window.clearTimeout(timeoutId)
  }, [cohort])

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

  if (!renderCohort) return null

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/40 z-40 transition-opacity duration-200 ease-out motion-reduce:transition-none ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className={`fixed top-0 right-0 h-screen w-drawer bg-surface-raised shadow-lg z-50 flex flex-col transform transition-transform duration-200 ease-out motion-reduce:transition-none ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-edge-subtle">
          <div>
            <h2 id={headingId} className="text-h4 text-ink">
              {renderCohort.program}
            </h2>
            <p className="text-body-xs text-muted mt-1">{renderCohort.term}</p>
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
              {renderCohort.graduates} graduates
            </span>
            <RiskStatusBadge status={renderCohort.risk} />
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-h5 text-ink">Source coverage</h3>
            {SOURCE_ORDER.map((id) => (
              <CoverageMeter
                key={id}
                label={sourceLabels[id]}
                percent={renderCohort.sourceMix[id]}
                tone={id === 'verified-earnings' ? 'brand' : 'threshold'}
              />
            ))}
          </section>

          <section className="flex flex-col gap-1">
            <span className="text-body-s text-body">
              Last verified {formatShortDate(renderCohort.lastVerifiedAt)}
            </span>
            <span className="text-body-s text-body">
              {renderCohort.staleMissingPct}% stale or missing
            </span>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-h5 text-ink">Suggested action</h3>
            <p className="text-body-s text-body">{renderCohort.suggestedAction}</p>
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
