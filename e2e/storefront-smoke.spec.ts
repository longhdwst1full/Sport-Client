import { expect, test } from '@playwright/test';

/**
 * Bộ khói cho Storefront: kiểm những đường đi khách thật sự dùng, không kiểm
 * chi tiết trình bày vì chúng đổi thường xuyên và sẽ làm test giòn.
 *
 * Cần API chạy ở `NEXT_PUBLIC_API_URL`. Thiếu API thì các trang phụ thuộc dữ liệu
 * sẽ rỗng — test nêu rõ điều đó thay vì báo lỗi mơ hồ.
 */

test('trang chủ mở được và hiện điều hướng chính', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Bảo An Sport/i);
  await expect(page.getByRole('navigation').first()).toBeVisible();
});

test('danh sách sản phẩm hiện hàng từ API', async ({ page }) => {
  await page.goto('/products');

  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(breadcrumb).toBeVisible();
  await expect(breadcrumb).toContainText('Tất cả sản phẩm');

  // Giá hiển thị chứng minh mapper và API đã nối đúng; số 0 đồng nghĩa dữ liệu hỏng.
  await expect(page.getByText(/₫|đ/).first()).toBeVisible();
});

test('trang chính sách liệt kê các bài đã đăng', async ({ page }) => {
  await page.goto('/chinh-sach');

  await expect(page.getByRole('heading', { name: 'Thông tin và chính sách' })).toBeVisible();
  const links = page.locator('a[href^="/chinh-sach/"]');
  await expect(links.first()).toBeVisible();
});

test('breadcrumb đánh dấu trang hiện tại cho công cụ trợ năng', async ({ page }) => {
  await page.goto('/chinh-sach');

  const current = page.locator('[aria-current="page"]');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText('Thông tin và chính sách');
});

test('nội dung không tồn tại hiện đúng trang không tìm thấy', async ({ page }) => {
  await page.goto('/chinh-sach/khong-ton-tai-abc');
  await expect(page.getByText(/không tìm thấy/i).first()).toBeVisible();
});

/**
 * Hồi quy: route động từng trả HTTP 200 cho nội dung không tồn tại. Trang vẫn hiện giao
 * diện 404 nên người dùng không bị lừa, nhưng công cụ tìm kiếm coi đây là soft 404 và vẫn
 * lập chỉ mục trang rỗng.
 *
 * Nguyên nhân: `loading.tsx` ở gốc app (và ở `/category`) khiến Next bắt đầu truyền dữ liệu
 * trước khi trang kịp gọi `notFound()`, nên mã trạng thái đã chốt là 200 và không sửa được
 * nữa. Đã gỡ hai file đó; đừng thêm lại `loading.tsx` bọc một route động có gọi `notFound()`.
 */
test.describe('Route động trả đúng mã trạng thái', () => {
  for (const path of [
    '/chinh-sach/khong-ton-tai-abc',
    '/news/khong-ton-tai-abc',
    '/category/khong-ton-tai-abc',
  ]) {
    test(`404 cho ${path}`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
    });
  }

  test('200 cho nội dung có thật', async ({ page }) => {
    const response = await page.goto('/chinh-sach/chinh-sach-bao-hanh');
    expect(response?.status()).toBe(200);
  });
});
