import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AppShell } from './AppShell'

describe('AppShell', () => {
  it('renders the Sidebar landmark', () => {
    render(
      <AppShell pageTitle="Readiness">
        <div>content-here</div>
      </AppShell>,
    )
    expect(screen.getByRole('complementary', { name: /primary navigation/i })).toBeInTheDocument()
  })

  it('renders the TopBar with the page title as h1', () => {
    render(
      <AppShell pageTitle="Career Outcomes Readiness">
        <div>content-here</div>
      </AppShell>,
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'Career Outcomes Readiness' }),
    ).toBeInTheDocument()
  })

  it('renders the page body children', () => {
    render(
      <AppShell pageTitle="Readiness">
        <div>content-here</div>
      </AppShell>,
    )
    expect(screen.getByText('content-here')).toBeInTheDocument()
  })

  it('forwards onExport to TopBar export button', async () => {
    const onExport = vi.fn()
    const user = userEvent.setup()
    render(
      <AppShell pageTitle="Readiness" onExport={onExport}>
        <div>content-here</div>
      </AppShell>,
    )
    await user.click(screen.getByRole('button', { name: /export/i }))
    expect(onExport).toHaveBeenCalledTimes(1)
  })

  it('marks the active sidebar item via activeNavKey', () => {
    render(
      <AppShell pageTitle="Readiness" activeNavKey="readiness">
        <div>content-here</div>
      </AppShell>,
    )
    const readiness = screen.getByRole('button', { name: /career outcomes readiness/i })
    expect(readiness).toHaveAttribute('aria-current', 'page')
  })
})
