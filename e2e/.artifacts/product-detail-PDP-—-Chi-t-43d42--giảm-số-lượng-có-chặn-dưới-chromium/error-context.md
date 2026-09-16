# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product-detail.spec.ts >> PDP — Chi tiết sản phẩm >> PDP-03: tăng/giảm số lượng có chặn dưới
- Location: e2e/specs/product-detail.spec.ts:24:7

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.click: Test timeout of 45000ms exceeded.
Call log:
  - waiting for getByLabel('Tăng số lượng')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - generic [ref=e6]: Showroom mở cửa 8:30 - 21:30 cả Chủ nhật
        - generic [ref=e9]:
          - generic: Giao từ kho gần nhất · Giá hiển thị đã gồm VAT
          - generic [ref=e10]: "Miễn phí tư vấn không gian tập · Hotline: 0939 987 456"
          - generic: Đổi trả trong 7 ngày · Bảo hành chính hãng 2-5 năm
        - generic [ref=e11]:
          - link "Hệ thống Showroom" [ref=e12] [cursor=pointer]:
            - /url: /contact
          - generic [ref=e13]: "|"
          - link "Tra cứu bảo hành" [ref=e14] [cursor=pointer]:
            - /url: /profile
      - generic [ref=e16]:
        - link "Bảo An Sport - Trang chủ" [ref=e17] [cursor=pointer]:
          - /url: /
          - img "Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng" [ref=e19]
        - generic [ref=e22]:
          - combobox "Tìm kiếm sản phẩm" [ref=e26]
          - button "Thực hiện tìm kiếm" [ref=e27] [cursor=pointer]:
            - generic [ref=e31]: TÌM KIẾM
        - link "Gọi tư vấn" [ref=e32] [cursor=pointer]:
          - /url: tel:0939987456
          - generic [ref=e36]:
            - generic [ref=e37]: Hotline tư vấn
            - strong [ref=e38]: 0939 987 456
        - generic [ref=e39]:
          - link "Đăng nhập tài khoản" [ref=e40] [cursor=pointer]:
            - /url: /login
          - link "Giỏ hàng, 0 sản phẩm" [ref=e44] [cursor=pointer]:
            - /url: /cart
      - navigation "Điều hướng chính" [ref=e48]:
        - generic [ref=e49]:
          - generic [ref=e50]:
            - link "Dụng Cụ Bơi Lội" [ref=e52] [cursor=pointer]:
              - /url: /category/dung-cu-boi-loi
            - link "Dụng Cụ Bóng Bàn" [ref=e57] [cursor=pointer]:
              - /url: /category/dung-cu-bong-ban
            - link "Dụng Cụ Bóng Chày" [ref=e62] [cursor=pointer]:
              - /url: /category/dung-cu-bong-chay
            - link "Dụng Cụ Bóng Chuyền" [ref=e67] [cursor=pointer]:
              - /url: /category/dung-cu-bong-chuyen
            - link "Dụng Cụ Bóng Đá" [ref=e72] [cursor=pointer]:
              - /url: /category/dung-cu-bong-da
            - link "Dụng Cụ Bóng Rổ" [ref=e77] [cursor=pointer]:
              - /url: /category/dung-cu-bong-ro
            - link "Dụng Cụ Cầu Lông" [ref=e82] [cursor=pointer]:
              - /url: /category/dung-cu-cau-long
            - link "Dụng cụ Pickleball" [ref=e87] [cursor=pointer]:
              - /url: /category/dung-cu-pickleball
          - generic [ref=e91]:
            - link "⚡ Flash Sale -45%" [ref=e92] [cursor=pointer]:
              - /url: /flash-sale
              - generic [ref=e93]: ⚡ Flash Sale
              - generic [ref=e94]: "-45%"
            - link "Combo Home Gym Hot" [ref=e95] [cursor=pointer]:
              - /url: /#products
              - generic [ref=e96]: Combo Home Gym
              - generic [ref=e97]: Hot
            - link "Cẩm nang tập luyện" [ref=e98] [cursor=pointer]:
              - /url: /news
            - link "Hệ thống Showroom" [ref=e99] [cursor=pointer]:
              - /url: /contact
    - main [ref=e104]:
      - generic [ref=e105]:
        - navigation "Breadcrumb" [ref=e106]:
          - list [ref=e107]:
            - listitem [ref=e108]:
              - link "Trang chủ" [ref=e109] [cursor=pointer]:
                - /url: /
            - listitem [ref=e110]:
              - link "Sản phẩm" [ref=e113] [cursor=pointer]:
                - /url: /#products
            - listitem [ref=e114]:
              - generic [ref=e117]: Bàn bóng bàn Double Fish 233
        - main [ref=e118]:
          - generic [ref=e119]:
            - generic [ref=e120]:
              - generic [ref=e121]:
                - generic [ref=e122]: Hình ảnh sản phẩm
                - generic [ref=e128]: Ảnh thực tế đã kiểm duyệt
              - generic [ref=e132]:
                - img "Bàn bóng bàn Double Fish 233" [ref=e133]
                - generic [ref=e134]: Có hỗ trợ xem sản phẩm tại showroom
            - generic [ref=e135]:
              - heading "Mô tả sản phẩm" [level=2] [ref=e136]
              - paragraph [ref=e137]: Bàn bóng bàn Double Fish 233 chính hãng có mặt gỗ MDF cho độ nảy chuẩn, khung chắc chắn, gấp gọn tiện lợi. Mua tại Bảo An Sport giao hàng toàn quốc.
              - generic [ref=e138]:
                - generic [ref=e139]:
                  - strong [ref=e142]: Thiết kế công thái học
                  - paragraph [ref=e143]: Tay cầm tiện dụng, hạn chế mỏi cổ tay khi nâng tạ nặng.
                - generic [ref=e144]:
                  - strong [ref=e148]: Bọc cao su đúc
                  - paragraph [ref=e149]: Bảo vệ bề mặt sàn gỗ, gạch hoa và chống nứt vỡ.
                - generic [ref=e150]:
                  - strong [ref=e154]: Độ bền công nghiệp
                  - paragraph [ref=e155]: Chịu được hơn 100.000 chu kỳ tập luyện liên tục.
            - generic [ref=e156]:
              - heading "Thông số kỹ thuật chi tiết" [level=2] [ref=e157]
              - generic [ref=e158]:
                - generic [ref=e159]:
                  - generic [ref=e160]: Thương hiệu
                  - generic [ref=e161]: OEM
                - generic [ref=e162]:
                  - generic [ref=e163]: Phân loại
                  - generic [ref=e164]: Bàn Bóng Bàn
                - generic [ref=e165]:
                  - generic [ref=e166]: Mã sản phẩm
                  - generic [ref=e167]: BAS-896
                - generic [ref=e168]:
                  - generic [ref=e169]: Số phiên bản
                  - generic [ref=e170]: 1 phiên bản
            - region [ref=e171]:
              - generic [ref=e172]:
                - heading "Đánh giá từ khách hàng" [level=2] [ref=e173]
                - paragraph [ref=e174]: Nhận xét về Bàn bóng bàn Double Fish 233 đã được kiểm duyệt trước khi hiển thị.
                - paragraph [ref=e175]: Sản phẩm chưa có đánh giá nào được duyệt.
                - generic [ref=e176]:
                  - paragraph [ref=e177]: Bạn đã mua sản phẩm này?
                  - paragraph [ref=e178]: Gọi 0939 987 456 để gửi đánh giá. Chúng tôi sẽ đăng sau khi kiểm duyệt.
          - region [ref=e180]:
            - generic [ref=e181]:
              - generic [ref=e182]:
                - generic [ref=e183]:
                  - text: Giá bán niêm yết (Đã gồm VAT)
                  - generic [ref=e184]:
                    - strong [ref=e185]: 24.000.000 ₫
                    - generic [ref=e186]: 30.000.000 ₫
                - generic [ref=e187]: Tiết kiệm 20%
              - generic [ref=e188]: Liên hệ cửa hàng để biết tình trạng hàng, thời gian giao và lắp đặt
            - separator [ref=e190]
            - generic [ref=e191]:
              - generic [ref=e192]:
                - heading "Phiên bản / Quy cách" [level=2] [ref=e193]
                - generic [ref=e194]: 1 lựa chọn có sẵn
              - 'button "Bàn bóng bàn Double Fish 233 Mã SKU: 233 24.000.000 ₫" [pressed] [ref=e196] [cursor=pointer]':
                - generic [ref=e201]:
                  - generic [ref=e202]: Bàn bóng bàn Double Fish 233
                  - generic [ref=e203]: "Mã SKU: 233"
                - strong [ref=e205]: 24.000.000 ₫
            - generic [ref=e206]:
              - generic [ref=e207]: "Số lượng:"
              - generic [ref=e208]:
                - button [disabled] [ref=e209]
                - generic [ref=e211]: "1"
                - button [ref=e212] [cursor=pointer]
            - generic [ref=e214]:
              - generic [ref=e215]: "Quà tặng độc quyền theo đơn hàng:"
              - generic [ref=e221]:
                - generic [ref=e222]:
                  - generic [ref=e223]: 🎁 Găng tay thể hình Bảo An Pro Grip
                  - generic [ref=e224]: Trị giá 350.000đ (0đ)
                - generic [ref=e225]:
                  - generic [ref=e226]: 🎁 Thảm cao su giảm chấn sàn EPDM 15mm
                  - generic [ref=e227]: Trị giá 450.000đ (0đ)
                - generic [ref=e228]:
                  - generic [ref=e229]: 🎁 Bình nước thể thao Inox Bảo An giữ nhiệt 24h
                  - generic [ref=e230]: Trị giá 250.000đ (0đ)
              - paragraph [ref=e231]: "* Quà tặng tự động đóng gói cùng kiện hàng chính khi xuất kho."
            - generic [ref=e232]:
              - generic [ref=e233]: Hỗ trợ trả góp 0% lãi suất
              - generic [ref=e237]: Chỉ từ ~490.000đ/tháng
            - generic [ref=e238]:
              - button "Thêm vào giỏ" [ref=e239] [cursor=pointer]
              - button "Mua ngay" [ref=e244] [cursor=pointer]
            - generic [ref=e248]:
              - generic [ref=e255]:
                - strong [ref=e256]: Giao nhanh 2 Giờ
                - text: Nội thành Hà Nội & TP.HCM
              - generic [ref=e260]:
                - strong [ref=e261]: Lắp đặt tại nhà
                - text: Kỹ thuật viên chuyên nghiệp
              - generic [ref=e266]:
                - strong [ref=e267]: Bảo hành 24 Tháng
                - text: Chính hãng tại nhà khách
              - generic [ref=e272]:
                - strong [ref=e273]: Đổi mới 7 Ngày
                - text: Lỗi 1 đổi 1 tận nơi
        - generic [ref=e274]:
          - generic [ref=e275]:
            - generic [ref=e276]:
              - heading "Sản phẩm liên quan" [level=2] [ref=e277]
              - paragraph [ref=e278]: Thiết bị cùng nhóm được khách xem nhiều.
            - link "Xem tất cả" [ref=e279] [cursor=pointer]:
              - /url: /products
          - generic [ref=e282]:
            - article [ref=e283]:
              - link "Ghế trọng tài bóng bàn 302359 Phụ Kiện Bóng Bàn" [ref=e284] [cursor=pointer]:
                - /url: /products/ghe-trong-tai-bong-ban-302359
                - img "Ghế trọng tài bóng bàn 302359" [ref=e285]
                - generic [ref=e286]: Phụ Kiện Bóng Bàn
              - generic [ref=e287]:
                - paragraph [ref=e288]: OEM
                - heading [level=3] [ref=e289]:
                  - link "Ghế trọng tài bóng bàn 302359" [ref=e290] [cursor=pointer]:
                    - /url: /products/ghe-trong-tai-bong-ban-302359
                - strong [ref=e291]: 3.040.000 ₫
                - button "Thêm vào giỏ" [ref=e292] [cursor=pointer]
            - article [ref=e296]:
              - link "Ring chắn bóng bàn nhập khẩu Phụ Kiện Bóng Bàn" [ref=e297] [cursor=pointer]:
                - /url: /products/ring-chan-bong-ban-nhap-khau
                - img "Ring chắn bóng bàn nhập khẩu" [ref=e298]
                - generic [ref=e299]: Phụ Kiện Bóng Bàn
              - generic [ref=e300]:
                - paragraph [ref=e301]: OEM
                - heading [level=3] [ref=e302]:
                  - link "Ring chắn bóng bàn nhập khẩu" [ref=e303] [cursor=pointer]:
                    - /url: /products/ring-chan-bong-ban-nhap-khau
                - strong [ref=e304]: 400.000 ₫
                - button "Thêm vào giỏ" [ref=e305] [cursor=pointer]
            - article [ref=e309]:
              - link "Ring chắn bóng bàn 301358 Phụ Kiện Bóng Bàn" [ref=e310] [cursor=pointer]:
                - /url: /products/ring-chan-bong-ban-301358
                - img "Ring chắn bóng bàn 301358" [ref=e311]
                - generic [ref=e312]: Phụ Kiện Bóng Bàn
              - generic [ref=e313]:
                - paragraph [ref=e314]: OEM
                - heading [level=3] [ref=e315]:
                  - link "Ring chắn bóng bàn 301358" [ref=e316] [cursor=pointer]:
                    - /url: /products/ring-chan-bong-ban-301358
                - strong [ref=e317]: 750.000 ₫
                - button "Thêm vào giỏ" [ref=e318] [cursor=pointer]
            - article [ref=e322]:
              - link "Keo dán vợt bóng bàn Haifu Phụ Kiện Bóng Bàn" [ref=e323] [cursor=pointer]:
                - /url: /products/keo-dan-vot-bong-ban-haifu
                - img "Keo dán vợt bóng bàn Haifu" [ref=e324]
                - generic [ref=e325]: Phụ Kiện Bóng Bàn
              - generic [ref=e326]:
                - paragraph [ref=e327]: OEM
                - heading [level=3] [ref=e328]:
                  - link "Keo dán vợt bóng bàn Haifu" [ref=e329] [cursor=pointer]:
                    - /url: /products/keo-dan-vot-bong-ban-haifu
                - strong [ref=e330]: 100.000 ₫
                - button "Thêm vào giỏ" [ref=e331] [cursor=pointer]
    - generic [ref=e336]:
      - heading "Nhận ưu đãi độc quyền & kiến thức thể thao" [level=2] [ref=e341]
      - paragraph [ref=e342]: Đăng ký email để nhận thông tin sản phẩm mới, combo thiết bị giảm giá và bài viết hướng dẫn tập luyện từ HLV.
      - generic [ref=e344]:
        - textbox "Email của bạn" [ref=e345]
        - button "Đăng ký" [ref=e346] [cursor=pointer]
      - paragraph [ref=e347]: Chúng tôi cam kết bảo mật thông tin. Bạn có thể hủy nhận tin bất cứ lúc nào.
    - contentinfo [ref=e348]:
      - generic [ref=e349]:
        - generic [ref=e350]:
          - img "Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng" [ref=e353]
          - paragraph [ref=e354]: Bảo An Sport chuyên cung cấp dụng cụ thể thao, thiết bị Gym, máy tập thể hình và phụ kiện chính hãng. Mẫu mã đa dạng, giao hàng toàn quốc, tư vấn tận tâm.
          - generic [ref=e355]:
            - generic [ref=e356]: "Thông tin đăng ký doanh nghiệp:"
            - paragraph [ref=e357]:
              - text: Giấy chứng nhận ĐKKD số
              - strong [ref=e358]: 01M8027099
              - text: do phòng Tài chính - Kế hoạch quận Hoàng Mai, TP. Hà Nội cấp ngày 01/03/2021.
          - link "Đã thông báo Bộ Công Thương Bộ Công Thương Đã thông báo website TMĐT" [ref=e360] [cursor=pointer]:
            - /url: http://online.gov.vn/Home/WebDetails/79482?AspxAutoDetectCookieSupport=1
            - img "Đã thông báo Bộ Công Thương" [ref=e362]
            - generic [ref=e363]:
              - generic [ref=e364]: Bộ Công Thương
              - text: Đã thông báo website TMĐT
          - generic [ref=e365]:
            - link "Facebook" [ref=e366] [cursor=pointer]:
              - /url: https://www.facebook.com/baoansportvn/
            - link "YouTube" [ref=e369] [cursor=pointer]:
              - /url: https://www.youtube.com/@baoansport
            - link "Zalo" [ref=e373] [cursor=pointer]:
              - /url: https://zalo.me/0939987456
        - generic [ref=e376]:
          - heading "Sản phẩm nổi bật" [level=2] [ref=e377]
          - generic [ref=e378]:
            - link "Tạ tay - Tạ đơn" [ref=e379] [cursor=pointer]:
              - /url: /category/ta-tay
            - link "Xà đơn - Xà kép" [ref=e380] [cursor=pointer]:
              - /url: /category/xa-don-xa-kep
            - link "Ghế tập tạ đa năng" [ref=e381] [cursor=pointer]:
              - /url: /category/ghe-tap-ta
            - link "Giàn tạ đa năng" [ref=e382] [cursor=pointer]:
              - /url: /category/gian-ta-da-nang
            - link "Bàn bóng bàn thi đấu" [ref=e383] [cursor=pointer]:
              - /url: /category/dung-cu-bong-ban
            - link "Máy chạy bộ điện" [ref=e384] [cursor=pointer]:
              - /url: /category/may-chay-bo
            - link "Xe đạp tập thể dục" [ref=e385] [cursor=pointer]:
              - /url: /category/xe-dap-tap
        - generic [ref=e386]:
          - heading "Thông tin & Chính sách" [level=2] [ref=e387]
          - generic [ref=e388]:
            - link "Giới thiệu Bảo An Sport" [ref=e389] [cursor=pointer]:
              - /url: /#about
            - link "Cam kết khách hàng" [ref=e390] [cursor=pointer]:
              - /url: /chinh-sach/cam-ket-khach-hang
            - link "Cẩm nang & Hướng dẫn tập luyện" [ref=e391] [cursor=pointer]:
              - /url: /news
            - link "Vận chuyển & giao hàng" [ref=e392] [cursor=pointer]:
              - /url: /chinh-sach/van-chuyen-giao-hang
            - link "Chính sách bảo hành" [ref=e393] [cursor=pointer]:
              - /url: /chinh-sach/chinh-sach-bao-hanh
            - link "Chính sách đổi trả" [ref=e394] [cursor=pointer]:
              - /url: /chinh-sach/chinh-sach-doi-tra
            - link "Bảo mật thông tin khách hàng" [ref=e395] [cursor=pointer]:
              - /url: /chinh-sach/bao-mat-thong-tin-khach-hang
            - link "Tất cả thông tin & chính sách" [ref=e396] [cursor=pointer]:
              - /url: /chinh-sach
        - generic [ref=e397]:
          - heading "Hệ thống Showroom" [level=2] [ref=e398]
          - generic [ref=e399]:
            - generic [ref=e400]:
              - generic [ref=e401]:
                - strong [ref=e402]: SHOWROOM HÀ NỘI
                - generic [ref=e406]: Trụ sở
              - paragraph [ref=e407]: Số 234 Định Công, Phường Định Công, Quận Hoàng Mai, Hà Nội
              - 'link "Hotline: 0939 987 456" [ref=e409] [cursor=pointer]':
                - /url: tel:0939987456
            - generic [ref=e412]:
              - generic [ref=e413]:
                - strong [ref=e414]: SHOWROOM TP. HỒ CHÍ MINH
                - generic [ref=e418]: Chi nhánh
              - paragraph [ref=e419]: Số 34 Đường số 2, Phường 11, Cư xá Đài Ra Đa, Quận 6, TP. Hồ Chí Minh
              - 'link "Hotline: 0969 131 990" [ref=e421] [cursor=pointer]':
                - /url: tel:0969131990
            - generic [ref=e424]:
              - 'link "Email: info@baoansport.vn" [ref=e425] [cursor=pointer]':
                - /url: mailto:info@baoansport.vn
              - paragraph [ref=e429]: "Mở cửa: 08:30 - 21:30 tất cả các ngày trong tuần (kể cả T7 & CN)"
      - generic [ref=e431]:
        - generic [ref=e432]:
          - generic [ref=e433]: Hàng chính hãng 100%
          - generic [ref=e437]: Giao hàng & Lắp ráp 2H
          - generic [ref=e443]: Thanh toán an toàn 100%
        - generic [ref=e446]:
          - generic [ref=e447]: VISA
          - generic [ref=e448]: MASTER
          - generic [ref=e449]: VietQR
          - generic [ref=e450]: MOMO
          - generic [ref=e451]: COD
          - generic [ref=e452]: TRẢ GÓP 0%
      - generic [ref=e453]:
        - generic [ref=e454]: © 2026 Bảo An Sport. Chuyên cung cấp dụng cụ thể thao, thiết bị thể dục và thể hình chính hãng uy tín toàn quốc.
        - generic [ref=e455]: "Thời gian phục vụ: 08:30 - 21:30 tất cả các ngày trong tuần"
    - generic [ref=e456]:
      - link "Tư vấn Zalo" [ref=e457] [cursor=pointer]:
        - /url: https://zalo.me/0939987456
        - generic: "Chat Zalo: 0939 987 456"
      - link "Gọi tổng đài tư vấn" [ref=e462] [cursor=pointer]:
        - /url: tel:0939987456
        - generic: "Hotline: 0939 987 456"
      - link "Tìm Showroom gần nhất" [ref=e467] [cursor=pointer]:
        - /url: /contact
        - generic: Showroom Bảo An Sport
  - complementary "Thông báo hệ thống"
  - button "Open Next.js Dev Tools" [ref=e476] [cursor=pointer]
  - alert [ref=e480]
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
  12 |     await expect(pdp.title()).toContainText(product.name);
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
> 29 |     await pdp.increaseQty().click();
     |                             ^ Error: locator.click: Test timeout of 45000ms exceeded.
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