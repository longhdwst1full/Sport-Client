import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';

test.describe('CLIENT AUTH — Đăng nhập & Đăng ký', () => {
  test('CLI-AUTH-01: Mở trang /login hiển thị form đăng nhập với các trường email/SĐT và mật khẩu', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/login');

    await expect(page.getByRole('heading', { name: /Đăng nhập/i })).toBeVisible();
    await expect(page.locator('input[name="identifier"], input[type="text"], input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Đăng nhập/i })).toBeVisible();
  });

  test('CLI-AUTH-02: Validate form khi submit trống', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/login');

    const submitBtn = page.getByRole('button', { name: /Đăng nhập/i });
    await submitBtn.click();

    // Thông báo lỗi validation hiển thị
    await expect(page.locator('text=/bắt buộc|Nhập mật khẩu|Nhập email|vui lòng/i').first()).toBeVisible();
  });

  test('CLI-AUTH-03: Có liên kết chuyển qua trang đăng ký từ login', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/login');

    const registerLink = page.getByRole('link', { name: /Đăng ký/i }).first();
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('CLI-AUTH-04: Mở trang /register hiển thị form đăng ký tài khoản', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/register');

    await expect(page.getByRole('heading', { name: /Đăng ký/i })).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });
});
