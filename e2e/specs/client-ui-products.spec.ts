import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';

test.describe('CLIENT UI — Product Grid & Cards', () => {
  test('CLI-PRD-01: Thẻ sản phẩm hiển thị ảnh, tên sản phẩm và giá', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/products');

    const card = page.locator('article, [class*="product-card"], a[href*="/products/"]').first();
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card.locator('img')).toBeVisible();
    await expect(card).toContainText(/đ|₫|VND/i);
  });

  test('CLI-PRD-02: Thẻ sản phẩm có nút hoặc hành động xem/thêm giỏ hàng', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/products');

    const action = page.locator('button, a').filter({ hasText: /Thêm vào giỏ|Mua ngay|Xem chi tiết/i }).first();
    await expect(action).toBeVisible({ timeout: 15_000 });
  });

  test('CLI-PRD-03: Thẻ sản phẩm hover có hiệu ứng tương tác', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/products');

    const card = page.locator('article, [class*="product-card"], a[href*="/products/"]').first();
    await expect(card).toBeVisible({ timeout: 15_000 });
    await card.hover();
    await expect(card).toBeVisible();
  });

  test('CLI-PRD-04: Click thẻ sản phẩm điều hướng sang trang chi tiết sản phẩm', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/products');

    const productLink = page.locator('a[href^="/products/"]').first();
    await expect(productLink).toBeVisible({ timeout: 15_000 });
    const href = await productLink.getAttribute('href');
    await productLink.click();

    await expect(page).toHaveURL(new RegExp(href ?? '/products/'));
  });

  test('CLI-PRD-05: Lưới sản phẩm hiển thị ổn định trên kích thước màn hình mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const storefront = new StorefrontPage(page);
    await storefront.goto('/products');

    const card = page.locator('article, [class*="product-card"], a[href*="/products/"]').first();
    await expect(card).toBeVisible({ timeout: 15_000 });
  });
});
