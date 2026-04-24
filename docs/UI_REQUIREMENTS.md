# UI Requirements — Cohort Readiness

Derived from `prentus_career_outcomes_readiness_dashboard_prd.md`. This prototype is a **single-page admin dashboard** with one optional drill-in. All data is mocked; there is no backend.

Narrative the page must land, in order:
1. **Are we safe enough?** — top summary strip.
2. **Where are we weak?** — cohort/program risk table.
3. **Why are we weak?** — source health section.
4. **What should we do next?** — surfaced through risk status + drill-in suggestions.

---

## 1. Page Inventory

| Route | Page | Purpose |
|---|---|---|
| `/` | `CohortReadinessPage` | The entire prototype. One screen. |
| `/?cohort=<id>` | Same page, drill-in open | Query-param-driven drill-in panel so the URL is shareable. |

Logged-out state is not implemented — assume the admin is already authenticated. There are no other routable pages.

---

## 2. Global Layout / Shell

Persistent UI surrounding the page:

- **`Sidebar`** (left, 240px, light `--color-surface` background)
  - Prentus logo (green mark from Figma)
  - Active nav item: "Career Outcomes → Readiness" (the current page)
  - Disabled / "coming soon" hint items for out-of-scope modules:
    Review Queue, Verified Earnings (full workflow), Compliance Reports, Surveys & Outreach, Executive Dashboards, Widgets.
  - Each hint item shows a small lock icon and a muted tooltip, per Figma sidebar pattern.
- **`TopBar`** (top, 64px, white on `--color-surface`)
  - Page title: "Career Outcomes Readiness"
  - Subtitle / breadcrumb: "Admin → Career Outcomes"
  - Right side: a secondary "Export" button (stub — no real export).

Mobile / responsive: **desktop-first only**, breakpoint down to ~1024px. Below that we can show a simplified stacked layout or a "best viewed on desktop" notice. Scope is deliberately narrow.

---

## 3. Page: CohortReadinessPage

### 3.1 Layout (top → bottom)
1. `FilterBar`
2. `ReadinessSummaryStrip`
3. `CohortRiskTable`
4. `SourceHealthSection`
5. `CohortDrillInPanel` (overlay, conditional on `?cohort=<id>`)

### 3.2 Sections

#### 3.2.1 FilterBar
- **Filters:** Program, Graduation Term, Source Type, Verification Status.
- **Behavior:** changing a filter updates the in-memory filtered set that feeds both the summary strip and the table. Source Health remains scoped to the full institution (it's about data infrastructure, not cohort mix).
- **Visual:** one horizontal row of `select`-style pills with clear labels. "All" is the default per filter.
- **Empty filter result state:** table shows "No cohorts match these filters. [Clear filters]" row; summary strip shows greyed/"—" values with a small notice.

#### 3.2.2 ReadinessSummaryStrip
- **KPIs, left → right:**
  1. **Verified Earnings Coverage** — **lead metric**, largest visual weight, uses primary purple.
  2. **Outcomes Coverage** — supporting.
  3. **Stale / Missing Records** — urgent variant, uses red/orange if above threshold.
  4. **Programs At Risk** — urgent variant, count + "needs attention" subtitle.
  5. *(optional)* **Placement Rate** — intentionally smaller / muted to reinforce that raw placement is not the hero metric.
- **Behavior:** each KPI shows current value, a delta vs. prior period (up/down/flat + %), and a micro-trend sparkline or coverage bar where useful.
- **Empty state:** never fully empty (always shows institution totals even with all filters cleared). With no matching data, show "—" with a muted label.

#### 3.2.3 CohortRiskTable
- **Row type:** program rows, sortable by column.
- **Columns:**
  - Program / Cohort (name + term chip)
  - Graduates (count)
  - Verified Earnings Coverage (% with `CoverageMeter`)
  - Outcomes Coverage (%)
  - Stale / Missing %
  - Placement Rate (%, muted)
  - Trend (`TrendIndicator`)
  - Risk Status (`RiskStatusBadge`: on-track / watch / at-risk)
- **Default sort:** Risk Status (worst first) — reinforces "triage table, not leaderboard" framing.
- **Row interaction:** click opens `CohortDrillInPanel` via `?cohort=<id>` URL update.
- **Empty state:** "No cohorts match these filters." + clear-filters link.
- **Loading / error states:** not applicable — synchronous mock.

#### 3.2.4 SourceHealthSection
- **Cards, left → right (in order of authority):**
  1. **Verified Earnings** — styled prominently (primary border/background tint) to signal highest trust.
  2. Surveys
  3. LinkedIn Scans
  4. Student Self-Report
- **Per card:** source name, coverage %, last-refreshed timestamp, trust level pill (High / Medium / Low), issue indicator if stale or degraded, compact coverage bar.
- **Purpose:** connect the "why" to the risk table — admins should see that a risky cohort correlates to thin verified coverage.

#### 3.2.5 CohortDrillInPanel *(optional interaction)*
- **Trigger:** row click on `CohortRiskTable`.
- **Presentation:** right-side drawer (~480px wide), overlays the page, dims background. Closes via X, Escape, or background click.
- **Contents:**
  - Cohort/program summary (name, term, graduates)
  - Source coverage breakdown (reuse `CoverageMeter` per source)
  - Stale record count + "last verified" date
  - Confidence / trust breakdown
  - Suggested next action (copy only, no real workflow)
  - Two stub buttons: "Export" and "View full records →" (both no-op with a subtle "prototype" tooltip).
- **URL:** `?cohort=<id>` — shareable, restorable on reload.

### 3.3 States summary

| State | Scope | Implementation |
|---|---|---|
| Loading | None | Mock data is synchronous; no skeleton required. |
| Error | None | No network; no error path. |
| Empty (no filter matches) | Table + summary strip | "No cohorts match" row; KPIs render "—". |
| Drill-in open | Page | Controlled by `?cohort=<id>` URL query param. |

---

## 4. Key Interactions

### 4.1 Filter change
1. User changes a filter in `FilterBar`.
2. Filter state updates in a top-level React state (or URL param — TBD; see open questions).
3. `ReadinessSummaryStrip` recomputes KPIs from the filtered cohort set.
4. `CohortRiskTable` re-renders filtered rows.
5. `SourceHealthSection` is NOT affected (infrastructure-scoped, not cohort-scoped).

### 4.2 Row click → drill-in
1. User clicks a row in `CohortRiskTable`.
2. URL updates to `/?cohort=<id>`.
3. `CohortDrillInPanel` mounts with data for that cohort.
4. User reviews, then closes via X, Escape, or clicking the backdrop.
5. URL returns to `/`.

### 4.3 Sort change
1. User clicks a column header in `CohortRiskTable`.
2. Sort indicator toggles ascending/descending.
3. Row order updates in place (no network).

### 4.4 Confirmation dialogs
None. No destructive actions in this prototype.

---

## 5. Data Requirements

All data is static mock. Location: `src/mocks/readiness.ts`. Types: `src/types/readiness.ts`.

### 5.1 Mock data shape

```ts
type RiskStatus = 'on-track' | 'watch' | 'at-risk';
type TrustLevel = 'high' | 'medium' | 'low';
type SourceId = 'verified-earnings' | 'surveys' | 'linkedin' | 'self-report';

interface Institution {
  kpis: {
    verifiedEarningsCoverage: Metric;  // %, delta, trend array
    outcomesCoverage: Metric;
    staleMissingPct: Metric;
    programsAtRisk: Metric;            // count
    placementRate: Metric;
  };
  sources: SourceHealth[];
  cohorts: Cohort[];
}

interface Metric {
  value: number;
  deltaPct: number;            // vs prior period
  trend: number[];             // sparkline
  unit?: '%' | 'count';
}

interface SourceHealth {
  id: SourceId;
  name: string;
  coveragePct: number;
  lastRefreshedAt: string;     // ISO date
  trust: TrustLevel;
  hasIssue: boolean;
  issueNote?: string;
}

interface Cohort {
  id: string;
  program: string;
  term: string;                // 'Spring 2025'
  graduates: number;
  verifiedEarningsCoveragePct: number;
  outcomesCoveragePct: number;
  staleMissingPct: number;
  placementRatePct: number;
  trend: number[];
  risk: RiskStatus;
  // extras for drill-in
  sourceMix: Record<SourceId, number>;
  suggestedAction: string;
  lastVerifiedAt: string;
}
```

### 5.2 Mock volume
- ~8–12 cohorts across 4–5 programs, mixed risk statuses.
- 4 sources (fixed).
- Numbers tuned so the demo narrative lands: ~60–70% verified coverage institution-wide, 2–3 at-risk programs, Verified Earnings showing as the lowest-coverage source.

---

## 6. Resolved Decisions

- **Filter state source of truth:** URL query params. All filters + drill-in state read/write via `?program=&term=&source=&verification=&cohort=<id>`. Single `useUrlState()` hook wraps `URLSearchParams`.
- **KPI trend display:** delta arrow + % change only (no inline sparklines). Matches the "fast triage" intent.
- **Sort UX:** click column header toggles asc/desc. Default sort on mount: `riskStatus` desc (worst first).
- **Drill-in transition:** 200ms slide-in + fade using `--transition-base`. Must:
  - Respect `prefers-reduced-motion` — collapse to instant open/close.
  - Use `role="dialog"` + `aria-labelledby` pointing at the cohort name heading.
  - Trap focus inside the drawer while open; return focus to the triggering row on close.
  - Close on Escape and on backdrop click.
- **Mobile:** graceful stack below 1024px. Sidebar collapses to a compact top bar; sections stack full-width.

---

## 7. Non-Functional Requirements

- **Styling:** Tailwind CSS v4 utilities only. Semantic tokens (`bg-surface`, `text-ink`, `rounded-md`, `shadow-card`) over arbitrary values. No CSS Modules, no inline style objects.
- **Accessibility:** labeled filter controls, keyboard-navigable table rows, focus trap in drill-in drawer, Escape-to-close, `aria-sort` on sortable headers.
- **Testing:** RTL tests per component for render + key interaction; one E2E flow covering filter → row click → drill-in open → close.
- **Typography:** Geist at all weights; use semantic text utilities (`text-h3`, `text-body-s`, etc.).
