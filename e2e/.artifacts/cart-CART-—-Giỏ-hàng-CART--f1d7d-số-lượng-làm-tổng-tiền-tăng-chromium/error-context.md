# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> CART — Giỏ hàng >> CART-03: tăng số lượng làm tổng tiền tăng
- Location: e2e/specs/cart.spec.ts:32:7

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not "SHOWROOM TP. HỒ CHÍ MINH"

Call Log:
- Timeout 10000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=f1e1]:
  - generic [ref=f1e2]:
    - banner [ref=f1e3]:
      - generic [ref=f1e5]:
        - generic [ref=f1e6]: Showroom mở cửa 8:30 - 21:30 cả Chủ nhật
        - generic [ref=f1e9]:
          - generic: Giao từ kho gần nhất · Giá hiển thị đã gồm VAT
          - generic: "Miễn phí tư vấn không gian tập · Hotline: 0939 987 456"
          - generic [ref=f1e10]: Đổi trả trong 7 ngày · Bảo hành chính hãng 2-5 năm
        - generic [ref=f1e11]:
          - link "Hệ thống Showroom" [ref=f1e12] [cursor=pointer]:
            - /url: /contact
          - generic [ref=f1e13]: "|"
          - link "Tra cứu bảo hành" [ref=f1e14] [cursor=pointer]:
            - /url: /profile
      - generic [ref=f1e16]:
        - link "Bảo An Sport - Trang chủ" [ref=f1e17] [cursor=pointer]:
          - /url: /
          - img "Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng" [ref=f1e19]
        - generic [ref=f1e22]:
          - combobox "Tìm kiếm sản phẩm" [ref=f1e26]
          - button "Thực hiện tìm kiếm" [ref=f1e27] [cursor=pointer]:
            - generic [ref=f1e31]: TÌM KIẾM
        - link "Gọi tư vấn" [ref=f1e32] [cursor=pointer]:
          - /url: tel:0939987456
          - generic [ref=f1e36]:
            - generic [ref=f1e37]: Hotline tư vấn
            - strong [ref=f1e38]: 0939 987 456
        - generic [ref=f1e39]:
          - link "Đăng nhập tài khoản" [ref=f1e40] [cursor=pointer]:
            - /url: /login
          - link "Giỏ hàng, 2 sản phẩm" [ref=f1e44] [cursor=pointer]:
            - /url: /cart
            - generic [ref=f1e48]: "2"
      - navigation "Điều hướng chính" [ref=f1e49]:
        - generic [ref=f1e50]:
          - generic [ref=f1e51]:
            - link "Dụng Cụ Bơi Lội" [ref=f1e53] [cursor=pointer]:
              - /url: /category/dung-cu-boi-loi
            - link "Dụng Cụ Bóng Bàn" [ref=f1e58] [cursor=pointer]:
              - /url: /category/dung-cu-bong-ban
            - link "Dụng Cụ Bóng Chày" [ref=f1e63] [cursor=pointer]:
              - /url: /category/dung-cu-bong-chay
            - link "Dụng Cụ Bóng Chuyền" [ref=f1e68] [cursor=pointer]:
              - /url: /category/dung-cu-bong-chuyen
            - link "Dụng Cụ Bóng Đá" [ref=f1e73] [cursor=pointer]:
              - /url: /category/dung-cu-bong-da
            - link "Dụng Cụ Bóng Rổ" [ref=f1e78] [cursor=pointer]:
              - /url: /category/dung-cu-bong-ro
            - link "Dụng Cụ Cầu Lông" [ref=f1e83] [cursor=pointer]:
              - /url: /category/dung-cu-cau-long
            - link "Dụng cụ Pickleball" [ref=f1e88] [cursor=pointer]:
              - /url: /category/dung-cu-pickleball
          - generic [ref=f1e92]:
            - link "⚡ Flash Sale -45%" [ref=f1e93] [cursor=pointer]:
              - /url: /flash-sale
              - generic [ref=f1e94]: ⚡ Flash Sale
              - generic [ref=f1e95]: "-45%"
            - link "Combo Home Gym Hot" [ref=f1e96] [cursor=pointer]:
              - /url: /#products
              - generic [ref=f1e97]: Combo Home Gym
              - generic [ref=f1e98]: Hot
            - link "Cẩm nang tập luyện" [ref=f1e99] [cursor=pointer]:
              - /url: /news
            - link "Hệ thống Showroom" [ref=f1e100] [cursor=pointer]:
              - /url: /contact
    - main [ref=f1e105]:
      - main [ref=f1e106]:
        - navigation "Breadcrumb" [ref=f1e107]:
          - list [ref=f1e108]:
            - listitem [ref=f1e109]:
              - link "Trang chủ" [ref=f1e110] [cursor=pointer]:
                - /url: /
            - listitem [ref=f1e111]:
              - generic [ref=f1e114]: Giỏ hàng
        - heading "Giỏ hàng (1)" [level=1] [ref=f1e115]:
          - text: Giỏ hàng
          - generic [ref=f1e116]: (1)
        - generic [ref=f1e117]:
          - generic [ref=f1e118]:
            - generic [ref=f1e119]:
              - img "Bàn bóng bàn Double Fish 233 — Bàn bóng bàn Double Fish 233" [ref=f1e121]
              - generic [ref=f1e122]:
                - generic [ref=f1e123]:
                  - generic [ref=f1e124]:
                    - paragraph [ref=f1e125]: "233"
                    - heading "Bàn bóng bàn Double Fish 233 — Bàn bóng bàn Double Fish 233" [level=3] [ref=f1e126]
                  - button "Xóa sản phẩm" [ref=f1e127] [cursor=pointer]
                - generic [ref=f1e131]:
                  - generic [ref=f1e132]:
                    - button "Giảm số lượng" [ref=f1e133] [cursor=pointer]
                    - generic [ref=f1e135]: "2"
                    - button "Tăng số lượng" [active] [ref=f1e136] [cursor=pointer]
                  - strong [ref=f1e138]: 48.000.000 ₫
            - button "Xóa tất cả" [ref=f1e139] [cursor=pointer]
          - complementary [ref=f1e140]:
            - heading "Tóm tắt đơn hàng" [level=2] [ref=f1e141]
            - generic [ref=f1e142]:
              - generic [ref=f1e143]:
                - generic [ref=f1e144]: Tạm tính (1 sản phẩm)
                - generic [ref=f1e145]: 48.000.000 ₫
              - generic [ref=f1e146]:
                - generic [ref=f1e147]: Phí vận chuyển
                - generic [ref=f1e148]: 30.000 ₫
              - separator [ref=f1e149]
              - generic [ref=f1e150]:
                - generic [ref=f1e151]: Tổng thanh toán
                - strong [ref=f1e152]: 48.030.000 ₫
            - link "Tiến hành thanh toán" [ref=f1e153] [cursor=pointer]:
              - /url: /checkout
            - link "← Tiếp tục mua sắm" [ref=f1e154] [cursor=pointer]:
              - /url: /#products
    - generic [ref=f1e156]:
      - heading "Nhận ưu đãi độc quyền & kiến thức thể thao" [level=2] [ref=f1e161]
      - paragraph [ref=f1e162]: Đăng ký email để nhận thông tin sản phẩm mới, combo thiết bị giảm giá và bài viết hướng dẫn tập luyện từ HLV.
      - generic [ref=f1e164]:
        - textbox "Email của bạn" [ref=f1e165]
        - button "Đăng ký" [ref=f1e166] [cursor=pointer]
      - paragraph [ref=f1e167]: Chúng tôi cam kết bảo mật thông tin. Bạn có thể hủy nhận tin bất cứ lúc nào.
    - contentinfo [ref=f1e168]:
      - generic [ref=f1e169]:
        - generic [ref=f1e170]:
          - img "Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng" [ref=f1e173]
          - paragraph [ref=f1e174]: Bảo An Sport chuyên cung cấp dụng cụ thể thao, thiết bị Gym, máy tập thể hình và phụ kiện chính hãng. Mẫu mã đa dạng, giao hàng toàn quốc, tư vấn tận tâm.
          - generic [ref=f1e175]:
            - generic [ref=f1e176]: "Thông tin đăng ký doanh nghiệp:"
            - paragraph [ref=f1e177]:
              - text: Giấy chứng nhận ĐKKD số
              - strong [ref=f1e178]: 01M8027099
              - text: do phòng Tài chính - Kế hoạch quận Hoàng Mai, TP. Hà Nội cấp ngày 01/03/2021.
          - link "Đã thông báo Bộ Công Thương Bộ Công Thương Đã thông báo website TMĐT" [ref=f1e180] [cursor=pointer]:
            - /url: http://online.gov.vn/Home/WebDetails/79482?AspxAutoDetectCookieSupport=1
            - img "Đã thông báo Bộ Công Thương" [ref=f1e182]
            - generic [ref=f1e183]:
              - generic [ref=f1e184]: Bộ Công Thương
              - text: Đã thông báo website TMĐT
          - generic [ref=f1e185]:
            - link "Facebook" [ref=f1e186] [cursor=pointer]:
              - /url: https://www.facebook.com/baoansportvn/
            - link "YouTube" [ref=f1e189] [cursor=pointer]:
              - /url: https://www.youtube.com/@baoansport
            - link "Zalo" [ref=f1e193] [cursor=pointer]:
              - /url: https://zalo.me/0939987456
        - generic [ref=f1e196]:
          - heading "Sản phẩm nổi bật" [level=2] [ref=f1e197]
          - generic [ref=f1e198]:
            - link "Tạ tay - Tạ đơn" [ref=f1e199] [cursor=pointer]:
              - /url: /category/ta-tay
            - link "Xà đơn - Xà kép" [ref=f1e200] [cursor=pointer]:
              - /url: /category/xa-don-xa-kep
            - link "Ghế tập tạ đa năng" [ref=f1e201] [cursor=pointer]:
              - /url: /category/ghe-tap-ta
            - link "Giàn tạ đa năng" [ref=f1e202] [cursor=pointer]:
              - /url: /category/gian-ta-da-nang
            - link "Bàn bóng bàn thi đấu" [ref=f1e203] [cursor=pointer]:
              - /url: /category/dung-cu-bong-ban
            - link "Máy chạy bộ điện" [ref=f1e204] [cursor=pointer]:
              - /url: /category/may-chay-bo
            - link "Xe đạp tập thể dục" [ref=f1e205] [cursor=pointer]:
              - /url: /category/xe-dap-tap
        - generic [ref=f1e206]:
          - heading "Thông tin & Chính sách" [level=2] [ref=f1e207]
          - generic [ref=f1e208]:
            - link "Giới thiệu Bảo An Sport" [ref=f1e209] [cursor=pointer]:
              - /url: /#about
            - link "Cam kết khách hàng" [ref=f1e210] [cursor=pointer]:
              - /url: /chinh-sach/cam-ket-khach-hang
            - link "Cẩm nang & Hướng dẫn tập luyện" [ref=f1e211] [cursor=pointer]:
              - /url: /news
            - link "Vận chuyển & giao hàng" [ref=f1e212] [cursor=pointer]:
              - /url: /chinh-sach/van-chuyen-giao-hang
            - link "Chính sách bảo hành" [ref=f1e213] [cursor=pointer]:
              - /url: /chinh-sach/chinh-sach-bao-hanh
            - link "Chính sách đổi trả" [ref=f1e214] [cursor=pointer]:
              - /url: /chinh-sach/chinh-sach-doi-tra
            - link "Bảo mật thông tin khách hàng" [ref=f1e215] [cursor=pointer]:
              - /url: /chinh-sach/bao-mat-thong-tin-khach-hang
            - link "Tất cả thông tin & chính sách" [ref=f1e216] [cursor=pointer]:
              - /url: /chinh-sach
        - generic [ref=f1e217]:
          - heading "Hệ thống Showroom" [level=2] [ref=f1e218]
          - generic [ref=f1e219]:
            - generic [ref=f1e220]:
              - generic [ref=f1e221]:
                - strong [ref=f1e222]: SHOWROOM HÀ NỘI
                - generic [ref=f1e226]: Trụ sở
              - paragraph [ref=f1e227]: Số 234 Định Công, Phường Định Công, Quận Hoàng Mai, Hà Nội
              - 'link "Hotline: 0939 987 456" [ref=f1e229] [cursor=pointer]':
                - /url: tel:0939987456
            - generic [ref=f1e232]:
              - generic [ref=f1e233]:
                - strong [ref=f1e234]: SHOWROOM TP. HỒ CHÍ MINH
                - generic [ref=f1e238]: Chi nhánh
              - paragraph [ref=f1e239]: Số 34 Đường số 2, Phường 11, Cư xá Đài Ra Đa, Quận 6, TP. Hồ Chí Minh
              - 'link "Hotline: 0969 131 990" [ref=f1e241] [cursor=pointer]':
                - /url: tel:0969131990
            - generic [ref=f1e244]:
              - 'link "Email: info@baoansport.vn" [ref=f1e245] [cursor=pointer]':
                - /url: mailto:info@baoansport.vn
              - paragraph [ref=f1e249]: "Mở cửa: 08:30 - 21:30 tất cả các ngày trong tuần (kể cả T7 & CN)"
      - generic [ref=f1e251]:
        - generic [ref=f1e252]:
          - generic [ref=f1e253]: Hàng chính hãng 100%
          - generic [ref=f1e257]: Giao hàng & Lắp ráp 2H
          - generic [ref=f1e263]: Thanh toán an toàn 100%
        - generic [ref=f1e266]:
          - generic [ref=f1e267]: VISA
          - generic [ref=f1e268]: MASTER
          - generic [ref=f1e269]: VietQR
          - generic [ref=f1e270]: MOMO
          - generic [ref=f1e271]: COD
          - generic [ref=f1e272]: TRẢ GÓP 0%
      - generic [ref=f1e273]:
        - generic [ref=f1e274]: © 2026 Bảo An Sport. Chuyên cung cấp dụng cụ thể thao, thiết bị thể dục và thể hình chính hãng uy tín toàn quốc.
        - generic [ref=f1e275]: "Thời gian phục vụ: 08:30 - 21:30 tất cả các ngày trong tuần"
    - generic [ref=f1e276]:
      - link "Tư vấn Zalo" [ref=f1e277] [cursor=pointer]:
        - /url: https://zalo.me/0939987456
        - generic: "Chat Zalo: 0939 987 456"
      - link "Gọi tổng đài tư vấn" [ref=f1e282] [cursor=pointer]:
        - /url: tel:0939987456
        - generic: "Hotline: 0939 987 456"
      - link "Tìm Showroom gần nhất" [ref=f1e287] [cursor=pointer]:
        - /url: /contact
        - generic: Showroom Bảo An Sport
  - complementary "Thông báo hệ thống"
  - button "Open Next.js Dev Tools" [ref=f1e296] [cursor=pointer]
  - alert [ref=f1e300]
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | import { CartPage } from '../pages/cart.page';
  3  | import { ProductDetailPage } from '../pages/product-detail.page';
  4  | import { firstProduct } from '../fixtures/api';
  5  | 
  6  | test.describe('CART — Giỏ hàng', () => {
  7  |   test('CART-01: giỏ rỗng hiện trạng thái trống và lối quay lại mua sắm', async ({ page }) => {
  8  |     const cart = new CartPage(page);
  9  |     await cart.open();
  10 | 
  11 |     await expect(cart.emptyState()).toBeVisible();
  12 |     await expect(cart.checkoutLink()).toHaveCount(0);
  13 |   });
  14 | 
  15 |   test('CART-02: thêm sản phẩm rồi mở giỏ thấy đúng dòng và tổng tiền', async ({
  16 |     page,
  17 |     request,
  18 |   }) => {
  19 |     const product = await firstProduct(request);
  20 |     const pdp = new ProductDetailPage(page);
  21 |     await pdp.open(product.slug);
  22 |     await pdp.addToCart().click();
  23 | 
  24 |     const cart = new CartPage(page);
  25 |     await cart.open();
  26 | 
  27 |     await expect(page.getByText(product.name).first()).toBeVisible();
  28 |     await expect(cart.summaryTotal()).toBeVisible();
  29 |     await expect(cart.checkoutLink()).toBeVisible();
  30 |   });
  31 | 
  32 |   test('CART-03: tăng số lượng làm tổng tiền tăng', async ({ page, request }) => {
  33 |     const product = await firstProduct(request);
  34 |     const pdp = new ProductDetailPage(page);
  35 |     await pdp.open(product.slug);
  36 |     await pdp.addToCart().click();
  37 | 
  38 |     const cart = new CartPage(page);
  39 |     await cart.open();
  40 |     const totalBefore = await page.locator('strong').last().innerText();
  41 | 
  42 |     await cart.increase().first().click();
  43 | 
> 44 |     await expect.poll(async () => page.locator('strong').last().innerText()).not.toBe(totalBefore);
     |                                                                                  ^ Error: expect(received).not.toBe(expected) // Object.is equality
  45 |   });
  46 | 
  47 |   test('CART-04: xoá sản phẩm đưa giỏ về trạng thái trống', async ({ page, request }) => {
  48 |     const product = await firstProduct(request);
  49 |     const pdp = new ProductDetailPage(page);
  50 |     await pdp.open(product.slug);
  51 |     await pdp.addToCart().click();
  52 | 
  53 |     const cart = new CartPage(page);
  54 |     await cart.open();
  55 |     await cart.remove().first().click();
  56 | 
  57 |     await expect(cart.emptyState()).toBeVisible();
  58 |   });
  59 | 
  60 |   test('CART-05: giỏ hàng còn nguyên sau khi tải lại trang', async ({ page, request }) => {
  61 |     const product = await firstProduct(request);
  62 |     const pdp = new ProductDetailPage(page);
  63 |     await pdp.open(product.slug);
  64 |     await pdp.addToCart().click();
  65 | 
  66 |     const cart = new CartPage(page);
  67 |     await cart.open();
  68 |     await expect(page.getByText(product.name).first()).toBeVisible();
  69 | 
  70 |     await page.reload();
  71 | 
  72 |     await expect(page.getByText(product.name).first()).toBeVisible();
  73 |   });
  74 | 
  75 |   test('CART-06: số lượng trên header phản ánh giỏ', async ({ page, request }) => {
  76 |     const product = await firstProduct(request);
  77 |     const pdp = new ProductDetailPage(page);
  78 |     await pdp.open(product.slug);
  79 |     await pdp.addToCart().click();
  80 |     await page.reload();
  81 | 
  82 |     await expect(page.locator('a[href="/cart"]').first()).not.toHaveAccessibleName(
  83 |       /0 sản phẩm/,
  84 |     );
  85 |   });
  86 | });
  87 | 
```