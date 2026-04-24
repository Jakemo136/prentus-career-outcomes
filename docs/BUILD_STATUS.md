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
