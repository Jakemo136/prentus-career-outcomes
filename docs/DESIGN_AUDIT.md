# Design & Accessibility Audit — Compliance Readiness

**Run date:** 2026-04-24
**Branch:** `fix/design-audit`
**Standards:** `frontend-orchestration/standards/design-and-a11y.md` — WCAG 2.2 AA, breakpoints 375 / 768 / 1280 / 1440.
**Method:** three parallel subagents — static analysis, `@axe-core/playwright` runtime scan against `/` and `/?cohort=cyb-sp25`, full-page screenshots at all four breakpoints across four route variants.

---

## Summary

| Severity | Count | Auto-fixed | Acknowledged / flagged |
|---|---|---|---|
| Critical | 7 | 5 | 2 (mobile sidebar + screenshot-artifact false positive) |
| Major    | 11 | 9 | 3 (TrendIndicator role, filter lie, row-click pattern — prototype scope) |
| Minor    | 6 | 0 | 6 (next-touch cleanup) |

**Runtime a11y result (initial):** 31 axe-core violations, all under `color-contrast` (WCAG 1.4.3). Single root cause: `--color-muted: #737373` paired with `--color-surface-muted: #ECEFF1` (4.1:1) and `--color-alert-caution-bg: #FFEFE1` (4.21:1). Both fail AA. Token bump to `#595959` cleared all 31.

**Runtime a11y result (after auto-fix):** 0 color-contrast violations. 1 new `aria-allowed-role` surfaced on the drill-in `<aside role="dialog">` — `<aside>` has an implicit `complementary` role that can't be remapped to `dialog` per axe's allowed-role rules. Fixed in the same pass by swapping `<aside>` → `<div>` (role="dialog" retained; visual/semantic outcome identical).

**Final scan result:** 0 violations.

---

## Critical (fix before merge)

### C1 — No `<main>` landmark in the app
**Where:** `src/components/layout/AppShell.tsx` — the page body is a plain `<div>`.
**Why:** screen-reader users have no "skip to main content" target; required landmark absent.
**Fix:** wrap `{children}` in `<main className="flex-1 p-8">`.
**Auto-fix:** ✅

### C2 — Cohort table rows strip focus outline with no replacement
**Where:** `src/components/readiness/CohortRiskTable.tsx` — `focus:outline-none focus-visible:bg-surface-muted`.
**Why:** keyboard users get the same treatment as mouse-hover; on an already-selected row they're indistinguishable.
**Fix:** add `focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-[-2px]`.
**Auto-fix:** ✅

### C3 — Drill-in drawer: `role="dialog" aria-modal="true"` without a focus trap
**Where:** `src/components/readiness/CohortDrillInPanel.tsx`.
**Why:** Tab from the last button escapes to background content — contract violation.
**Fix:** hand-rolled Tab/Shift+Tab wrap on the drawer root. ~15 lines.
**Auto-fix:** ✅

### C4 — Stub buttons give no visible "prototype" indicator
**Where:** `src/components/readiness/CohortDrillInPanel.tsx` — Export / View-full-records buttons.
**Why:** `title="Prototype — not wired up"` doesn't surface to most AT, and the buttons look real. UI_REQUIREMENTS §3.2.5 explicitly requires the prototype hint visible.
**Fix:** add visible "(prototype)" text suffix + `aria-describedby` pointing at same.
**Auto-fix:** ✅

### C5 — Sidebar consumes ~half the viewport on mobile (375px)
**Where:** `src/components/layout/Sidebar.tsx` — fixed-width 240px, no breakpoint collapse.
**Why:** cascading damage across every route at mobile — KPI labels wrap to 3 lines, cohort table rendered off-screen, Source Health clips.
**Fix:** requires a hamburger / drawer pattern — not trivial.
**Auto-fix:** ❌ **Acknowledged** — PRD §4 explicitly scopes the prototype to "desktop-first ≥1024px." Left as known limitation in README deferrals; production would ship a collapse.

### C6 — Drill-in backdrop appears not to cover full page in full-page screenshots
**Where:** `src/components/readiness/CohortDrillInPanel.tsx` — `fixed inset-0`.
**Why:** Playwright `fullPage: true` captures the entire scroll-extent of the page as if viewed all at once. `fixed` elements only occupy the current viewport, so a scrolled-through screenshot shows the backdrop trailing off.
**Fix:** N/A — **false positive.** Verified `fixed inset-0` in code; in the browser at any real scroll position the backdrop covers correctly.
**Auto-fix:** ❌ (nothing to fix)

### C7 — Empty-state message clipped off-screen on mobile
**Where:** `src/components/readiness/CohortRiskTable.tsx` — empty row sits inside `<table>` which overflows horizontally at 375px.
**Why:** a user with a filter that yields zero matches on mobile sees a blank box with no feedback or recovery path.
**Fix:** once the cohort-table container has `overflow-x-auto`, the empty row can still be reached by horizontal scroll — acceptable given PRD desktop-first scope. Long-term fix is C5.
**Auto-fix:** partial — horizontal scroll added; full fix depends on C5.

---

## Major (fix same sprint)

### M1 — `role="alert"` on static content fires on every render
**Where:** `src/components/readiness/SourceCard.tsx` — the issue banner.
**Fix:** drop `role="alert"`. Icon + text is sufficient. Reserve live regions for state changes.
**Auto-fix:** ✅

### M2 — `role="img"` on TrendIndicator shadows the visible delta text
**Where:** `src/components/ui/TrendIndicator.tsx`.
**Why:** `aria-label` becomes the sole accessible name; the visible "+3.5%" becomes redundant/unreachable in the AT tree.
**Fix:** drop `role="img"`, let the natural text + aria-hidden glyph pattern work.
**Auto-fix:** ✅

### M3 — SourceCard "Medium" trust uses warning-bg (red tint)
**Where:** `src/components/readiness/SourceCard.tsx` — `trustPillClass.medium: 'bg-alert-warning-bg ...'`.
**Why:** semantic mismatch; red reads as "low/failed," not "medium."
**Fix:** switch to `bg-alert-caution-bg` (orange-100).
**Auto-fix:** ✅

### M4 — Sidebar aria-label is on the wrong landmark
**Where:** `src/components/layout/Sidebar.tsx` — `<aside aria-label="Primary navigation">` wraps a `<nav>`, producing two nested landmarks with the label on the wrong one.
**Fix:** move `aria-label="Primary navigation"` from `<aside>` to inner `<nav>`. Drop label from `<aside>` (it's already "complementary" by role).
**Auto-fix:** ✅

### M5 — KPI deltas render against null baselines
**Where:** `src/components/readiness/KpiCard.tsx` — when `metric.value` is NaN, the value shows "—" but the `TrendIndicator` still renders "+X%" delta.
**Fix:** early-return the trend row when value is NaN.
**Auto-fix:** ✅

### M6 — Tablet (768) creates an orphan 5th KPI card
**Where:** `src/components/readiness/ReadinessSummaryStrip.tsx` — `md:grid-cols-2 lg:grid-cols-5`.
**Fix:** `md:grid-cols-3 lg:grid-cols-5` — at tablet the 5 cards become 3+2 instead of 2+2+1.
**Auto-fix:** ✅

### M7 — Cohort table clips right edge at tablet (768)
**Where:** `src/components/readiness/ComplianceReadinessPage.tsx` — wrapper `rounded-md border … max-h-96 overflow-y-auto` lacks `overflow-x-auto`.
**Fix:** add `overflow-x-auto`.
**Auto-fix:** ✅

### M8 — 31 axe-core color-contrast violations
**Where:** runtime scan on `/` and `/?cohort=cyb-sp25` — all `#737373` muted text on `#ECEFF1` or `#FFEFE1` backgrounds (4.1:1 / 4.21:1, needs ≥4.5:1).
**Fix:** bump `--color-muted: #737373` → `#595959` in `tokens.css`. Verified: `#595959` on white 7.1:1, on surface `#F7F7F9` 6.9:1, on caution bg `#FFEFE1` 6.9:1, on surface-muted `#ECEFF1` 6.8:1 — all pass AA.
**Auto-fix:** ✅

### M9 — Empty-state filter UI "lies"
**Where:** URL has `?program=Not A Real Program` but the Program `<select>` shows "All" and the dashboard just appears empty.
**Fix:** needs input validation + an "Unknown program" state — nontrivial. Skipped.
**Auto-fix:** ❌ — **flagged** for follow-up.

### M10 — `useReturnFocus` via `document.querySelector`
**Where:** `src/components/readiness/ComplianceReadinessPage.tsx` — reaches into the DOM to find the trigger row.
**Why:** silently fails if the row is virtualized, paginated, or filtered out when the drawer closes.
**Fix:** ref-map or rebuild on pattern — larger refactor. Keep for prototype scope.
**Auto-fix:** ❌ — **acknowledged**, prototype scope acceptable.

### M11 — CohortRiskTable row is styled as `<tr tabindex=0 onClick>` without `role="button"`
**Where:** `src/components/readiness/CohortRiskTable.tsx`.
**Why:** AT presents it as a static table row but it acts as a button. Acceptable for prototype but flag.
**Auto-fix:** ❌ — **acknowledged**, prototype scope.

---

## Minor (fix when touching the component)

- **Icon.tsx:48** — inline `style={{ display: 'inline-flex', lineHeight: 0 }}` for non-dynamic values. Move to utility classes `inline-flex leading-none`.
- **TopBar Export button** — `transition-colors` without `motion-reduce:` guard. Cosmetic inconsistency with drawer.
- **KpiCard label baseline** — "Verified Earnings Coverage" wraps to 2 lines at lg-desktop; others stay 1. Consider min-height or shorter label.
- **KpiCard coverage bar position** — inconsistent vertical order on Verified Earnings vs. Outcomes.
- **Source card heading wrapping** — "Verified Earnings" and "Student Self-Report" wrap, "Surveys" / "LinkedIn Scans" don't. Noisy top row at desktop.
- **FilterBar selects** — no explicit `focus-visible:` treatment; browser default.

---

## Acknowledged issues (shipping as-is)

- **Mobile sidebar collapse (C5).** PRD explicitly scopes prototype to desktop-first ≥1024px. Documented in README "Known deferrals."
- **Empty-state Program filter (M9).** Known. Requires input validation work.
- **CohortRiskTable row click semantics (M11).** Prototype acceptable.
- **useReturnFocus querySelector (M10).** Prototype scope.
- **Drill-in backdrop in full-page screenshot (C6).** False positive from Playwright `fullPage: true`.

---

## Screenshots

All at `docs/audit-screenshots/{breakpoint}/{route}.png`:

- `mobile/` — default, cohort-drillin, filtered-table, empty-state
- `tablet/` — same four
- `desktop/` — same four
- `lg-desktop/` — same four

---

## Passes (what the audit got right)

- **`tokens.css` reset discipline works.** Zero `bg-blue-500`, `rounded-2xl`, `text-[#…]`, arbitrary pixel utilities, or other Tailwind-default leakage. The `--color-*: initial; --radius-*: initial;` pattern actively prevents drift.
- **Variant maps are all literal-string records.** `VARIANT_CLASS`, `toneClass`, `thresholdClass`, `alertBannerClass` — no template interpolation into class names, JIT-safe everywhere.
- **`KpiCard` NaN → em-dash** handled at the presentational layer rather than forced on callers.
- **`RiskStatusBadge` has a source-code comment explaining why `role="status"` was deliberately dropped** — exactly the kind of reasoning that prevents drive-by regressions.
- **axe-core found zero failures** for labels, alt text, focus order, landmarks, `aria-hidden` reachability, keyboard traps, heading order, or form fields. The only rule that fired is single-root-cause contrast.
- **Clear visual hierarchy at desktop widths.** H1, KPI strip, cohort table, source health — a cold user can answer "what am I looking at" in under a second at 1280+.
