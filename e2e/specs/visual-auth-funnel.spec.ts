import { test, expect } from '@playwright/test';

test.describe('VISUAL VERIFICATION — Auth & Conversion Funnel', () => {
  test('Capture Login, Register, Cart, and Checkout screens', async ({ page }, testInfo) => {
    const openPage = async (url: string) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('body')).toBeVisible();
    };

    // 1. Desktop Login Page
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage('/login');
    await page.screenshot({ path: testInfo.outputPath('login-page-desktop.png'), fullPage: true });

    // 2. Kiểm tra trạng thái form đã nhập mà không gọi API đăng nhập thật.
    const identifierInput = page.getByPlaceholder('email@example.com hoặc 0912 345 678');
    const passwordInput = page.getByPlaceholder('Nhập tối thiểu 8 ký tự');
    await identifierInput.fill('visual-test@example.invalid');
    await passwordInput.fill('Visual@123456');
    await expect(identifierInput).toHaveValue('visual-test@example.invalid');
    await expect(passwordInput).toHaveValue('Visual@123456');
    await page.screenshot({ path: testInfo.outputPath('login-form-filled-desktop.png') });

    // 3. Mobile Login Page
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage('/login');
    await page.screenshot({ path: testInfo.outputPath('login-page-mobile.png'), fullPage: true });

    // 4. Desktop Register Page
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage('/register');
    await page.screenshot({
      path: testInfo.outputPath('register-page-desktop.png'),
      fullPage: true,
    });

    // 5. Mobile Register Page
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage('/register');
    await page.screenshot({
      path: testInfo.outputPath('register-page-mobile.png'),
      fullPage: true,
    });

    // 6. Desktop Cart Page (Empty State with Popular Categories)
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage('/cart');
    await page.screenshot({ path: testInfo.outputPath('cart-page-desktop.png'), fullPage: true });

    // 7. Desktop Checkout Page
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage('/checkout');
    await page.screenshot({
      path: testInfo.outputPath('checkout-page-desktop.png'),
      fullPage: true,
    });
  });
});
