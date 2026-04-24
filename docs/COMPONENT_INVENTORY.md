# Component Inventory — Cohort Readiness

Generated from `UI_REQUIREMENTS.md`. One entry per component. Format is fixed (matches `/ui-interview` spec) so `/build-page` and dependency-resolver subagents can consume it.

Notes on field usage for this prototype:
- **GraphQL:** N/A throughout — the prototype uses static mock data in `src/mocks/readiness.ts`. Listed as `none (mock)` so the field is still filled.
- **Complexity:** `low` = mostly presentational, few props; `medium` = composition or meaningful interaction; `high` = multiple interactive states or significant logic.

---

## AppShell
- Page: shared
- Dependencies: Sidebar, TopBar
- GraphQL: none (mock)
- Complexity: low
- Build status: [ ] not started

## Sidebar
- Page: shared
- Dependencies: SidebarNavItem
- GraphQL: none (mock)
- Complexity: medium
- Build status: [ ] not started

## SidebarNavItem
- Page: shared
- Dependencies: none
- GraphQL: none (mock)
- Complexity: low
- Build status: [ ] not started

## TopBar
- Page: shared
- Dependencies: none
- GraphQL: none (mock)
- Complexity: low
- Build status: [ ] not started

## CohortReadinessPage
- Page: CohortReadiness
- Dependencies: AppShell, FilterBar, ReadinessSummaryStrip, CohortRiskTable, SourceHealthSection, CohortDrillInPanel
- GraphQL: none (mock)
- Complexity: medium
- Build status: [ ] not started

## FilterBar
- Page: CohortReadiness
- Dependencies: none
- GraphQL: none (mock)
- Complexity: medium
- Build status: [ ] not started

## KpiCard
- Page: CohortReadiness
- Dependencies: TrendIndicator
- GraphQL: none (mock)
- Complexity: medium
- Build status: [ ] not started

## ReadinessSummaryStrip
- Page: CohortReadiness
- Dependencies: KpiCard
- GraphQL: none (mock)
- Complexity: low
- Build status: [ ] not started

## RiskStatusBadge
- Page: shared
- Dependencies: none
- GraphQL: none (mock)
- Complexity: low
- Build status: [ ] not started

## TrendIndicator
- Page: shared
- Dependencies: none
- GraphQL: none (mock)
- Complexity: low
- Build status: [ ] not started

## CoverageMeter
- Page: shared
- Dependencies: none
- GraphQL: none (mock)
- Complexity: low
- Build status: [ ] not started

## CohortRiskTable
- Page: CohortReadiness
- Dependencies: RiskStatusBadge, TrendIndicator, CoverageMeter
- GraphQL: none (mock)
- Complexity: high
- Build status: [ ] not started

## SourceCard
- Page: CohortReadiness
- Dependencies: CoverageMeter
- GraphQL: none (mock)
- Complexity: medium
- Build status: [ ] not started

## SourceHealthSection
- Page: CohortReadiness
- Dependencies: SourceCard
- GraphQL: none (mock)
- Complexity: low
- Build status: [ ] not started

## CohortDrillInPanel
- Page: CohortReadiness
- Dependencies: CoverageMeter, RiskStatusBadge
- GraphQL: none (mock)
- Complexity: high
- Build status: [ ] not started
