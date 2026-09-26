# Storefront checkout — maintenance note

> **Document version:** 1.4.0
>
> **Last updated:** 2026-09-26
>
> **Change summary:** Checkout 3 bước (địa chỉ → vận chuyển & thanh toán → xác nhận), sổ địa chỉ, tự chuyển VNPay, timeout 30 giây cho lệnh checkout.

## Luồng 3 bước (2026-09-26)

| Bước | Nội dung | Điều kiện sang bước sau |
| --- | --- | --- |
| 1. Địa chỉ nhận hàng | Khách đăng nhập chọn từ sổ địa chỉ (`listCustomerAddresses`, điền sẵn địa chỉ mặc định) hoặc "Giao tới địa chỉ khác"; khách vãng lai nhập tay | Đủ người nhận, SĐT, số nhà và chọn tới phường/xã |
| 2. Vận chuyển & thanh toán | "Giao hàng tiêu chuẩn" hiện phí từ báo giá tự động ("Đang tính phí…" khi chờ, "Thử lại" khi lỗi, không bao giờ hiện 0 ₫ tạm) hoặc "Nhờ shop gửi"; chọn COD hay VNPay | Đã có báo giá |
| 3. Xác nhận đơn | Xem lại địa chỉ, chi nhánh, vận chuyển, thanh toán (nút Sửa quay về bước tương ứng); đồng ý điều khoản | Tích điều khoản; báo giá không ở trạng thái chờ tư vấn |

- Nút đặt hàng chỉ nằm ở tóm tắt đơn của bước 3. Bấm thì `confirm` (giữ hàng 30 phút) rồi `place` với idempotency key giữ nguyên khi thử lại.
- VNPay: đặt đơn xong đọc `instruction.redirectUrl` của thanh toán (`getAccountPayment` / `getGuestPayment` với token truy cập đơn đã lưu) và chuyển thẳng sang cổng. Không lấy được URL thì hiện trang đặt hàng thành công; khách thanh toán lại ở trang đơn.
- Lệnh checkout (báo giá, xác nhận, đặt đơn, tải lại báo giá) dùng timeout 30 giây: báo giá đo được ~10,4 giây trên production, đúng bằng timeout 10 giây mặc định của fetcher.
- Trang không tự có thẻ `<main>` vì `StorefrontLayout` đã có.

Chưa làm (cần Backend): gọi lại GHN khi đặt đơn và báo `SHIPPING_FEE_CHANGED`, nhận tại cửa hàng, timeline và mã vận đơn ở trang đơn, tự tạo vận đơn sau khi thanh toán.

## Quy tắc hiển thị (2026-09-25)

- Tự gọi báo giá (`quote*Checkout`) sau 700 ms khi đủ tên, SĐT, số nhà và chọn tới phường/xã; lượt cũ bị bỏ qua theo `quoteSeq`. Sửa bất kỳ trường nào thì báo giá cũ bị huỷ.
- Freeship dưới 10 km là luật `BRANCH_FREE` của Backend, chỉ áp khi khách bấm "Dùng vị trí hiện tại" (có toạ độ). Chưa có luật theo quận nội thành.
- "Nhờ shop gửi" dùng `requestShippingConsultation`: tóm tắt chỉ hiện tiền hàng kèm ghi chú phí vận chuyển báo và tính riêng; chưa đặt được đơn cho tới khi nhân viên cập nhật phí.
- Thanh toán storefront chỉ còn `COD` và `VNPAY`; `BANK_TRANSFER` vẫn tồn tại ở Backend cho POS.
- Sản phẩm `inStock = false` bị chặn từ catalog nên không vào được checkout; Backend vẫn là chốt chặn cuối.

## Phạm vi

Checkout thực hiện hai bước rõ ràng:

1. `prepareCheckout`: đồng bộ cart lên Backend và lấy quote đã kiểm tra giá, tồn kho, branch và phí giao.
2. `confirmCheckout`: khách chấp nhận quote để Backend tạo reservation giữ hàng có TTL.
3. `placeOrder`: chuyển checkout đã confirm thành Order duy nhất; từ đây cancel/payment/fulfillment sở hữu vòng đời reservation.

Order mới ở `PENDING_CONFIRMATION`, chưa ghi nhận doanh thu và chưa đồng nghĩa Payment đã thu. Các bước Payment/Fulfillment tiếp tục dùng API/state machine của Sprint tương ứng.

## Cấu trúc

| File | Vai trò |
| --- | --- |
| `pages/checkout-page.tsx` | Điều phối form, quote, consultation refresh, confirm và UI states. |
| `api/checkout.workflow.ts` | Ghép generated Cart/Checkout/Order operations cho Guest và Account. |
| `components/checkout-order-summary.tsx` | Hiển thị snapshot hàng, phí và CTA theo trạng thái. |
| `components/checkout-success.tsx` | Hiển thị Order number, branch, tổng tiền và trạng thái thật. |
| `index.ts` | Public export để `app/checkout/page.tsx` không import internal file. |

## Guest và Account

- Guest cart token lưu ở `localStorage` và chỉ dùng qua `x-cart-token` header của generated request options.
- Nếu token cũ trả 404, workflow xóa token rồi tạo guest cart mới; các lỗi khác phải nổi lên UI.
- Account dùng access token do shared transport tự gắn; feature không đọc/ghép Authorization header.
- Cart mutation chạy tuần tự vì mỗi response trả `version` mới cho mutation kế tiếp. Không đổi vòng lặp thành `Promise.all`.

## Invariant UI/API

- Mọi thay đổi recipient, địa chỉ, vị trí, payment method hoặc yêu cầu tư vấn phải invalidate quote cũ.
- Không dùng tổng tiền local để confirm; quote Backend là nguồn đúng cuối cùng.
- Quote cần tư vấn không được confirm cho đến khi Admin chốt và Client reload lại quote.
- `Idempotency-Key` đại diện một ý định quote/confirm/place order. Confirm và Order có key riêng, nhưng mỗi key phải được giữ nguyên khi retry do lỗi mạng.
- Lỗi Backend hiển thị từ error envelope tiếng Việt; lỗi mạng/client mới dùng fallback tại feature.
- Chỉ clear Redux cart sau khi Order tạo thành công; reservation thành công nhưng Order lỗi phải cho phép retry cùng key.
- Chỉ kiểm tra cart trống và redirect sau lượt hydrate đầu tiên để Redux có cơ hội
  khôi phục snapshot từ `localStorage`; không bỏ gate này khi refactor checkout.

## Checklist khi sửa

- [ ] Guest và Account đều chạy được cùng một UI journey.
- [ ] Quote bị hủy khi input ảnh hưởng giá/branch/shipping thay đổi.
- [ ] Không confirm quote đang chờ consultation hoặc đã hết hạn.
- [ ] Không song song hóa cart mutation có optimistic version.
- [ ] Không cache offline response cart/checkout/reservation.
- [ ] Loading/error/disabled/success và quay lại cart vẫn đúng trên mobile.
- [ ] Chỉ dùng generated API, không tự khai báo DTO/path.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.4.0 | 2026-09-26 | Checkout 3 bước, sổ địa chỉ, tự chuyển VNPay, timeout 30 giây. | Đối chiếu đặc tả checkout/GHN/VNPay |
| 1.3.0 | 2026-09-25 | Tự báo giá theo địa chỉ, "Nhờ shop gửi", COD + VNPay. | Checkout FE-only request |
| 1.2.0 | 2026-09-13 | Đồng bộ SSR/browser trước khi đọc và redirect theo persisted cart. | Browser E2E Sprint 4 |
| 1.1.0 | 2026-09-11 | Thêm bước tạo Order idempotent sau reservation và success state theo Order. | API-20260911-ORDER-FOUNDATION |
| 1.0.0 | 2026-09-09 | Tạo maintenance note cho Storefront Checkout. | DOC-20260909-FEATURE-MAINTENANCE-NOTES |
