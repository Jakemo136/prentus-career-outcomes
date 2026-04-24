# Prentus — Compliance Readiness Dashboard

A single-page admin dashboard for an outcomes-verification platform. Shows which cohorts are ready for verified-earnings reporting, flags programs drifting out of compliance, and surfaces data-source health so an admin can answer four questions in order:

1. **Are we safe enough?** — top KPI strip, Verified Earnings Coverage leads
2. **Where are we weak?** — sortable cohort risk table, worst first
3. **Why are we weak?** — source health cards, Verified Earnings styled as the hero source
4. **What should we do?** — drill-in panel per cohort with a suggested action

Built as a take-home interview prototype. Mock data only — no backend, no auth.

## Live demo

_(deploy URL pending — will be added after Vercel deploy)_

## Documents

| File | Purpose |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Product requirements — the source of truth for scope + success criteria |
| [`docs/UI_REQUIREMENTS.md`](docs/UI_REQUIREMENTS.md) | UI-layer requirements derived from the PRD (layouts, states, a11y, URL params) |
| [`docs/COMPONENT_INVENTORY.md`](docs/COMPONENT_INVENTORY.md) | Every component + its dependencies + its page |
| [`docs/BUILD_PLAN_ComplianceReadiness.md`](docs/BUILD_PLAN_ComplianceReadiness.md) | The 4-wave dependency-ordered build plan |
| [`docs/BUILD_STATUS.md`](docs/BUILD_STATUS.md) | Running record of what landed per wave + deferrals |
| [`CLAUDE.md`](CLAUDE.md) | Project conventions — tokens, testing, file layout, Figma-sourced colors rule, review gates |

## Stack

- **Vite** 8 + **React** 19 + **TypeScript** 6
- **Tailwind CSS v4** with `@theme` tokens — colors + radii sourced exclusively from Figma SVG exports (see `CLAUDE.md` for the rule)
- **Vitest** + **React Testing Library** + **@testing-library/user-event** for unit/integration
- **Playwright** (Chromium) for E2E
- 315 Prentus icons vendored as SVGs, rendered via a single `<Icon name="…" />` wrapper

No router — the prototype is a single route. URL state (`?program=`, `?term=`, `?source=`, `?verification=`, `?cohort=`) is managed by a thin `useUrlState` hook over `URLSearchParams` + `useSyncExternalStore`.

## Quick start

```bash
npm install
npm run dev          # start the dev server (http://localhost:5173)
npm run test         # vitest watch mode
npm run test:run     # vitest one-shot (CI mode)
npm run test:e2e     # playwright
npm run build        # production build
npm run lint
```

## Project structure

```
src/
  components/
    ui/          presentational primitives (Icon, RiskStatusBadge, TrendIndicator, CoverageMeter, Section)
    layout/      app chrome (AppShell, Sidebar, SidebarNavItem, TopBar)
    readiness/   domain components (ComplianceReadinessPage, FilterBar, KpiCard, SourceCard,
                 ReadinessSummaryStrip, SourceHealthSection, CohortRiskTable, CohortDrillInPanel)
  hooks/         useUrlState, useFilterState, useReturnFocus
  lib/           pure utilities — filters, kpis, exportCsv, formatDate, urlParams
  mocks/         static mock data tuned to land the demo narrative
  types/         domain types
  styles/        tokens.css — @theme block, Figma-sourced values only
  assets/        vendored Prentus icons + logo marks
```

Tests are **co-located** with their subject (`Foo.tsx` + `Foo.test.tsx` side-by-side). The folder categories (`ui`/`layout`/`readiness`) are the only structural split.

## Design decisions worth calling out

- **Figma-sourced colors only.** Every color value traces to a hex present in one of the authoritative Figma SVG exports (`Core_colors.svg`, `Primary_Tints.svg`, `Grey_Tints.svg`, `Alert_Tints.svg`). `tokens.css` opens with `--color-*: initial; --radius-*: initial;` to strip Tailwind's default palette and radius scale — utilities like `bg-blue-500` or `rounded-2xl` produce zero CSS, making drift a compile-time no-op rather than a silent success.
- **Hero-metric override on `CoverageMeter`.** By default the bar uses threshold coloring (red/orange/green) for triage. A `tone="brand"` prop swaps to primary purple — used for the Verified Earnings KPI so the hero metric looks authoritative rather than alarming at low coverage.
- **URL is the source of truth for interaction state.** Filters + drill-in round-trip through the query string, so links are shareable and the back button works as expected. No routing library.
- **Graduate-weighted KPI recomputation.** When filters reduce the cohort set, KPIs recompute via `computeKpisForCohorts` — weighted by `graduates` count, not cohort count. A 50-grad cohort at 80% coverage should dominate a 10-grad cohort at 20%.
- **Focus management.** Drill-in opens focus on the close button; on close, focus returns to the triggering table row via `useReturnFocus` + a `data-cohort-id` attribute.
- **CSV export respects filters.** The TopBar "Export" button downloads a RFC-4180-quoted CSV of whatever cohorts the current filters show — visible state matches the file.

## Known deferrals

From the PRD compliance audit:

- **Drawer slide-in animation + `prefers-reduced-motion`** — drawer currently snaps open/closed without transition. PRD specifies a 200ms slide with reduced-motion respect.
- **Full focus trap inside the drill-in drawer** — Tab can currently escape the drawer. Partial mitigation: focus lands on close on open, returns to trigger on close. A real trap is a ~15-line addition with `focus-trap-react` or similar.
- **Sub-1024px responsive** — sidebar doesn't collapse below 1024px. PRD explicitly scopes the prototype to desktop-first.

## Testing philosophy

Tests assert behavior via the a11y tree, not implementation details:

- Prefer `getByText` / `queryByText` for display content.
- Use `getByRole` only for (1) interactive elements, (2) headings where level matters, (3) labeled form controls (`getByLabelText`), (4) ARIA roles that are themselves the contract (`dialog`, `progressbar`, `img`).
- Never class assertions. Never `data-testid` unless there's no accessible alternative.

Full rule in `CLAUDE.md` under *Testing → Query selection rule*.
