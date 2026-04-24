# Build Plan — Cohort Readiness

Generated from `COMPONENT_INVENTORY.md`. All 15 components (page-specific + shared) grouped into parallelizable waves by dependency depth. Components in the same wave have no inter-wave dependency and MUST be dispatched in a single parallel Agent call.

## Wave 1 — Leaf components (6)

No dependencies. Pure presentational primitives.

| Component | Page | Complexity |
|---|---|---|
| `SidebarNavItem` | shared | low |
| `TopBar` | shared | low |
| `FilterBar` | CohortReadiness | medium |
| `RiskStatusBadge` | shared | low |
| `TrendIndicator` | shared | low |
| `CoverageMeter` | shared | low |

## Wave 2 — Composers of Wave 1 (5)

| Component | Page | Depends on (all Wave 1) |
|---|---|---|
| `Sidebar` | shared | SidebarNavItem |
| `KpiCard` | CohortReadiness | TrendIndicator |
| `SourceCard` | CohortReadiness | CoverageMeter |
| `CohortRiskTable` | CohortReadiness | RiskStatusBadge, TrendIndicator, CoverageMeter |
| `CohortDrillInPanel` | CohortReadiness | CoverageMeter, RiskStatusBadge |

## Wave 3 — Sections + Shell (3)

| Component | Page | Depends on |
|---|---|---|
| `AppShell` | shared | Sidebar (W2), TopBar (W1) |
| `ReadinessSummaryStrip` | CohortReadiness | KpiCard (W2) |
| `SourceHealthSection` | CohortReadiness | SourceCard (W2) |

## Wave 4 — Page (1)

| Component | Page | Depends on |
|---|---|---|
| `CohortReadinessPage` | CohortReadiness | AppShell (W3), FilterBar (W1), ReadinessSummaryStrip (W3), CohortRiskTable (W2), SourceHealthSection (W3), CohortDrillInPanel (W2) |

## Wave 0 — E2E scaffolding + prep (pre-Wave 1)

Before any component work:

- Install Playwright + `@playwright/test`; add `playwright.config.ts` targeting `http://localhost:5173` via `webServer`.
- Add `npm run test:e2e` and `npm run test:e2e:ui` scripts.
- Seed one smoke spec: `e2e/smoke.spec.ts` — dashboard route (`/`) loads, no console errors.
- Add E2E job to `.github/workflows/ci.yml` (uses Playwright's `cache` and `install --with-deps`).
- Opens as a single PR: `build/wave-0-e2e-scaffold`.

## Execution protocol (revised)

1. **One PR per wave**, not per component. Branch naming: `build/wave-N-<summary>` (e.g. `build/wave-1-leaf-components`).
2. **Before each new wave branch:** `git checkout main && git pull` — otherwise the next wave diverges from the prior merged wave and hits conflicts. Non-negotiable.
3. **Inside a wave:** dispatch all component-builder subagents in a single parallel Agent message — never sequentially.
4. Wait for every component in a wave to land green (RTL + relevant E2E) before opening the wave PR.
5. Wait for user to merge the wave PR before starting the next wave. **The user merges, not the orchestrator.**
6. After each merged wave: orchestrator pulls fresh `main` before spawning the next wave.
7. Each wave adds one E2E spec covering its new surface (see per-wave notes below). E2E tests are immutable — if a later wave breaks them, fix the components, not the tests.

## Agent design-context sources (no Figma)

Every component-builder brief references only local sources:

- **Requirements:** `docs/UI_REQUIREMENTS.md` + `/Users/jakemosher/Workspace/docs/prentus_career_outcomes_readiness_dashboard_prd.md`
- **Visuals:** PNGs/SVGs in `/Users/jakemosher/Workspace/prentus tokens/` (unzip as needed). Page-level reference: `page - landing : platform readiness.zip`. Filename gotcha: some `sidebar -*` / `sidenav*` zips are actually Alert variants — open to verify.
- **Design values (source of truth):** `src/styles/tokens.css` `@theme` block. Agents must use the generated utilities (`text-ink`, `bg-primary-500`, `rounded-md`, `shadow-card`, `text-h3`, `--space-400`) — never raw hex or ad-hoc values.
- **Data + logic:** `src/mocks/readiness.ts`, `src/types/readiness.ts`, `src/lib/filters.ts`, `src/lib/kpis.ts`. Do not duplicate logic; import and compose.

## Per-wave E2E coverage

- **Wave 0:** smoke — `/` loads, no console errors.
- **Wave 1:** token/primitive smoke (isolated rendering via a temporary `/__dev/primitives` route or similar; discarded when Wave 4 lands).
- **Wave 2:** composition smoke — composer components render with mock data.
- **Wave 3:** AppShell chrome renders, section empty/populated states both visible.
- **Wave 4:** full dashboard golden path — filters change URL, cohort row opens drill-in, Escape closes drill-in, focus returns to trigger.

## Totals

- **5 PRs** (Wave 0 + Waves 1–4), each gated by CI (lint + typecheck + RTL + E2E).
- Max parallelism within a wave: 6 (Wave 1).
- Critical path: 5 merges deep.
