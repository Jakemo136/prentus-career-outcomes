# Build Status — ReadinessDashboard

Plan: `docs/BUILD_PLAN_ReadinessDashboard.md`.

## Wave 0 — E2E scaffolding

- **Status:** merged.
- **PR:** #2.
- Playwright + `@playwright/test` installed, `playwright.config.ts` targeting the Vite dev server via `webServer`.
- Smoke spec: `/` loads without console errors.
- CI split into `verify` (lint + typecheck + vitest) and `e2e` (Playwright with browser cache + HTML report artifact).

## Wave 1 — Leaf components

- **Status:** PR open (awaiting merge).
- **Branch:** `build/wave-1-leaf-components`.
- **Components (6):** `SidebarNavItem`, `TopBar`, `FilterBar`, `RiskStatusBadge`, `TrendIndicator`, `CoverageMeter`.
- **Built in parallel:** single parallel Agent dispatch, strict two-file-per-agent boundaries, zero merge conflicts.
- **Unit tests:** 33 new (5 + 5 + 6 + 4 + 6 + 7). Full suite: 8 files, **44 tests passing**.
- **E2E:** `e2e/primitives.spec.ts` added. Full E2E suite: **7 tests passing** (1 Wave 0 smoke + 6 Wave 1 primitives).
- **Gallery:** `src/App.tsx` rewritten as a temporary primitives gallery so Playwright has a stable surface; slated for replacement by `ReadinessDashboardPage` in Wave 4.

### Notes / deferrals

- CoverageMeter color-state assertions deferred to `/design-audit` + `/visual-qa` — no accessible surface exists to assert tone from RTL without class-name checks.
- Intra-wave full-suite vitest runs are noisy while siblings are mid-creation. Wave 2+ agents will run scoped tests only; orchestrator runs the full suite post-wave.

## Wave 2 — Composer components

- **Status:** PR open (awaiting merge).
- **Branch:** `build/wave-2-composers`.
- **Components (5):** `Sidebar`, `KpiCard`, `SourceCard`, `CohortRiskTable`, `CohortDrillInPanel`.
- **Built in parallel:** single parallel Agent dispatch, scoped vitest per agent (no intra-wave full-suite noise this time). Zero conflicts, zero cross-contamination.
- **Unit tests:** 33 new (5 + 6 + 6 + 8 + 8). Full suite: 14 files, **82 tests passing**.
- **E2E:** replaced `primitives.spec.ts` with `dashboard.spec.ts` covering filter bar, KPI strip, cohort table sort, source cards, row-click → drill-in dialog, Escape close, plus residual primitive assertions. Full E2E suite: **9 tests passing** (1 smoke + 8 composition).
- **Gallery:** `src/App.tsx` extended to compose all Wave 1 + Wave 2 components in a dashboard-like layout with mock data. Still a gallery, not the final page — Wave 4 replaces with `ReadinessDashboardPage` that owns URL state.

### Notes / deferrals (wave 2)

- `CohortDrillInPanel` focus trap + return-focus-on-close explicitly deferred. Current panel auto-focuses the close button on open; full trap + trigger-restore comes when the page owns the drill-in trigger (Wave 4).
- "Program" label collides between `FilterBar` (`<select>`) and `CohortRiskTable` column header (`<button>`) — E2E works around by using `getByRole('combobox', { name })` for selects. Not a regression, just a reminder to keep ARIA roles distinct in future wiring.
