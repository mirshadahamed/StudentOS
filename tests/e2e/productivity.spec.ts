import { expect, test } from '@playwright/test';

test.describe('Productivity smoke', () => {
  test('productivity hub loads after boot', async ({ page }) => {
    await page.goto('/productivity');

    await expect(page.getByText('Smart Planning Hub')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('All Tasks')).toBeVisible();
    await expect(page.getByText('AI Planner')).toBeVisible();
    await expect(page.getByText('Focus Mode')).toBeVisible();
  });

  test('productivity task pages render', async ({ page }) => {
    await page.goto('/productivity/tasks');
    await expect(page.getByRole('heading', { name: 'All Tasks' })).toBeVisible();

    await page.goto('/productivity/progress');
    await expect(page.getByRole('heading', { name: 'Progress', level: 1 })).toBeVisible();

    await page.goto('/productivity/focus');
    await expect(page.getByRole('heading', { name: 'Focus Mode' })).toBeVisible();

    await page.goto('/productivity/ai-planner');
    await expect(page.getByRole('heading', { name: 'AI Planner' })).toBeVisible();
  });
});
