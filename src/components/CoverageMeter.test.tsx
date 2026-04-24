import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CoverageMeter } from './CoverageMeter'

describe('CoverageMeter', () => {
  it('renders a progressbar with aria-valuenow set to the rounded percent', () => {
    render(<CoverageMeter percent={72.4} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '72')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('renders the label text and percent readout when label is provided', () => {
    render(<CoverageMeter percent={63} label="Resume coverage" />)
    expect(screen.getByText('Resume coverage')).toBeInTheDocument()
    expect(screen.getByText('63%')).toBeInTheDocument()
  })

  it('uses the label as the accessible name when provided', () => {
    render(<CoverageMeter percent={63} label="Resume coverage" />)
    expect(
      screen.getByRole('progressbar', { name: /resume coverage/i })
    ).toBeInTheDocument()
  })

  it('falls back to "{percent}% coverage" accessible name when no label', () => {
    render(<CoverageMeter percent={45} />)
    expect(
      screen.getByRole('progressbar', { name: /45% coverage/i })
    ).toBeInTheDocument()
  })

  it('clamps percent above 100 to 100', () => {
    render(<CoverageMeter percent={120} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100'
    )
  })

  it('clamps negative percent to 0', () => {
    render(<CoverageMeter percent={-10} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0'
    )
  })

  it('reflects different percents in aria-valuenow regardless of thresholds', () => {
    const { rerender } = render(
      <CoverageMeter percent={20} thresholds={{ low: 30, medium: 60 }} />
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '20'
    )
    rerender(
      <CoverageMeter percent={50} thresholds={{ low: 30, medium: 60 }} />
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '50'
    )
    rerender(
      <CoverageMeter percent={80} thresholds={{ low: 30, medium: 60 }} />
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '80'
    )
  })
})
