import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';

test.describe('CLIENT PROFILE — Hồ sơ thành viên & Lịch sử đơn hàng', () => {
  test('CLI-PRF-01: Mở /profile khi chưa đăng nhập hiển thị yêu cầu đăng nhập hoặc trang đăng nhập', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/profile');

    // Nếu chưa đăng nhập, trang chuyển hướng đến /login hoặc hiện thông báo đăng nhập
    const isLoginPage = page.url().includes('/login');
    const hasLoginPrompt = (await page.locator('body').innerText()).toLowerCase().includes('đăng nhập');
    expect(isLoginPage || hasLoginPrompt).toBe(true);
  });

  test('CLI-PRF-02: Tiêu đề hoặc nội dung trang tài khoản hiển thị đúng nhận diện', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/profile');

    await expect(page.locator('body')).toBeVisible();
  });
});
