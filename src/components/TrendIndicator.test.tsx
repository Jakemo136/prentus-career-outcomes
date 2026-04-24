import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TrendIndicator } from './TrendIndicator'

describe('TrendIndicator', () => {
  it('renders up arrow and positive signed percentage', () => {
    render(<TrendIndicator direction="up" deltaPct={3.2} />)
    const el = screen.getByRole('img', { name: /trending up, \+3\.2%/i })
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent('↑')
    expect(el).toHaveTextContent('+3.2%')
  })

  it('renders down arrow and negative signed percentage', () => {
    render(<TrendIndicator direction="down" deltaPct={-2.5} />)
    const el = screen.getByRole('img', { name: /trending down, -2\.5%/i })
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent('↓')
    expect(el).toHaveTextContent('-2.5%')
  })

  it('renders flat marker and 0% for flat direction', () => {
    render(<TrendIndicator direction="flat" deltaPct={0} />)
    const el = screen.getByRole('img', { name: /flat/i })
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent('→')
    expect(el).toHaveTextContent('0%')
  })

  it('renders only the arrow when deltaPct is omitted', () => {
    render(<TrendIndicator direction="up" />)
    const el = screen.getByRole('img', { name: /trending up/i })
    expect(el).toHaveTextContent('↑')
    expect(el.textContent).not.toMatch(/%/)
  })

  it('aria-label reflects direction and delta', () => {
    render(<TrendIndicator direction="down" deltaPct={-4.7} />)
    expect(
      screen.getByRole('img', { name: 'Trending down, -4.7%' }),
    ).toBeInTheDocument()
  })

  it('accessible name stays consistent across polarity', () => {
    const { rerender } = render(
      <TrendIndicator direction="up" deltaPct={1.0} polarity="higher-is-better" />,
    )
    expect(
      screen.getByRole('img', { name: /trending up, \+1\.0%/i }),
    ).toBeInTheDocument()
    rerender(
      <TrendIndicator direction="up" deltaPct={1.0} polarity="lower-is-better" />,
    )
    expect(
      screen.getByRole('img', { name: /trending up, \+1\.0%/i }),
    ).toBeInTheDocument()
  })
})
