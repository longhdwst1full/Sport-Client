import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';

test.describe('CLIENT UI — Hero Banner & Highlights', () => {
  test('CLI-HERO-01: Banner hero hiển thị nổi bật trên trang chủ', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const hero = page.locator('section, div').filter({ hasText: /Thể thao|Bảo An|Chính hãng|Đỉnh cao/i }).first();
    await expect(hero).toBeVisible({ timeout: 15_000 });
  });

  test('CLI-HERO-02: Hero banner có tiêu đề hoặc khẩu hiệu thể thao', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('CLI-HERO-03: Hero banner có nút CTA dẫn tới sản phẩm hoặc mua sắm', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const cta = page.getByRole('link', { name: /Khám phá|Mua ngay|Xem ngay|Sản phẩm/i }).first();
    await expect(cta).toBeVisible();
  });

  test('CLI-HERO-04: Khối cam kết dịch vụ (giao hàng, chính hãng, đổi trả) hiển thị', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    const hasServiceCommitment =
      bodyText.includes('chính hãng') ||
      bodyText.includes('giao hàng') ||
      bodyText.includes('đổi trả') ||
      bodyText.includes('bảo hành');
    expect(hasServiceCommitment).toBe(true);
  });

  test('CLI-HERO-05: Danh mục nổi bật hiển thị trên trang chủ', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const categorySection = page.locator('nav, section, div').filter({ hasText: /Danh mục|Nổi bật/i }).first();
    await expect(categorySection).toBeVisible();
  });
});
