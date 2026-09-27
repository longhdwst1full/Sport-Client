import { test } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\c9c6d221-5eca-4b5d-a8be-b633b51aa27e';

test('Capture updated budget and quicklinks section on home page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Scroll to budget navigation section
  const section = page.locator('section[aria-label="Tìm kiếm theo ngân sách"]');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await section.screenshot({ path: path.join(ARTIFACT_DIR, 'budget_and_quicklinks_unified.png') });
});
