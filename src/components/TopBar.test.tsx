import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TopBar } from './TopBar'

describe('TopBar', () => {
  it('renders the title as a level 1 heading', () => {
    render(<TopBar title="Career Outcomes" />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Career Outcomes' }),
    ).toBeInTheDocument()
  })

  it('renders the subtitle when provided', () => {
    render(<TopBar title="Career Outcomes" subtitle="Spring 2026 cohort" />)
    expect(screen.getByText('Spring 2026 cohort')).toBeInTheDocument()
  })

  it('does not render a subtitle when subtitle is omitted', () => {
    render(<TopBar title="Career Outcomes" />)
    expect(screen.queryByText('Spring 2026 cohort')).not.toBeInTheDocument()
    // Only the h1 text should be present in the header
    const heading = screen.getByRole('heading', { level: 1 })
    const header = heading.closest('header')
    expect(header).not.toBeNull()
    // The title's parent flex container should have exactly one child (the h1)
    expect(heading.parentElement?.children).toHaveLength(1)
  })

  it('renders an Export button when onExport is provided and calls it on click', async () => {
    const user = userEvent.setup()
    const onExport = vi.fn()
    render(<TopBar title="Career Outcomes" onExport={onExport} />)
    const button = screen.getByRole('button', { name: 'Export' })
    await user.click(button)
    expect(onExport).toHaveBeenCalledTimes(1)
  })

  it('does not render the Export button when onExport is omitted', () => {
    render(<TopBar title="Career Outcomes" />)
    expect(
      screen.queryByRole('button', { name: 'Export' }),
    ).not.toBeInTheDocument()
  })
})
