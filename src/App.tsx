import { ComplianceReadinessPage } from './components/ComplianceReadinessPage'
import {
  MOCK_COHORTS,
  MOCK_INSTITUTION,
  MOCK_PROGRAMS,
  MOCK_SOURCES,
  MOCK_TERMS,
} from './mocks/readiness'

export function App() {
  return (
    <ComplianceReadinessPage
      institution={MOCK_INSTITUTION}
      cohorts={MOCK_COHORTS}
      sources={MOCK_SOURCES}
      programs={MOCK_PROGRAMS}
      terms={MOCK_TERMS}
    />
  )
}
