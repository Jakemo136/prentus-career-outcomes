import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders an icon from the Prentus set with an accessible label', () => {
    render(<Icon name="lock" aria-label="Locked" />)
    expect(screen.getByRole('img', { name: 'Locked' })).toBeInTheDocument()
  })

  it('renders as decorative (aria-hidden) when no label is provided', () => {
    const { container } = render(<Icon name="lock" />)
    const span = container.firstElementChild as HTMLElement
    expect(span.getAttribute('aria-hidden')).toBe('true')
    expect(span.getAttribute('role')).toBeNull()
  })

  it('returns null for an unknown icon name', () => {
    const { container } = render(<Icon name="definitely-not-a-real-icon" />)
    expect(container.firstChild).toBeNull()
  })

  it('honors the size prop on the inlined SVG', () => {
    const { container } = render(<Icon name="lock" size={24} />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('width')).toBe('24')
    expect(svg!.getAttribute('height')).toBe('24')
  })
})
