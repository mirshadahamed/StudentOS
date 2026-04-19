import { test, expect } from '@playwright/test';

test('user selects mood', async ({ page }) => {
  await page.goto('http://localhost:3000/MoodLogin');

  await page.click('[data-testid="mood-happy"]');

  const [dialog] = await Promise.all([
    page.waitForEvent('dialog'),
    page.click('[data-testid="save-mood"]'),
  ]);

  expect(dialog.message()).toContain('Mood saved successfully');
  await dialog.accept();
});