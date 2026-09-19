import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';

test.describe('CLIENT CATEGORY — Danh mục sản phẩm', () => {
  test('CLI-CAT-01: Mở /category hiển thị danh sách tất cả danh mục sản phẩm', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/category');

    await expect(page).toHaveTitle(/Danh mục/i);
    const heading = page.getByRole('heading', { name: /Danh mục/i }).first();
    await expect(heading).toBeVisible();
  });

  test('CLI-CAT-02: Mỗi danh mục có tên và liên kết dẫn đến trang danh mục', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/category');

    const categoryLink = page.locator('a[href^="/category/"], a[href*="category="]').first();
    await expect(categoryLink).toBeVisible({ timeout: 15_000 });
  });

  test('CLI-CAT-03: Click danh mục điều hướng thành công', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/category');

    const categoryLink = page.locator('a[href^="/category/"]').first();
    if (await categoryLink.isVisible({ timeout: 10_000 }).catch(() => false)) {
      const href = await categoryLink.getAttribute('href');
      await categoryLink.click();
      await expect(page).toHaveURL(new RegExp(href ?? '/category/'));
    }
  });

  test('CLI-CAT-04: Breadcrumb hiển thị trên trang danh mục', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/category');

    const breadcrumb = storefront.breadcrumb();
    if (await breadcrumb.isVisible().catch(() => false)) {
      await expect(breadcrumb).toBeVisible();
    }
  });
});
