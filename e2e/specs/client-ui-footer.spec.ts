import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';

test.describe('CLIENT UI — Footer & Policy Links', () => {
  test('CLI-FTR-01: Footer hiển thị tên thương hiệu hoặc bản quyền', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/Bảo An|Sport/i);
  });

  test('CLI-FTR-02: Footer hiển thị thông tin showroom hoặc địa chỉ', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/Hà Nội|Hồ Chí Minh|Showroom|Địa chỉ/i);
  });

  test('CLI-FTR-03: Footer có các liên kết chính sách', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const footer = page.locator('footer');
    const policyLink = footer.getByRole('link', { name: /Chính sách|Bảo hành|Đổi trả|Bảo mật/i }).first();
    await expect(policyLink).toBeVisible();
  });

  test('CLI-FTR-04: Footer có thông tin hotline / tổng đài hỗ trợ', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toContainText(/Hotline|Tổng đài|09/i);
  });

  test('CLI-FTR-05: Footer hiển thị phương thức thanh toán hoặc chứng nhận', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('svg, img, [class*="payment"], [class*="badge"]').first()).toBeVisible();
  });
});
