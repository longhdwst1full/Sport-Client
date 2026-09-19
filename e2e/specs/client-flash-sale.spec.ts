import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';

test.describe('CLIENT FLASH SALE — Trang khuyến mãi Flash Sale', () => {
  test('CLI-FS-01: Mở /flash-sale hiển thị trang khuyến mãi', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/flash-sale');

    await expect(page).toHaveTitle(/Flash Sale/i);
    const heading = page.getByRole('heading', { name: /Flash Sale/i }).first();
    await expect(heading).toBeVisible();
  });

  test('CLI-FS-02: Trang Flash Sale hiển thị danh sách sản phẩm hoặc trạng thái chiến dịch', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/flash-sale');

    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
});
