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
  (`text-ink` over `text-grey-600`, `bg-surface` over `bg-grey-50`).
- **Tailwind JIT gotcha:** class names must be literal strings.
  Do NOT use template interpolation like `` `bg-${color}-500` `` — JIT
  won't see it. Use explicit maps (`const tone = { ok: 'bg-green-500', bad: 'bg-red-500' }`).

## Testing

- **Vitest + React Testing Library + user-event.** Setup file at
  `src/test/setup.ts`. `@testing-library/jest-dom` matchers available
  globally.
- Co-locate tests next to source: `Foo.tsx` + `Foo.test.tsx`.
- `npm run test:run` for one-shot CI mode; `npm test` for watch.
- Test behavior via roles/labels, not implementation details — no
  class-name assertions, no `data-testid` unless there is no
  accessible alternative.

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
