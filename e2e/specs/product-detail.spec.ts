import { expect, test } from '@playwright/test';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CartPage } from '../pages/cart.page';
import { firstProduct } from '../fixtures/api';

test.describe('PDP — Chi tiết sản phẩm', () => {
  test('PDP-01: render tên, breadcrumb và giá từ API', async ({ page, request }) => {
    const product = await firstProduct(request);
    const pdp = new ProductDetailPage(page);
    await pdp.open(product.slug);

    await expect(pdp.title()).toContainText(product.name);
    await expect(pdp.breadcrumb()).toBeVisible();
    await expect(page.getByText(/₫|đ/).first()).toBeVisible();
  });

  test('PDP-02: metadata title lấy từ sản phẩm thật', async ({ page, request }) => {
    const product = await firstProduct(request);
    await page.goto(`/products/${product.slug}`);

    await expect(page).toHaveTitle(new RegExp(product.name.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  });

  test('PDP-03: tăng/giảm số lượng có chặn dưới', async ({ page, request }) => {
    const product = await firstProduct(request);
    const pdp = new ProductDetailPage(page);
    await pdp.open(product.slug);

    await pdp.increaseQty().click();
    await pdp.increaseQty().click();
    await expect(page.getByText('3', { exact: true }).first()).toBeVisible();

    await pdp.decreaseQty().click();
    await pdp.decreaseQty().click();
    await pdp.decreaseQty().click();
    // Không cho xuống 0: số lượng nhỏ nhất bán được là 1.
    await expect(page.getByText('0', { exact: true })).toHaveCount(0);
  });

  test('PDP-04: thêm vào giỏ hiện xác nhận và cập nhật giỏ', async ({ page, request }) => {
    const product = await firstProduct(request);
    const pdp = new ProductDetailPage(page);
    await pdp.open(product.slug);

    await pdp.addToCart().click();
    await expect(pdp.addedNotice()).toBeVisible();

    const cart = new CartPage(page);
    await cart.open();
    await expect(page.getByText(product.name).first()).toBeVisible();
  });

  test('PDP-05: mua ngay đưa thẳng sang giỏ/thanh toán', async ({ page, request }) => {
    const product = await firstProduct(request);
    const pdp = new ProductDetailPage(page);
    await pdp.open(product.slug);

    await pdp.buyNow().click();
    await expect(page).toHaveURL(/\/(cart|checkout)/);
  });

  test('PDP-06: slug không tồn tại trả HTTP 404', async ({ page }) => {
    const response = await page.goto('/products/khong-ton-tai-abc-xyz');
    expect(response?.status()).toBe(404);
  });

  test('PDP-07: có khối sản phẩm liên quan', async ({ page, request }) => {
    const product = await firstProduct(request);
    const pdp = new ProductDetailPage(page);
    await pdp.open(product.slug);

    const related = page.locator('a[href^="/products/"]');
    await expect(related.first()).toBeVisible({ timeout: 15_000 });
  });
});
