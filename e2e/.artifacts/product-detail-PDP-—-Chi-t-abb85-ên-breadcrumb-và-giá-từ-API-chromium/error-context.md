# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product-detail.spec.ts >> PDP — Chi tiết sản phẩm >> PDP-01: render tên, breadcrumb và giá từ API
- Location: e2e/specs/product-detail.spec.ts:7:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('heading', { level: 1 })
Expected substring: "Bàn bóng bàn Double Fish 233"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" getByRole('heading', { level: 1 }) with timeout 10000ms
  - waiting for getByRole('heading', { level: 1 })

```

```yaml
- banner:
  - text: "Showroom mở cửa 8:30 - 21:30 cả Chủ nhật Giao từ kho gần nhất · Giá hiển thị đã gồm VAT Miễn phí tư vấn không gian tập · Hotline: 0939 987 456 Đổi trả trong 7 ngày · Bảo hành chính hãng 2-5 năm"
  - link "Hệ thống Showroom":
    - /url: /contact
  - text: "|"
  - link "Tra cứu bảo hành":
    - /url: /profile
  - link "Bảo An Sport - Trang chủ":
    - /url: /
    - img "Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
  - img
  - combobox "Tìm kiếm sản phẩm"
  - button "Thực hiện tìm kiếm":
    - img
    - text: TÌM KIẾM
  - link "Gọi tư vấn":
    - /url: tel:0939987456
    - img
    - text: Hotline tư vấn
    - strong: 0939 987 456
  - link "Đăng nhập tài khoản":
    - /url: /login
    - img
  - link "Giỏ hàng, 0 sản phẩm":
    - /url: /cart
    - img
  - navigation "Điều hướng chính":
    - link "Dụng Cụ Bơi Lội":
      - /url: /category/dung-cu-boi-loi
      - text: Dụng Cụ Bơi Lội
      - img
    - link "Dụng Cụ Bóng Bàn":
      - /url: /category/dung-cu-bong-ban
      - text: Dụng Cụ Bóng Bàn
      - img
    - link "Dụng Cụ Bóng Chày":
      - /url: /category/dung-cu-bong-chay
      - text: Dụng Cụ Bóng Chày
      - img
    - link "Dụng Cụ Bóng Chuyền":
      - /url: /category/dung-cu-bong-chuyen
      - text: Dụng Cụ Bóng Chuyền
      - img
    - link "Dụng Cụ Bóng Đá":
      - /url: /category/dung-cu-bong-da
      - text: Dụng Cụ Bóng Đá
      - img
    - link "Dụng Cụ Bóng Rổ":
      - /url: /category/dung-cu-bong-ro
      - text: Dụng Cụ Bóng Rổ
      - img
    - link "Dụng Cụ Cầu Lông":
      - /url: /category/dung-cu-cau-long
      - text: Dụng Cụ Cầu Lông
      - img
    - link "Dụng cụ Pickleball":
      - /url: /category/dung-cu-pickleball
      - text: Dụng cụ Pickleball
      - img
    - link "⚡ Flash Sale -45%":
      - /url: /flash-sale
    - link "Combo Home Gym Hot":
      - /url: /#products
    - link "Cẩm nang tập luyện":
      - /url: /news
    - link "Hệ thống Showroom":
      - /url: /contact
      - img
      - text: Hệ thống Showroom
- main:
  - navigation "Breadcrumb":
    - list:
      - listitem:
        - link "Trang chủ":
          - /url: /
      - listitem:
        - link "Sản phẩm":
          - /url: /#products
      - listitem: Bàn bóng bàn Double Fish 233
  - main:
    - text: Hình ảnh sản phẩm Ảnh thực tế đã kiểm duyệt
    - img "Bàn bóng bàn Double Fish 233"
    - text: Có hỗ trợ xem sản phẩm tại showroom
    - heading "Mô tả sản phẩm" [level=2]
    - paragraph: Bàn bóng bàn Double Fish 233 chính hãng có mặt gỗ MDF cho độ nảy chuẩn, khung chắc chắn, gấp gọn tiện lợi. Mua tại Bảo An Sport giao hàng toàn quốc.
    - img
    - strong: Thiết kế công thái học
    - paragraph: Tay cầm tiện dụng, hạn chế mỏi cổ tay khi nâng tạ nặng.
    - img
    - strong: Bọc cao su đúc
    - paragraph: Bảo vệ bề mặt sàn gỗ, gạch hoa và chống nứt vỡ.
    - img
    - strong: Độ bền công nghiệp
    - paragraph: Chịu được hơn 100.000 chu kỳ tập luyện liên tục.
    - heading "Thông số kỹ thuật chi tiết" [level=2]
    - text: Thương hiệu OEM Phân loại Bàn Bóng Bàn Mã sản phẩm BAS-896 Số phiên bản 1 phiên bản
    - region "Đánh giá từ khách hàng":
      - heading "Đánh giá từ khách hàng" [level=2]
      - paragraph: Nhận xét về Bàn bóng bàn Double Fish 233 đã được kiểm duyệt trước khi hiển thị.
      - paragraph: Sản phẩm chưa có đánh giá nào được duyệt.
      - paragraph: Bạn đã mua sản phẩm này?
      - paragraph: Gọi 0939 987 456 để gửi đánh giá. Chúng tôi sẽ đăng sau khi kiểm duyệt.
    - region "Phiên bản / Quy cách":
      - text: Giá bán niêm yết (Đã gồm VAT)
      - strong: 24.000.000 ₫
      - text: 30.000.000 ₫ Tiết kiệm 20% Liên hệ cửa hàng để biết tình trạng hàng, thời gian giao và lắp đặt
      - separator
      - heading "Phiên bản / Quy cách" [level=2]
      - text: 1 lựa chọn có sẵn
      - 'button "Bàn bóng bàn Double Fish 233 Mã SKU: 233 24.000.000 ₫" [pressed]':
        - img
        - text: "Bàn bóng bàn Double Fish 233 Mã SKU: 233"
        - strong: 24.000.000 ₫
      - text: "Số lượng:"
      - button [disabled]:
        - img
      - text: "1"
      - button:
        - img
      - img
      - text: "Quà tặng độc quyền theo đơn hàng: 🎁 Găng tay thể hình Bảo An Pro Grip Trị giá 350.000đ (0đ) 🎁 Thảm cao su giảm chấn sàn EPDM 15mm Trị giá 450.000đ (0đ) 🎁 Bình nước thể thao Inox Bảo An giữ nhiệt 24h Trị giá 250.000đ (0đ)"
      - paragraph: "* Quà tặng tự động đóng gói cùng kiện hàng chính khi xuất kho."
      - img
      - text: Hỗ trợ trả góp 0% lãi suất Chỉ từ ~490.000đ/tháng
      - button "Thêm vào giỏ":
        - img
        - text: Thêm vào giỏ
      - button "Mua ngay":
        - img
        - text: Mua ngay
      - img
      - strong: Giao nhanh 2 Giờ
      - text: Nội thành Hà Nội & TP.HCM
      - img
      - strong: Lắp đặt tại nhà
      - text: Kỹ thuật viên chuyên nghiệp
      - img
      - strong: Bảo hành 24 Tháng
      - text: Chính hãng tại nhà khách
      - img
      - strong: Đổi mới 7 Ngày
      - text: Lỗi 1 đổi 1 tận nơi
  - heading "Sản phẩm liên quan" [level=2]
  - paragraph: Thiết bị cùng nhóm được khách xem nhiều.
  - link "Xem tất cả":
    - /url: /products
    - text: Xem tất cả
    - img
  - article:
    - link "Ghế trọng tài bóng bàn 302359 Phụ Kiện Bóng Bàn":
      - /url: /products/ghe-trong-tai-bong-ban-302359
      - img "Ghế trọng tài bóng bàn 302359"
      - text: Phụ Kiện Bóng Bàn
    - paragraph: OEM
    - heading "Ghế trọng tài bóng bàn 302359" [level=3]:
      - link "Ghế trọng tài bóng bàn 302359":
        - /url: /products/ghe-trong-tai-bong-ban-302359
    - strong: 3.040.000 ₫
    - button "Thêm vào giỏ":
      - img
      - text: Thêm vào giỏ
  - article:
    - link "Ring chắn bóng bàn nhập khẩu Phụ Kiện Bóng Bàn":
      - /url: /products/ring-chan-bong-ban-nhap-khau
      - img "Ring chắn bóng bàn nhập khẩu"
      - text: Phụ Kiện Bóng Bàn
    - paragraph: OEM
    - heading "Ring chắn bóng bàn nhập khẩu" [level=3]:
      - link "Ring chắn bóng bàn nhập khẩu":
        - /url: /products/ring-chan-bong-ban-nhap-khau
    - strong: 400.000 ₫
    - button "Thêm vào giỏ":
      - img
      - text: Thêm vào giỏ
  - article:
    - link "Ring chắn bóng bàn 301358 Phụ Kiện Bóng Bàn":
      - /url: /products/ring-chan-bong-ban-301358
      - img "Ring chắn bóng bàn 301358"
      - text: Phụ Kiện Bóng Bàn
    - paragraph: OEM
    - heading "Ring chắn bóng bàn 301358" [level=3]:
      - link "Ring chắn bóng bàn 301358":
        - /url: /products/ring-chan-bong-ban-301358
    - strong: 750.000 ₫
    - button "Thêm vào giỏ":
      - img
      - text: Thêm vào giỏ
  - article:
    - link "Keo dán vợt bóng bàn Haifu Phụ Kiện Bóng Bàn":
      - /url: /products/keo-dan-vot-bong-ban-haifu
      - img "Keo dán vợt bóng bàn Haifu"
      - text: Phụ Kiện Bóng Bàn
    - paragraph: OEM
    - heading "Keo dán vợt bóng bàn Haifu" [level=3]:
      - link "Keo dán vợt bóng bàn Haifu":
        - /url: /products/keo-dan-vot-bong-ban-haifu
    - strong: 100.000 ₫
    - button "Thêm vào giỏ":
      - img
      - text: Thêm vào giỏ
- img
- heading "Nhận ưu đãi độc quyền & kiến thức thể thao" [level=2]
- paragraph: Đăng ký email để nhận thông tin sản phẩm mới, combo thiết bị giảm giá và bài viết hướng dẫn tập luyện từ HLV.
- textbox "Email của bạn"
- button "Đăng ký"
- paragraph: Chúng tôi cam kết bảo mật thông tin. Bạn có thể hủy nhận tin bất cứ lúc nào.
- contentinfo:
  - img "Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
  - paragraph: Bảo An Sport chuyên cung cấp dụng cụ thể thao, thiết bị Gym, máy tập thể hình và phụ kiện chính hãng. Mẫu mã đa dạng, giao hàng toàn quốc, tư vấn tận tâm.
  - text: "Thông tin đăng ký doanh nghiệp:"
  - paragraph:
    - text: Giấy chứng nhận ĐKKD số
    - strong: 01M8027099
    - text: do phòng Tài chính - Kế hoạch quận Hoàng Mai, TP. Hà Nội cấp ngày 01/03/2021.
  - link "Đã thông báo Bộ Công Thương Bộ Công Thương Đã thông báo website TMĐT":
    - /url: http://online.gov.vn/Home/WebDetails/79482?AspxAutoDetectCookieSupport=1
    - img "Đã thông báo Bộ Công Thương"
    - text: Bộ Công Thương Đã thông báo website TMĐT
  - link "Facebook":
    - /url: https://www.facebook.com/baoansportvn/
    - img
  - link "YouTube":
    - /url: https://www.youtube.com/@baoansport
    - img
  - link "Zalo":
    - /url: https://zalo.me/0939987456
    - img
  - heading "Sản phẩm nổi bật" [level=2]
  - link "Tạ tay - Tạ đơn":
    - /url: /category/ta-tay
  - link "Xà đơn - Xà kép":
    - /url: /category/xa-don-xa-kep
  - link "Ghế tập tạ đa năng":
    - /url: /category/ghe-tap-ta
  - link "Giàn tạ đa năng":
    - /url: /category/gian-ta-da-nang
  - link "Bàn bóng bàn thi đấu":
    - /url: /category/dung-cu-bong-ban
  - link "Máy chạy bộ điện":
    - /url: /category/may-chay-bo
  - link "Xe đạp tập thể dục":
    - /url: /category/xe-dap-tap
  - heading "Thông tin & Chính sách" [level=2]
  - link "Giới thiệu Bảo An Sport":
    - /url: /#about
  - link "Cam kết khách hàng":
    - /url: /chinh-sach/cam-ket-khach-hang
  - link "Cẩm nang & Hướng dẫn tập luyện":
    - /url: /news
  - link "Vận chuyển & giao hàng":
    - /url: /chinh-sach/van-chuyen-giao-hang
  - link "Chính sách bảo hành":
    - /url: /chinh-sach/chinh-sach-bao-hanh
  - link "Chính sách đổi trả":
    - /url: /chinh-sach/chinh-sach-doi-tra
  - link "Bảo mật thông tin khách hàng":
    - /url: /chinh-sach/bao-mat-thong-tin-khach-hang
  - link "Tất cả thông tin & chính sách":
    - /url: /chinh-sach
  - heading "Hệ thống Showroom" [level=2]
  - strong:
    - img
    - text: SHOWROOM HÀ NỘI
  - text: Trụ sở
  - paragraph: Số 234 Định Công, Phường Định Công, Quận Hoàng Mai, Hà Nội
  - 'link "Hotline: 0939 987 456"':
    - /url: tel:0939987456
    - img
    - text: "Hotline: 0939 987 456"
  - strong:
    - img
    - text: SHOWROOM TP. HỒ CHÍ MINH
  - text: Chi nhánh
  - paragraph: Số 34 Đường số 2, Phường 11, Cư xá Đài Ra Đa, Quận 6, TP. Hồ Chí Minh
  - 'link "Hotline: 0969 131 990"':
    - /url: tel:0969131990
    - img
    - text: "Hotline: 0969 131 990"
  - 'link "Email: info@baoansport.vn"':
    - /url: mailto:info@baoansport.vn
    - img
    - text: "Email: info@baoansport.vn"
  - paragraph: "Mở cửa: 08:30 - 21:30 tất cả các ngày trong tuần (kể cả T7 & CN)"
  - img
  - text: Hàng chính hãng 100%
  - img
  - text: Giao hàng & Lắp ráp 2H
  - img
  - text: "Thanh toán an toàn 100% VISA MASTER VietQR MOMO COD TRẢ GÓP 0% © 2026 Bảo An Sport. Chuyên cung cấp dụng cụ thể thao, thiết bị thể dục và thể hình chính hãng uy tín toàn quốc. Thời gian phục vụ: 08:30 - 21:30 tất cả các ngày trong tuần"
- link "Tư vấn Zalo":
  - /url: https://zalo.me/0939987456
  - text: "Chat Zalo: 0939 987 456"
  - img
- link "Gọi tổng đài tư vấn":
  - /url: tel:0939987456
  - text: "Hotline: 0939 987 456"
  - img
- link "Tìm Showroom gần nhất":
  - /url: /contact
  - text: Showroom Bảo An Sport
  - img
- complementary "Thông báo hệ thống"
- alert
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | import { ProductDetailPage } from '../pages/product-detail.page';
  3  | import { CartPage } from '../pages/cart.page';
  4  | import { firstProduct } from '../fixtures/api';
  5  | 
  6  | test.describe('PDP — Chi tiết sản phẩm', () => {
  7  |   test('PDP-01: render tên, breadcrumb và giá từ API', async ({ page, request }) => {
  8  |     const product = await firstProduct(request);
  9  |     const pdp = new ProductDetailPage(page);
  10 |     await pdp.open(product.slug);
  11 | 
> 12 |     await expect(pdp.title()).toContainText(product.name);
     |                               ^ Error: expect(locator).toContainText(expected) failed
  13 |     await expect(pdp.breadcrumb()).toBeVisible();
  14 |     await expect(page.getByText(/₫|đ/).first()).toBeVisible();
  15 |   });
  16 | 
  17 |   test('PDP-02: metadata title lấy từ sản phẩm thật', async ({ page, request }) => {
  18 |     const product = await firstProduct(request);
  19 |     await page.goto(`/products/${product.slug}`);
  20 | 
  21 |     await expect(page).toHaveTitle(new RegExp(product.name.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  22 |   });
  23 | 
  24 |   test('PDP-03: tăng/giảm số lượng có chặn dưới', async ({ page, request }) => {
  25 |     const product = await firstProduct(request);
  26 |     const pdp = new ProductDetailPage(page);
  27 |     await pdp.open(product.slug);
  28 | 
  29 |     await pdp.increaseQty().click();
  30 |     await pdp.increaseQty().click();
  31 |     await expect(page.getByText('3', { exact: true }).first()).toBeVisible();
  32 | 
  33 |     await pdp.decreaseQty().click();
  34 |     await pdp.decreaseQty().click();
  35 |     await pdp.decreaseQty().click();
  36 |     // Không cho xuống 0: số lượng nhỏ nhất bán được là 1.
  37 |     await expect(page.getByText('0', { exact: true })).toHaveCount(0);
  38 |   });
  39 | 
  40 |   test('PDP-04: thêm vào giỏ hiện xác nhận và cập nhật giỏ', async ({ page, request }) => {
  41 |     const product = await firstProduct(request);
  42 |     const pdp = new ProductDetailPage(page);
  43 |     await pdp.open(product.slug);
  44 | 
  45 |     await pdp.addToCart().click();
  46 |     await expect(pdp.addedNotice()).toBeVisible();
  47 | 
  48 |     const cart = new CartPage(page);
  49 |     await cart.open();
  50 |     await expect(page.getByText(product.name).first()).toBeVisible();
  51 |   });
  52 | 
  53 |   test('PDP-05: mua ngay đưa thẳng sang giỏ/thanh toán', async ({ page, request }) => {
  54 |     const product = await firstProduct(request);
  55 |     const pdp = new ProductDetailPage(page);
  56 |     await pdp.open(product.slug);
  57 | 
  58 |     await pdp.buyNow().click();
  59 |     await expect(page).toHaveURL(/\/(cart|checkout)/);
  60 |   });
  61 | 
  62 |   test('PDP-06: slug không tồn tại trả HTTP 404', async ({ page }) => {
  63 |     const response = await page.goto('/products/khong-ton-tai-abc-xyz');
  64 |     expect(response?.status()).toBe(404);
  65 |   });
  66 | 
  67 |   test('PDP-07: có khối sản phẩm liên quan', async ({ page, request }) => {
  68 |     const product = await firstProduct(request);
  69 |     const pdp = new ProductDetailPage(page);
  70 |     await pdp.open(product.slug);
  71 | 
  72 |     const related = page.locator('a[href^="/products/"]');
  73 |     await expect(related.first()).toBeVisible({ timeout: 15_000 });
  74 |   });
  75 | });
  76 | 
```