import { test, expect } from '@playwright/test';

test.describe('Wave 1 primitives gallery', () => {
  test.beforeEach(async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });
    await page.goto('/');
    // Stash on the test context so `afterEach` can read it.
    (test.info() as unknown as { _errs: string[] })._errs = consoleErrors;
  });

  test.afterEach(async () => {
    const errs = (test.info() as unknown as { _errs?: string[] })._errs ?? [];
    expect(errs, `Unexpected console errors:\n${errs.join('\n')}`).toEqual([]);
  });

  test('TopBar renders the page title as h1 and an Export button', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Primitives gallery' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Career Outcomes Readiness' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();
  });

  test('SidebarNavItem renders active and disabled states', async ({ page }) => {
    const active = page.getByRole('button', { name: 'Readiness' });
    await expect(active).toBeVisible();
    await expect(active).toHaveAttribute('aria-current', 'page');

    const disabled = page.getByRole('button', { name: /Review Queue/ });
    await expect(disabled).toBeDisabled();
    await expect(disabled).toHaveAttribute('title', 'Coming soon');
  });

  test('FilterBar renders four labeled selects', async ({ page }) => {
    await expect(page.getByLabel('Program')).toBeVisible();
    await expect(page.getByLabel('Graduation term')).toBeVisible();
    await expect(page.getByLabel('Source type')).toBeVisible();
    await expect(page.getByLabel('Verification status')).toBeVisible();
  });

  test('RiskStatusBadge renders all three states with live status role', async ({ page }) => {
    const badges = page.getByRole('status');
    await expect(badges.filter({ hasText: 'On track' })).toBeVisible();
    await expect(badges.filter({ hasText: 'Watch' })).toBeVisible();
    await expect(badges.filter({ hasText: 'At risk' })).toBeVisible();
  });

  test('TrendIndicator exposes accessible trend labels', async ({ page }) => {
    await expect(page.getByRole('img', { name: /trending up/i })).toBeVisible();
    await expect(page.getByRole('img', { name: /trending down/i })).toBeVisible();
    await expect(page.getByRole('img', { name: /flat/i })).toBeVisible();
  });

  test('CoverageMeter exposes progressbar with correct aria-valuenow', async ({ page }) => {
    await expect(page.getByRole('progressbar', { name: 'Verified earnings' })).toHaveAttribute('aria-valuenow', '30');
    await expect(page.getByRole('progressbar', { name: 'Outcomes' })).toHaveAttribute('aria-valuenow', '62');
    await expect(page.getByRole('progressbar', { name: 'Surveys' })).toHaveAttribute('aria-valuenow', '88');
  });
});
