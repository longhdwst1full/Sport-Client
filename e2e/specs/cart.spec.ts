import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/cart.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { firstProduct } from '../fixtures/api';

test.describe('CART — Giỏ hàng', () => {
  test('CART-01: giỏ rỗng hiện trạng thái trống và lối quay lại mua sắm', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.open();

    await expect(cart.emptyState()).toBeVisible();
    await expect(cart.checkoutLink()).toHaveCount(0);
  });

  test('CART-02: thêm sản phẩm rồi mở giỏ thấy đúng dòng và tổng tiền', async ({
    page,
    request,
  }) => {
    const product = await firstProduct(request);
    const pdp = new ProductDetailPage(page);
    await pdp.open(product.slug);
    await pdp.clickAddToCart();

    const cart = new CartPage(page);
    await cart.open();

    await expect(page.getByText(product.name).first()).toBeVisible();
    await expect(cart.summaryTotal()).toBeVisible();
    await expect(cart.checkoutLink()).toBeVisible();
  });

  test('CART-03: tăng số lượng làm tổng tiền tăng', async ({ page, request }) => {
    const product = await firstProduct(request);
    const pdp = new ProductDetailPage(page);
    await pdp.open(product.slug);
    await pdp.clickAddToCart();

    const cart = new CartPage(page);
    await cart.open();
    const totalBefore = await page.locator('strong').last().innerText();

    await cart.increase().first().click();

    await expect.poll(async () => page.locator('strong').last().innerText()).not.toBe(totalBefore);
  });

  test('CART-04: xoá sản phẩm đưa giỏ về trạng thái trống', async ({ page, request }) => {
    const product = await firstProduct(request);
    const pdp = new ProductDetailPage(page);
    await pdp.open(product.slug);
    await pdp.clickAddToCart();

    const cart = new CartPage(page);
    await cart.open();
    await cart.remove().first().click();

    await expect(cart.emptyState()).toBeVisible();
  });

  test('CART-05: giỏ hàng còn nguyên sau khi tải lại trang', async ({ page, request }) => {
    const product = await firstProduct(request);
    const pdp = new ProductDetailPage(page);
    await pdp.open(product.slug);
    await pdp.clickAddToCart();

    const cart = new CartPage(page);
    await cart.open();
    await expect(page.getByText(product.name).first()).toBeVisible();

    await page.reload();

    await expect(page.getByText(product.name).first()).toBeVisible();
  });

  test('CART-06: số lượng trên header phản ánh giỏ', async ({ page, request }) => {
    const product = await firstProduct(request);
    const pdp = new ProductDetailPage(page);
    await pdp.open(product.slug);
    await pdp.clickAddToCart();
    await page.reload();

    await expect(page.locator('a[href="/cart"]').first()).not.toHaveAccessibleName(
      /0 sản phẩm/,
    );
  });
});
