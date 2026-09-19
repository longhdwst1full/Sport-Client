import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';

test.describe('CLIENT NEWS — Tin tức & Kiến thức thể thao', () => {
  test('CLI-NEWS-01: Mở /news hiển thị trang tin tức', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/news');

    await expect(page).toHaveTitle(/Tin tức|Kiến thức/i);
    const heading = page.getByRole('heading', { name: /Tin tức|Kiến thức|Bài viết/i }).first();
    await expect(heading).toBeVisible();
  });

  test('CLI-NEWS-02: Danh sách bài viết hiển thị các thẻ bài viết', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/news');

    const articles = page.locator('article, a[href^="/news/"]');
    if (await articles.count() > 0) {
      await expect(articles.first()).toBeVisible();
    }
  });

  test('CLI-NEWS-03: Click bài viết điều hướng đến trang chi tiết bài viết', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/news');

    const postLink = page.locator('a[href^="/news/"]').first();
    if (await postLink.isVisible().catch(() => false)) {
      const href = await postLink.getAttribute('href');
      await postLink.click();
      await expect(page).toHaveURL(new RegExp(href ?? '/news/'));
    }
  });
});
