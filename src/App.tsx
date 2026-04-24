import { ReadinessDashboardPage } from './components/ReadinessDashboardPage'
import {
  MOCK_COHORTS,
  MOCK_INSTITUTION,
  MOCK_PROGRAMS,
  MOCK_SOURCES,
  MOCK_TERMS,
} from './mocks/readiness'

export function App() {
  return (
    <ReadinessDashboardPage
      institution={MOCK_INSTITUTION}
      cohorts={MOCK_COHORTS}
      sources={MOCK_SOURCES}
      programs={MOCK_PROGRAMS}
      terms={MOCK_TERMS}
    />
  )
}
