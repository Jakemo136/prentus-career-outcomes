# CLAUDE.md — prentus-project

**This file overrides workspace defaults for this project.**

## Styling

- **Tailwind CSS v4 utilities are the styling system.** Do NOT use
  CSS Modules, do NOT create `*.module.css` files, do NOT add inline
  `style={{}}` objects. Prentus itself uses Tailwind; the prototype
  mirrors that stack.
- Design tokens live in `src/styles/tokens.css` inside a `@theme { }`
  block. Every token automatically becomes a Tailwind utility:
  - `--color-primary-500` → `bg-primary-500`, `text-primary-500`, `border-primary-500`
  - `--color-ink` → `text-ink`; `--color-surface` → `bg-surface`
  - `--text-h3` → `text-h3`; `--text-body-s` → `text-body-s`
  - `--radius-md` → `rounded-md`; `--shadow-card` → `shadow-card`
- **Prefer semantic utilities over primitives** in components
  (`text-ink` over `text-grey-600`, `bg-surface` over `bg-grey-50`,
  `bg-alert-success-bg` over `bg-green-100`).
- **Tailwind JIT gotcha:** class names must be literal strings.
  Do NOT use template interpolation like `` `bg-${color}-500` `` — JIT
  won't see it. Use explicit maps (`const tone = { ok: 'bg-green-500', bad: 'bg-red-500' }`).

### Figma-sourced colors only

**Every color value in `tokens.css` must come from an authoritative
Figma export in `/Users/jakemosher/Workspace/prentus tokens/`:**

- `Core_colors.svg` — page surface + heading text anchors
- `Primary_Tints.svg` — purple / green / orange ramps (9 stops each)
- `Grey_Tints.svg` — neutrals
- `Alert_Tints.svg` — red / error ramp
- `Alerts.svg`, `Tags.svg`, `Nav-item.svg` — semantic usage examples

Rules:

- Do NOT invent new ramp stops, interpolate between two stops, or
  pick "close enough" hex values. If a color isn't already in the
  SVG exports, stop and re-export from Figma rather than guessing.
- Do NOT use `text-[#…]` arbitrary values in components. Ever.
- Do NOT hand-roll inline `<svg>` icons. Use `<Icon name="…" />`
  which draws from `src/assets/icons/` (the vendored Prentus set
  of 315 SVGs). If an icon isn't in the set, re-export from Figma.
- Alert / status tints use the semantic aliases
  (`bg-alert-success-bg`, `bg-alert-warning-bg`, `bg-alert-error-bg`,
  `bg-alert-info-bg`) — not raw ramp stops — so the semantic
  intention is clear in the code.
- Text contrast on any tinted background must meet WCAG AA
  (4.5:1 for body, 3:1 for large text). The alert-fg tokens in
  `tokens.css` are pre-validated; prefer them over ramp stops.

## Testing

- **Vitest + React Testing Library + user-event.** Setup file at
  `src/test/setup.ts`. `@testing-library/jest-dom` matchers available
  globally.
- Co-locate tests next to source: `Foo.tsx` + `Foo.test.tsx`.
- `npm run test:run` for one-shot CI mode; `npm test` for watch.
- Test behavior via roles/labels, not implementation details — no
  class-name assertions, no `data-testid` unless there is no
  accessible alternative.

### Query selection rule

**Prefer `getByText` / `queryByText` wherever possible.** Reach for
`getByRole` only when one of these is true:

1. **Interactive element** — `button`, `link`, `textbox`, `checkbox`,
   etc. Role assertion catches regressions like `<button>` being
   refactored to `<div onClick>`, which `getByText` would miss.
2. **Heading with a level that matters** — `getByRole('heading', {
   level: 1, name })` because `getByText` ignores heading level.
3. **Form control with a visible label** — `getByLabelText(label)` is
   the correct tool (it's a role-aware query under the hood).
4. **The ARIA role is the contract being tested** — e.g.
   `role="status"`, `role="progressbar"`, `role="dialog"`,
   `role="img"` with an `aria-label`. The test exists to guarantee
   the a11y surface; dropping the role query removes the guarantee.

For plain display text (subtitles, paragraph copy, badge bodies with
no role meaning, pure visual markers), use `getByText`. It's shorter
and more direct, and doesn't falsely imply a role contract that
isn't there.

## Data layer

- All data is **static mock** in `src/mocks/readiness.ts`.
- Types live in `src/types/readiness.ts`.
- Pure data functions (filters, KPI recomputation) live in `src/lib/`
  and are TDD-first.
- No GraphQL, no Apollo, no fetch — prototype only.

## State

- **URL query params are the source of truth** for filter state and
  drill-in state. Use a thin `useUrlState()` hook wrapping
  `URLSearchParams`; do not pull in a routing library (no React Router).
  The page is single-route; only query params need to round-trip.

## Accessibility

- Drill-in drawer: `role="dialog"`, `aria-labelledby`, focus trap,
  Escape + backdrop to close, return focus to trigger row on close.
- All animations must honor `prefers-reduced-motion: reduce` and
  collapse to instant.
- Sortable table headers use `aria-sort`.

## Component conventions

- Named exports only.
- Co-locate component file + test file; no barrel re-exports unless
  a directory exposes a public API.
- Props: explicit `interface Props` above the component; no `React.FC`.
