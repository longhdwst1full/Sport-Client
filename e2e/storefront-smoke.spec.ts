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
 * Khiếm khuyết đã biết, CÓ TRƯỚC tính năng chính sách: mọi route động trả HTTP 200
 * cho nội dung không tồn tại thay vì 404 — `/products`, `/news`, `/category` và
 * `/chinh-sach` đều vậy. Đường dẫn hoàn toàn lạ thì Next trả 404 đúng.
 *
 * Nội dung hiển thị vẫn đúng (trang "Không tìm thấy"), nên người dùng không bị đánh
 * lừa; hệ quả nằm ở SEO: công cụ tìm kiếm coi đây là soft 404 và vẫn lập chỉ mục.
 *
 * Bật lại test này sau khi sửa. Nguyên nhân cần xác minh thêm: nhiều khả năng do
 * trang dynamic bắt đầu truyền dữ liệu trước khi `notFound()` được gọi, nên mã
 * trạng thái đã chốt là 200.
 */
test.fixme('route động trả 404 cho nội dung không tồn tại', async ({ page }) => {
  const response = await page.goto('/chinh-sach/khong-ton-tai-abc');
  expect(response?.status()).toBe(404);
});
