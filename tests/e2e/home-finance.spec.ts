import { expect, test } from '@playwright/test';

test.describe('Home and finance smoke', () => {
  test('home page renders primary modules', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'StudentOS' })).toBeVisible();
    await expect(page.getByText('Smart Finance')).toBeVisible();
    await expect(page.getByText('Mood Tracker')).toBeVisible();
    await expect(page.getByText('Smart Planning')).toBeVisible();
  });

  test('finance hub route renders', async ({ page }) => {
    await page.goto('/finance');

    await expect(page).toHaveURL(/\/finance$/);
    await expect(page.locator('body')).toContainText(/Initializing System|Finance Hub|Income/i);
  });

  test('finance module pages render key headings', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('/finance/income', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Income Streams' })).toBeVisible();

    await page.goto('/finance/expenses', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Expense Tracker' })).toBeVisible();

    await page.goto('/finance/savings', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /Wishlist Jars/i })).toBeVisible();

    await page.goto('/finance/split', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Advanced Splitter' })).toBeVisible();

    await page.goto('/finance/reports', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Financial Analytics' })).toBeVisible();

    await page.goto('/finance/advisor', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /AI Wealth Strategist/i })).toBeVisible();
  });
});
