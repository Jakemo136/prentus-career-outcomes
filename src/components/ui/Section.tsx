import { useId, type ReactNode } from 'react'

export interface SectionProps {
  /** Heading text rendered as an h2 and linked via aria-labelledby. */
  heading: string
  children: ReactNode
}

/**
 * A titled page section. Renders a <section aria-labelledby> with an
 * h2 heading using the standard `text-h4 text-ink` treatment. Use for
 * every top-level section within a page body so heading styling and
 * a11y wiring stay consistent.
 */
export function Section({ heading, children }: SectionProps) {
  const headingId = useId()
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-h4 text-ink">
        {heading}
      </h2>
      {children}
    </section>
  )
}
