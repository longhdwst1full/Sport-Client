import { expect, test } from '@playwright/test';

/**
 * Hồi quy: tab lọc trên lưới trưng bày từng dùng danh sách viết cứng với id tự đặt
 * ('gym', 'cardio'...) rồi so với tên danh mục thật trả về từ API ('Dụng Cụ Tập Gym').
 * Hai vế không bao giờ bằng nhau nên bấm tab nào cũng ra danh sách rỗng.
 */

/** Trang chủ có hộp thoại khuyến mãi che nội dung; đóng trước khi thao tác. */
async function dismissOverlay(page: import('@playwright/test').Page) {
  const dialog = page.getByRole('dialog');
  if (await dialog.isVisible().catch(() => false)) {
    await page.getByLabel('Đóng thông báo').click().catch(() => undefined);
    await dialog.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
  }
}

test('bấm tab danh mục vẫn còn sản phẩm', async ({ page }) => {
  await page.goto('/');
  await dismissOverlay(page);

  // Tab dựng từ danh mục thật nên nhãn là tên danh mục, không phải nhãn tự đặt.
  const tab = page.getByRole('button', { name: /Dụng Cụ|Máy Tập/ }).first();
  await expect(tab).toBeVisible({ timeout: 15_000 });
  await tab.click();

  // Sau khi lọc vẫn phải còn hàng; trước đây lưới rỗng hoàn toàn.
  await expect(page.getByRole('button', { name: /Thêm .* vào giỏ/ }).first()).toBeVisible({
    timeout: 15_000,
  });
});

test('nút thêm vào giỏ không nằm trong thẻ liên kết', async ({ page }) => {
  await page.goto('/');
  await dismissOverlay(page);
  await expect(page.getByRole('button', { name: /Thêm .* vào giỏ/ }).first()).toBeVisible({
    timeout: 15_000,
  });

  // HTML lồng <button> trong <a> là không hợp lệ và làm bàn phím kích hoạt nhầm.
  const nested = await page.locator('a button').count();
  expect(nested).toBe(0);
});
