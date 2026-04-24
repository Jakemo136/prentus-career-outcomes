import type { SourceHealth } from '../types/readiness'
import { Section } from './Section'
import { SourceCard } from './SourceCard'

export interface SourceHealthSectionProps {
  sources: SourceHealth[]
}

export function SourceHealthSection({ sources }: SourceHealthSectionProps) {
  return (
    <Section heading="Source health">
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
    </Section>
  )
}
