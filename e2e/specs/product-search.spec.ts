import { expect, test } from '@playwright/test';

/**
 * Hồi quy: ô tìm kiếm trên header từng chạy trên một danh sách sản phẩm viết cứng trong mã
 * nguồn, còn trang `/search` thì đọc `q` nhưng không truyền xuống nơi gọi API. Khách gõ gì
 * cũng ra cùng một danh sách, và bấm vào gợi ý thì rơi vào sản phẩm không tồn tại.
 */
test.describe('Tìm kiếm sản phẩm', () => {
  test('gợi ý lấy từ catalog thật', async ({ page }) => {
    await page.goto('/');

    const searchBox = page.getByLabel('Tìm kiếm sản phẩm').first();
    // "Bowflex" chỉ có trong catalog thật, không có trong danh sách viết cứng trước đây —
    // nên test này hỏng ngay nếu ai đó nối lại nguồn dữ liệu giả.
    await searchBox.fill('bowflex');

    await expect(page.getByText(/bowflex/i).first()).toBeVisible({ timeout: 15_000 });
  });

  test('trang kết quả lọc theo đúng từ khoá đã gõ', async ({ page }) => {
    await page.goto('/search?q=' + encodeURIComponent('tạ tay'));

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Trước đây trang bỏ qua `q` hoàn toàn nên luôn ra cùng một danh sách chung.
    await expect(page.getByText(/tạ tay/i).first()).toBeVisible({ timeout: 15_000 });
  });
});
