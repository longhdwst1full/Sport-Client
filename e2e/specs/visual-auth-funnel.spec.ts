import { test, expect } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\c9c6d221-5eca-4b5d-a8be-b633b51aa27e';

test.describe('VISUAL VERIFICATION — Auth & Conversion Funnel', () => {
  test('Capture Login, Register, Cart, and Checkout screens', async ({ page }) => {
    // 1. Desktop Login Page
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'login_page_redesigned_desktop.png'), fullPage: true });

    // 2. Click "Điền nhanh" to trigger demo autofill and Toast notification
    const quickFillBtn = page.getByRole('button', { name: 'Điền nhanh' });
    await expect(quickFillBtn).toBeVisible();
    await quickFillBtn.click();
    await page.waitForTimeout(500);

    // Verify Toast is visible
    const toast = page.getByRole('status').first();
    await expect(toast).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'login_with_toast_desktop.png') });

    // 3. Mobile Login Page
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'login_page_mobile.png'), fullPage: true });

    // 4. Desktop Register Page
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'register_page_redesigned_desktop.png'), fullPage: true });

    // 5. Mobile Register Page
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'register_page_mobile.png'), fullPage: true });

    // 6. Desktop Cart Page (Empty State with Popular Categories)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cart_page_redesigned_desktop.png'), fullPage: true });

    // 7. Desktop Checkout Page
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'checkout_page_desktop.png'), fullPage: true });
  });
});
