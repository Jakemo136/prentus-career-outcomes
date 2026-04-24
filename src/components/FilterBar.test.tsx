import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FilterBar } from './FilterBar'
import type { DashboardFilters } from '../types/readiness'

const emptyFilters: DashboardFilters = {
  program: null,
  term: null,
  source: null,
  verification: null,
}

const programs = ['Full-Stack Web Dev', 'Data Science']
const terms = ['2024 Spring', '2024 Fall']

describe('FilterBar', () => {
  it('renders four selects with accessible labels', () => {
    render(
      <FilterBar
        filters={emptyFilters}
        programs={programs}
        terms={terms}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Program')).toBeInTheDocument()
    expect(screen.getByLabelText('Graduation term')).toBeInTheDocument()
    expect(screen.getByLabelText('Source type')).toBeInTheDocument()
    expect(screen.getByLabelText('Verification status')).toBeInTheDocument()
  })

  it('reflects the current filters prop in selected values', () => {
    const filters: DashboardFilters = {
      program: 'Data Science',
      term: '2024 Fall',
      source: 'surveys',
      verification: 'partial',
    }
    render(
      <FilterBar
        filters={filters}
        programs={programs}
        terms={terms}
        onChange={vi.fn()}
      />,
    )
    expect((screen.getByLabelText('Program') as HTMLSelectElement).value).toBe(
      'Data Science',
    )
    expect(
      (screen.getByLabelText('Graduation term') as HTMLSelectElement).value,
    ).toBe('2024 Fall')
    expect(
      (screen.getByLabelText('Source type') as HTMLSelectElement).value,
    ).toBe('surveys')
    expect(
      (screen.getByLabelText('Verification status') as HTMLSelectElement)
        .value,
    ).toBe('partial')
  })

  it('calls onChange with updated program when program is changed', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <FilterBar
        filters={emptyFilters}
        programs={programs}
        terms={terms}
        onChange={onChange}
      />,
    )
    await user.selectOptions(screen.getByLabelText('Program'), 'Data Science')
    expect(onChange).toHaveBeenCalledWith({
      ...emptyFilters,
      program: 'Data Science',
    })
  })

  it('emits null for program when "All" is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const filters: DashboardFilters = {
      ...emptyFilters,
      program: 'Data Science',
    }
    render(
      <FilterBar
        filters={filters}
        programs={programs}
        terms={terms}
        onChange={onChange}
      />,
    )
    await user.selectOptions(screen.getByLabelText('Program'), '')
    expect(onChange).toHaveBeenCalledWith({ ...filters, program: null })
  })

  it('emits source: "surveys" when Surveys is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <FilterBar
        filters={emptyFilters}
        programs={programs}
        terms={terms}
        onChange={onChange}
      />,
    )
    await user.selectOptions(screen.getByLabelText('Source type'), 'surveys')
    expect(onChange).toHaveBeenCalledWith({
      ...emptyFilters,
      source: 'surveys',
    })
  })

  it('populates program and term options from props', () => {
    render(
      <FilterBar
        filters={emptyFilters}
        programs={programs}
        terms={terms}
        onChange={vi.fn()}
      />,
    )
    const programSelect = screen.getByLabelText('Program') as HTMLSelectElement
    const termSelect = screen.getByLabelText(
      'Graduation term',
    ) as HTMLSelectElement

    const programOptionValues = Array.from(programSelect.options).map(
      (o) => o.value,
    )
    expect(programOptionValues).toEqual(['', 'Full-Stack Web Dev', 'Data Science'])

    const termOptionValues = Array.from(termSelect.options).map((o) => o.value)
    expect(termOptionValues).toEqual(['', '2024 Spring', '2024 Fall'])
  })
})
