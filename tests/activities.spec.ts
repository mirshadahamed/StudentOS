import { test, expect } from '@playwright/test';

test('activities page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/ActivityPage');

  await expect(page.locator('text=Wellness Activities')).toBeVisible();
});
test('user selects a mood', async ({ page }) => {
  await page.goto('http://localhost:3000/ActivityPage');

  await page.click('[data-testid="mood-happy"]');

  // Expect suggestion section to appear
  await expect(page.locator('text=Feeling Happy')).toBeVisible();
});
test('filter by category', async ({ page }) => {
  await page.goto('http://localhost:3000/ActivityPage');

  await page.click('[data-testid="category-physical"]');

  // Check at least one activity is shown
  await expect(page.locator('[data-testid="activity-card"]').first()).toBeVisible();
});
test('search activity', async ({ page }) => {
  await page.goto('http://localhost:3000/ActivityPage');

  await page.fill('[data-testid="search-input"]', 'breathing');

  await expect(page.locator('text=Breathing')).toBeVisible();
});
test('open activity detail', async ({ page }) => {
  await page.goto('http://localhost:3000/ActivityPage');

  await page.locator('[data-testid="activity-card"]').first().click();

  await expect(page.locator('text=Start Activity')).toBeVisible();
});
test('start activity', async ({ page }) => {
  await page.goto('http://localhost:3000/ActivityPage');

  await page.locator('[data-testid="activity-card"]').first().click();

  await page.click('[data-testid="start-activity"]');

  // Expect pause button after starting
  await expect(page.locator('text=Pause')).toBeVisible();
});
test('pause and resume activity', async ({ page }) => {
  await page.goto('http://localhost:3000/ActivityPage');

  await page.locator('[data-testid="activity-card"]').first().click();

  await page.click('[data-testid="start-activity"]');

  await page.click('text=Pause');
  await expect(page.locator('text=Resume')).toBeVisible();

  await page.click('text=Resume');
  await expect(page.locator('text=Pause')).toBeVisible();
});
test('clear filters', async ({ page }) => {
  await page.goto('http://localhost:3000/ActivityPage');

  await page.click('[data-testid="mood-happy"]');

  await page.click('text=Clear all filters');

  // Expect filters reset
  await expect(page.locator('text=Feeling Happy')).not.toBeVisible();
});