import { test, expect } from '@playwright/test';

test.describe('Readiness dashboard composition', () => {
  test.beforeEach(async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    (test.info() as unknown as { _errs: string[] })._errs = errors;
  });

  test.afterEach(async () => {
    const errs = (test.info() as unknown as { _errs?: string[] })._errs ?? [];
    expect(errs, `Unexpected console errors:\n${errs.join('\n')}`).toEqual([]);
  });

  test('TopBar renders page title as h1 + Export button', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: 'Career Outcomes Readiness' }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();
  });

  test('Sidebar renders active item + disabled coming-soon items', async ({
    page,
  }) => {
    const active = page.getByRole('button', { name: 'Readiness' });
    await expect(active).toHaveAttribute('aria-current', 'page');

    const disabled = page.getByRole('button', { name: 'Review Queue' });
    await expect(disabled).toBeDisabled();
    await expect(disabled).toHaveAttribute('title', 'Coming soon');
  });

  test('FilterBar renders four labeled selects', async ({ page }) => {
    // Scope to combobox role so we don't collide with the CohortRiskTable
    // column header labeled "Program".
    await expect(
      page.getByRole('combobox', { name: 'Program' }),
    ).toBeVisible();
    await expect(
      page.getByRole('combobox', { name: 'Graduation term' }),
    ).toBeVisible();
    await expect(
      page.getByRole('combobox', { name: 'Source type' }),
    ).toBeVisible();
    await expect(
      page.getByRole('combobox', { name: 'Verification status' }),
    ).toBeVisible();
  });

  test('Readiness summary renders 5 KpiCards including the hero', async ({
    page,
  }) => {
    // Scope lookups to the summary section so KpiCard labels don't collide
    // with CohortRiskTable column headers (e.g. "Stale / Missing").
    const summary = page.getByRole('region', { name: 'Readiness summary' });
    await expect(
      summary.getByRole('heading', { level: 2, name: 'Readiness summary' }),
    ).toBeVisible();
    await expect(summary.getByText('Verified earnings coverage')).toBeVisible();
    await expect(summary.getByText('Outcomes coverage')).toBeVisible();
    await expect(summary.getByText('Stale / missing')).toBeVisible();
    await expect(summary.getByText('Programs at risk')).toBeVisible();
    await expect(summary.getByText('Placement rate')).toBeVisible();
  });

  test('CohortRiskTable renders rows with at-risk sorted first', async ({
    page,
  }) => {
    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    const rows = table.getByRole('row');
    // header + 10 cohorts
    await expect(rows).toHaveCount(11);

    // Default sort is risk desc — first data row should be an at-risk Cybersecurity cohort.
    const firstDataRow = rows.nth(1);
    await expect(firstDataRow).toContainText('Cybersecurity');
  });

  test('SourceHealth renders four cards', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 2, name: 'Source health' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Verified Earnings' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Surveys' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'LinkedIn Scans' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Student Self-Report' }),
    ).toBeVisible();
  });

  test('Row click opens drill-in dialog; Escape closes it', async ({ page }) => {
    // No dialog at rest.
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // Click the first data row (first at-risk Cybersecurity cohort).
    const firstDataRow = page.getByRole('table').getByRole('row').nth(1);
    await firstDataRow.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Cybersecurity');
    await expect(dialog).toContainText('Suggested action');

    // Escape closes.
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('Primitive gallery still renders badges, trends, and meters', async ({
    page,
  }) => {
    // Status badges live in the gallery AND in the cohort table rows.
    await expect(
      page.getByRole('status').filter({ hasText: 'On track' }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole('status').filter({ hasText: 'At risk' }).first(),
    ).toBeVisible();

    // Trend indicators show accessible names.
    await expect(
      page.getByRole('img', { name: /trending up/i }).first(),
    ).toBeVisible();

    // Gallery coverage meter with explicit label.
    await expect(
      page.getByRole('progressbar', { name: /brand tone/i }),
    ).toHaveAttribute('aria-valuenow', '30');
  });
});
