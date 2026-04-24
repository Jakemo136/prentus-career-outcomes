import { useId } from 'react'
import type { SourceHealth } from '../types/readiness'
import { SourceCard } from './SourceCard'

export interface SourceHealthSectionProps {
  sources: SourceHealth[]
}

export function SourceHealthSection({ sources }: SourceHealthSectionProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-h4 text-ink">
        Source health
      </h2>
      {sources.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              isHero={source.id === 'verified-earnings'}
            />
          ))}
        </div>
      )}
    </section>
  )
}
