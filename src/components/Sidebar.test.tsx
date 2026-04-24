import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Sidebar } from './Sidebar'

describe('Sidebar', () => {
  it('renders the Prentus logo with accessible alt text', () => {
    render(<Sidebar />)
    expect(screen.getByAltText('Prentus')).toBeInTheDocument()
  })

  it('renders the Readiness item as the active item', () => {
    render(<Sidebar />)
    const active = screen.getByRole('button', { name: /career outcomes readiness/i })
    expect(active).toHaveAttribute('aria-current', 'page')
  })

  it('renders all 6 coming soon items as disabled', () => {
    render(<Sidebar />)
    const labels = [
      'Review Queue',
      'Verified Earnings',
      'Compliance Reports',
      'Surveys & Outreach',
      'Executive Dashboards',
      'Widgets',
    ]
    for (const label of labels) {
      const item = screen.getByRole('button', { name: new RegExp(label, 'i') })
      expect(item).toBeDisabled()
    }
  })

  it('disabled items expose the Coming soon hint via title', () => {
    render(<Sidebar />)
    const item = screen.getByRole('button', { name: /review queue/i })
    expect(item).toHaveAttribute('title', 'Coming soon')
  })

  it('calls onSelect with "readiness" when the active item is clicked', async () => {
    const onSelect = vi.fn()
    render(<Sidebar onSelect={onSelect} />)
    const active = screen.getByRole('button', { name: /career outcomes readiness/i })
    await userEvent.click(active)
    expect(onSelect).toHaveBeenCalledWith('readiness')
  })
})
