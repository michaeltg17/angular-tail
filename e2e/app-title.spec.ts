import { test, expect } from '@playwright/test';

test('has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Angular App');
  // toolbar should contain the app title
  const toolbar = page.locator('mat-toolbar span').first();
  await expect(toolbar).toHaveText('Angular App');
});
