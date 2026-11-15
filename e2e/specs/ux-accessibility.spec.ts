import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { ProductListResponseDto } from '../../src/generated/api/catalog/catalog.schemas';

// Chỉ fixture browser GET, không tạo sản phẩm/giỏ/đơn trên DB dùng chung.
// SSR vẫn dùng backend thật; khi lỗi, client island retry nhận fixture để kiểm đúng thẻ có dữ liệu.
const catalog = {
  items: [
    { id: '900001', productNo: 'A11Y-1', name: 'Sản phẩm kiểm tra tương phản', slug: 'a11y-contrast', brand: 'Thương hiệu kiểm thử',
      primaryCategory: 'Kiểm thử', productType: 'STANDARD', status: 'PUBLISHED', isPublished: true, version: 1,
      defaultVariantId: '900002', defaultVariantSku: 'A11Y-SKU', minPrice: '100000', currency: 'VND', imageUrl: null, inStock: true },
    { id: '900003', productNo: 'A11Y-2', name: 'Sản phẩm chưa có bảng giá', slug: 'a11y-no-price', brand: 'Thương hiệu kiểm thử',
      primaryCategory: 'Kiểm thử', productType: 'STANDARD', status: 'PUBLISHED', isPublished: true, version: 1,
      minPrice: null, currency: 'VND', imageUrl: null, inStock: true },
  ], meta: { page: 1, limit: 12, total: 2, totalPages: 1 },
} satisfies ProductListResponseDto;

for (const width of [390, 1440]) {
  test(`Product card contrast with controlled data @${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**/api/v1/catalog/products?**', (route) => route.fulfill({ json: catalog }));
    await page.goto('/products');
    await expect(page.getByRole('link', { name: 'Sản phẩm kiểm tra tương phản', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sản phẩm chưa có bảng giá', exact: true })).toBeVisible();
    const cards = page.locator('main article');
    await expect(cards).toHaveCount(2);
    const results = await new AxeBuilder({ page }).include('main article').withRules(['color-contrast']).analyze();
    expect(results.violations).toEqual([]);
    await expect(cards.last().getByText('Liên hệ tư vấn')).toHaveCSS('color', 'rgb(82, 82, 82)');
  });
}

test('Mobile search disclosure focuses input and Escape restores trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/products');
  const trigger = page.getByRole('button', { name: 'Tìm sản phẩm', exact: true });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const input = page.locator('#mobile-search-panel').getByRole('combobox');
  await expect(input).toBeFocused();
  await input.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
});
