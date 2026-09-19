import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';

test.describe('CLIENT UI — Header & Navigation', () => {
  test('CLI-HDR-01: Header hiển thị logo thương hiệu Bảo An Sport', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const logo = page.locator('header').getByRole('link').filter({ hasText: /Bảo An|Sport/i }).first();
    await expect(logo).toBeVisible();
  });

  test('CLI-HDR-02: Thanh điều hướng chính (nav) có các liên kết cơ bản', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const nav = storefront.mainNav();
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: /Trang chủ|Sản phẩm/i }).first()).toBeVisible();
  });

  test('CLI-HDR-03: Ô tìm kiếm sản phẩm có thể tương tác', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const search = storefront.searchBox();
    await expect(search).toBeVisible();
    await search.fill('giày');
    await expect(search).toHaveValue('giày');
  });

  test('CLI-HDR-04: Icon giỏ hàng liên kết đến trang /cart', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const cartLink = storefront.cartLink();
    await expect(cartLink).toBeVisible();
    await expect(cartLink).toHaveAttribute('href', '/cart');
  });

  test('CLI-HDR-05: Header có liên kết đăng nhập / tài khoản', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const accountLink = page.locator('header').getByRole('link', { name: /Đăng nhập|Tài khoản|Đăng ký/i }).first();
    await expect(accountLink).toBeVisible();
  });
});
