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
      page.getByRole('heading', { level: 1, name: 'Compliance Readiness' }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();
  });

  test('Sidebar renders active item + disabled coming-soon items', async ({
    page,
  }) => {
    // Sidebar active item and TopBar h1 both read "Compliance Readiness";
    // filter by the button role to target the nav item.
    const active = page.getByRole('button', { name: 'Compliance Readiness' });
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

  test('Primitives render through cohort table + KPI strip', async ({
    page,
  }) => {
    // Status badges appear in the cohort risk table rows. No role="status"
    // by design (would create N live regions on a sorted table).
    await expect(page.getByText('On track').first()).toBeVisible();
    await expect(page.getByText('At risk').first()).toBeVisible();

    // Trend indicators appear in KPI cards with accessible names.
    await expect(
      page.getByRole('img', { name: /trending up/i }).first(),
    ).toBeVisible();

    // Hero KPI card renders a progressbar (the Verified Earnings tone=brand meter).
    await expect(
      page.getByRole('progressbar').first(),
    ).toBeVisible();
  });

  test('Direct URL ?cohort= auto-opens the drill-in drawer', async ({
    page,
  }) => {
    await page.goto('/?cohort=cyb-sp25');
    await expect(page.getByRole('dialog', { name: /cybersecurity/i })).toBeVisible();
  });

  test('Changing a filter round-trips through the URL', async ({ page }) => {
    await page
      .getByRole('combobox', { name: 'Program' })
      .selectOption('Cybersecurity');
    await expect(page).toHaveURL(/program=Cybersecurity/);

    // Reload should preserve the filter state.
    await page.reload();
    await expect(
      page.getByRole('combobox', { name: 'Program' }),
    ).toHaveValue('Cybersecurity');
  });

  test('Row click writes ?cohort= to the URL; close clears it', async ({
    page,
  }) => {
    const firstDataRow = page.getByRole('table').getByRole('row').nth(1);
    await firstDataRow.click();
    await expect(page).toHaveURL(/cohort=/);

    await page.getByRole('button', { name: /close drill-in/i }).click();
    await expect(page).not.toHaveURL(/cohort=/);
  });

  test('Focus returns to the triggering row when the drawer closes', async ({
    page,
  }) => {
    const firstRow = page.getByRole('table').getByRole('row').nth(1);
    const cohortId = await firstRow.getAttribute('data-cohort-id');
    expect(cohortId).toBeTruthy();

    await firstRow.click();
    await page.keyboard.press('Escape');

    // After close, the originally-clicked row regains focus.
    const activeId = await page.evaluate(
      () => (document.activeElement as HTMLElement | null)?.getAttribute('data-cohort-id') ?? null,
    );
    expect(activeId).toBe(cohortId);
  });
});
