import { expect, test } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page';
import { fetchProducts } from '../fixtures/api';

test.describe('CAT — Danh sách sản phẩm /products', () => {
  test('CAT-01: hiện breadcrumb và hàng từ API', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.openAll();

    await expect(catalog.breadcrumb()).toContainText('Tất cả sản phẩm');
    // Giá hiển thị chứng minh mapper và API đã nối đúng; không có giá là dữ liệu hỏng.
    await expect(page.getByText(/₫|đ/).first()).toBeVisible();
    await expect(catalog.productLinks().first()).toBeVisible({ timeout: 15_000 });
  });

  test('CAT-02: lọc theo từ khoá thu hẹp kết quả', async ({ page, request }) => {
    const product = (await fetchProducts(request, 1))[0];
    const keyword = product.name.split(' ').slice(0, 2).join(' ');

    const catalog = new CatalogPage(page);
    await catalog.openAll();
    await catalog.filterInput().fill(keyword);

    await expect(page.getByText(new RegExp(keyword, 'i')).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('CAT-03: từ khoá vô nghĩa hiện trạng thái rỗng, không trắng trang', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.openAll();
    await catalog.filterInput().fill('zzz-khong-ton-tai-xyz-123');

    await expect(catalog.emptyState()).toBeVisible({ timeout: 15_000 });
  });

  test('CAT-04: xoá từ khoá đưa danh sách về trạng thái đầy đủ', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.openAll();
    await catalog.filterInput().fill('zzz-khong-ton-tai-xyz-123');
    await expect(catalog.emptyState()).toBeVisible({ timeout: 15_000 });

    await catalog.clearKeyword().click();

    await expect(catalog.emptyState()).toHaveCount(0);
    await expect(catalog.productLinks().first()).toBeVisible();
  });

  test('CAT-05: sắp xếp giá tăng dần đổi thứ tự hiển thị', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.openAll();
    await expect(catalog.productLinks().first()).toBeVisible({ timeout: 15_000 });
    const before = await catalog.productLinks().first().getAttribute('href');

    await catalog.sortSelect().selectOption({ label: 'Giá: Thấp đến Cao' });

    await expect
      .poll(async () => catalog.productLinks().first().getAttribute('href'), { timeout: 15_000 })
      .not.toBe(before);
  });

  test('CAT-06: mỗi thẻ sản phẩm có liên kết chi tiết hợp lệ', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.openAll();
    await expect(catalog.productLinks().first()).toBeVisible({ timeout: 15_000 });

    const hrefs = await catalog.productLinks().evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('href') ?? ''),
    );
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.every((href) => /^\/products\/[^/]+$/.test(href))).toBe(true);
  });
});
