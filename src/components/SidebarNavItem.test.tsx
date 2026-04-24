import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidebarNavItem } from './SidebarNavItem'

describe('SidebarNavItem', () => {
  it('renders the label text', () => {
    render(<SidebarNavItem label="Readiness" />)
    expect(screen.getByRole('button', { name: /readiness/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<SidebarNavItem label="Readiness" onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: /readiness/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('marks the active item with aria-current="page"', () => {
    render(<SidebarNavItem label="Readiness" active />)
    expect(screen.getByRole('button', { name: /readiness/i })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('disabled item is non-interactive and exposes the hint via title', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <SidebarNavItem
        label="Outcomes"
        disabled
        disabledHint="Coming soon"
        onClick={onClick}
      />,
    )
    const button = screen.getByRole('button', { name: /outcomes/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAttribute('title', 'Coming soon')
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders the leading icon when provided', () => {
    render(
      <SidebarNavItem
        label="Readiness"
        icon={<svg data-icon="leading" />}
      />,
    )
    const button = screen.getByRole('button', { name: /readiness/i })
    expect(button.querySelector('[data-icon="leading"]')).not.toBeNull()
  })
})
