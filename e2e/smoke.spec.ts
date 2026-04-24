import { test, expect } from '@playwright/test';

test('dashboard route loads without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  await page.goto('/');

  await expect(page.locator('body')).toBeVisible();
  expect(errors, `Unexpected console errors:\n${errors.join('\n')}`).toEqual([]);
});
