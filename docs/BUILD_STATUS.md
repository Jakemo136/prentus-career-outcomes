# Build Status — Compliance Readiness

Plan: `docs/BUILD_PLAN_ComplianceReadiness.md`.

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
- **Gallery:** `src/App.tsx` rewritten as a temporary primitives gallery so Playwright has a stable surface; slated for replacement by `ComplianceReadinessPage` in Wave 4.

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
- **Gallery:** `src/App.tsx` extended to compose all Wave 1 + Wave 2 components in a dashboard-like layout with mock data. Still a gallery, not the final page — Wave 4 replaces with `ComplianceReadinessPage` that owns URL state.

### Notes / deferrals (wave 2)

- `CohortDrillInPanel` focus trap + return-focus-on-close explicitly deferred. Current panel auto-focuses the close button on open; full trap + trigger-restore comes when the page owns the drill-in trigger (Wave 4).
- "Program" label collides between `FilterBar` (`<select>`) and `CohortRiskTable` column header (`<button>`) — E2E works around by using `getByRole('combobox', { name })` for selects. Not a regression, just a reminder to keep ARIA roles distinct in future wiring.

## Wave 4 — Page integration (final)

- **Status:** PR open (awaiting merge).
- **Branch:** `build/wave-4-page`.
- **Components (1):** `ComplianceReadinessPage` + `useUrlState` hook.
- **New files:** `src/components/ComplianceReadinessPage.tsx` + test, `src/lib/useUrlState.ts` + test.
- **Unit tests:** 11 new (5 hook + 6 page). Full suite: 19 files, **107 tests passing**.
- **E2E:** 4 new tests (13 total, all passing): direct-URL drill-in open, filter↔URL round-trip with reload persistence, row-click → URL → close → URL-cleared, and focus return to the triggering `<tr>` after drawer close.
- **`App.tsx`:** collapses to a 14-line mount of `<ComplianceReadinessPage />` passing the mock data. The primitives gallery is gone — real page is the only thing left.
- **FilterBar:** upgraded to `appearance-none` selects with an absolutely-positioned Prentus `<Icon name="chevron-down">` to replace the native OS chevron that didn't match Figma. Factored the four selects into a local `<SelectField>` helper.
- **Focus return:** page tracks `lastTriggerId` in a `useRef`; on `cohortId → null` transition, `document.querySelector('tr[data-cohort-id=…]')?.focus()` restores focus. Required adding a stable `data-cohort-id` attribute on each row (semantic data, not a test-id).

### Deferrals (still open)

- `CohortDrillInPanel` full focus trap — current behavior only auto-focuses the close button on open and relies on natural tab order while open. Good-enough for prototype; a real implementation would use `focus-trap-react` or similar.
- `prefers-reduced-motion` handling on the drawer slide-in is not wired yet. The drawer has no transition currently — it just mounts/unmounts. Adding a motion-respecting transition was scope-cut for this PR.
- `e2e/smoke.spec.ts` still uses its own beforeEach pattern; could be consolidated with `dashboard.spec.ts` on a later pass.

## Wave 3 — Section wrappers

- **Status:** PR open (awaiting merge).
- **Branch:** `build/wave-3-sections`.
- **Components (3):** `AppShell`, `ReadinessSummaryStrip`, `SourceHealthSection`.
- **Built in parallel:** single dispatch, strict two-file boundaries, scoped vitest. No conflicts.
- **Unit tests:** 14 new (5 + 5 + 4). Full suite: 17 files, **96 tests passing**.
- **E2E:** existing 9 tests still pass against the refactored `App.tsx` (now uses `AppShell` + `ReadinessSummaryStrip` + `SourceHealthSection` instead of inline layout). One selector updated: sidebar active item matches `name: 'Readiness'` (the actual Sidebar label is short; only the TopBar h1 has the full "Career Outcomes Readiness").
- **Gallery/App.tsx:** refactored to use section wrappers — sidebar + topbar via `AppShell`, KPI strip via `ReadinessSummaryStrip`, source grid via `SourceHealthSection`. The cohort table and primitives showcase stay inline. Wave 4 replaces `App.tsx` entirely with `ComplianceReadinessPage` that owns URL state.
