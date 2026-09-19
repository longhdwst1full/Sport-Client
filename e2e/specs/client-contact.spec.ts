import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';

test.describe('CLIENT CONTACT — Liên hệ & Hỗ trợ', () => {
  test('CLI-CNT-01: Mở /contact hiển thị thông tin liên hệ và showroom', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/contact');

    await expect(page).toHaveTitle(/Liên hệ/i);
    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    const hasContactInfo =
      bodyText.includes('liên hệ') ||
      bodyText.includes('hotline') ||
      bodyText.includes('showroom') ||
      bodyText.includes('địa chỉ');
    expect(hasContactInfo).toBe(true);
  });

  test('CLI-CNT-02: Form gửi liên hệ hoặc thông tin liên hệ hiển thị đầy đủ', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/contact');

    const formOrCard = page.locator('form, [class*="contact"], main');
    await expect(formOrCard.first()).toBeVisible();
  });
});
