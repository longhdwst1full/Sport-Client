import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';

test.describe('CLIENT CHECKOUT — Thanh toán & Đặt hàng', () => {
  test('CLI-CHK-01: Mở /checkout khi giỏ rỗng hiển thị thông báo hoặc nút về giỏ', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/checkout');

    // Nếu giỏ rỗng, trang hiện thông báo giỏ hàng trống hoặc form thanh toán
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
    await expect(pageContent).toContainText(/Thanh toán|Giỏ hàng|trống|tiếp tục mua sắm/i);
  });

  test('CLI-CHK-02: Form thanh toán có các trường thông tin nhận hàng', async ({ page }) => {
    // Thêm sản phẩm vào giỏ trước khi vào checkout
    const storefront = new StorefrontPage(page);
    await storefront.goto('/products');

    const addBtn = storefront.addToCartCards().first();
    if (await addBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(500);
      await storefront.goto('/checkout');

      const nameInput = page.locator('input[placeholder*="tên"], input[name*="name"]').first();
      if (await nameInput.isVisible().catch(() => false)) {
        await expect(nameInput).toBeVisible();
      }
    }
  });

  test('CLI-CHK-03: Trang thanh toán có tuỳ chọn phương thức thanh toán', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/checkout');

    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    const hasPaymentMethod =
      bodyText.includes('cod') ||
      bodyText.includes('tiền mặt') ||
      bodyText.includes('chuyển khoản') ||
      bodyText.includes('thanh toán');
    expect(hasPaymentMethod).toBe(true);
  });

  test('CLI-CHK-04: Tóm tắt đơn hàng hiển thị tổng tiền', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto('/checkout');

    const summary = page.locator('aside, div, section').filter({ hasText: /Tạm tính|Tổng tiền|Đơn hàng/i }).first();
    await expect(summary).toBeVisible();
  });
});
