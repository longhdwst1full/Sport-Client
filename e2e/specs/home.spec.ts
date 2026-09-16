import { expect, test } from '@playwright/test';
import { StorefrontPage } from '../pages/storefront.page';
import { fetchCategories } from '../fixtures/api';

test.describe('HOME — Trang chủ', () => {
  test('HOME-01: mở được và có điều hướng chính', async ({ page }) => {
    const home = new StorefrontPage(page);
    await home.goto('/');

    await expect(page).toHaveTitle(/Bảo An Sport/i);
    await expect(home.mainNav()).toBeVisible();
  });

  test('HOME-02: rail danh mục lấy từ API, không phải dữ liệu viết cứng', async ({
    page,
    request,
  }) => {
    const categories = await fetchCategories(request);
    test.skip(categories.length === 0, 'Môi trường chưa có danh mục đang bán.');

    const home = new StorefrontPage(page);
    await home.goto('/');

    // Rail chỉ hiện một phần danh mục, nên chỉ cần chứng minh tên hiển thị đến
    // từ API chứ không phải danh sách viết cứng trong mã nguồn.
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const text = (await body.innerText()).toLowerCase();
    const matched = categories.filter((c) => text.includes(c.name.toLowerCase()));
    expect(matched.length).toBeGreaterThan(0);
  });

  test('HOME-03: lưới sản phẩm có nút thêm vào giỏ', async ({ page }) => {
    const home = new StorefrontPage(page);
    await home.goto('/');

    await expect(home.addToCartCards().first()).toBeVisible({ timeout: 15_000 });
  });

  test('HOME-04: bấm tab danh mục vẫn còn sản phẩm', async ({ page }) => {
    // Hồi quy: tab từng dùng id tự đặt ('gym', 'cardio') so với tên danh mục thật
    // trả về từ API, hai vế không bao giờ bằng nhau nên bấm tab nào cũng ra rỗng.
    const home = new StorefrontPage(page);
    await home.goto('/');

    const tab = page.getByRole('button', { name: /Dụng Cụ|Máy Tập/ }).first();
    await expect(tab).toBeVisible({ timeout: 15_000 });
    await tab.click();

    await expect(home.addToCartCards().first()).toBeVisible({ timeout: 15_000 });
  });

  test('HOME-05: có liên kết tới giỏ hàng trên header', async ({ page }) => {
    const home = new StorefrontPage(page);
    await home.goto('/');

    await expect(home.cartLink()).toHaveAttribute('href', '/cart');
  });

  test('HOME-06: thẻ sản phẩm dẫn tới trang chi tiết thật', async ({ page }) => {
    const home = new StorefrontPage(page);
    await home.goto('/');

    const link = page.locator('a[href^="/products/"]').first();
    await expect(link).toBeVisible({ timeout: 15_000 });
    const href = await link.getAttribute('href');
    const response = await page.goto(href!);
    expect(response?.status()).toBe(200);
  });
});
