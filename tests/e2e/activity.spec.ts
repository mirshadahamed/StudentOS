import { expect, test } from '@playwright/test';

test.describe('Activity page interactions', () => {
  test('activities page loads and supports search filtering', async ({ page }) => {
    await page.goto('/ActivityPage');

    await expect(page.getByText('Find Your Calm')).toBeVisible();

    const search = page.locator('input[placeholder="Search activities..."]:visible');
    await search.fill('Breathing');

    await expect(page.getByText('5-Minute Breathing Exercise')).toBeVisible();
    await expect(page.getByText('Push-up Challenge')).toBeHidden();

    await page.getByRole('button', { name: 'Clear all filters' }).click();
    await expect(search).toHaveValue('');
  });

  test('user can start, pause, and reset an activity', async ({ page }) => {
    await page.goto('/ActivityPage');

    await page.getByText('5-Minute Breathing Exercise').first().click();

    const startButton = page.getByRole('button', { name: 'Start Activity' });
    const pauseButton = page.getByRole('button', { name: 'Pause' });

    if (await startButton.isVisible()) {
      await startButton.click();
    }

    await expect(pauseButton).toBeVisible();
    await pauseButton.click();

    await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByText('Find Your Calm')).toBeVisible();
  });
});
