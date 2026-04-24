import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ComplianceReadinessPage } from './ComplianceReadinessPage'
import {
  MOCK_COHORTS,
  MOCK_INSTITUTION,
  MOCK_PROGRAMS,
  MOCK_SOURCES,
  MOCK_TERMS,
} from '../../mocks/readiness'

function renderPage() {
  return render(
    <ComplianceReadinessPage
      institution={MOCK_INSTITUTION}
      cohorts={MOCK_COHORTS}
      sources={MOCK_SOURCES}
      programs={MOCK_PROGRAMS}
      terms={MOCK_TERMS}
    />,
  )
}

describe('ComplianceReadinessPage', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('renders the AppShell with the Compliance Readiness title', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Compliance Readiness' }),
    ).toBeInTheDocument()
  })

  it('opens the drill-in drawer from ?cohort=<id> on first render', () => {
    window.history.replaceState({}, '', '/?cohort=cyb-sp25')
    renderPage()
    expect(
      screen.getByRole('dialog', { name: /cybersecurity/i }),
    ).toBeInTheDocument()
  })

  it('writes ?cohort=<id> to the URL when a row is clicked', async () => {
    const user = userEvent.setup()
    renderPage()
    const table = screen.getByRole('table')
    const firstRow = within(table).getAllByRole('row')[1]
    await user.click(firstRow)
    expect(window.location.search).toMatch(/cohort=/)
  })

  it('clears ?cohort= when the drawer close button is clicked', async () => {
    window.history.replaceState({}, '', '/?cohort=cyb-sp25')
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(window.location.search).not.toMatch(/cohort=/)
  })

  it('reflects changing a filter in the URL', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.selectOptions(screen.getByLabelText('Program'), 'Cybersecurity')
    expect(window.location.search).toContain('program=Cybersecurity')
  })

  it('ignores an unknown ?cohort= value without opening a drawer', () => {
    window.history.replaceState({}, '', '/?cohort=not-a-real-id')
    renderPage()
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
