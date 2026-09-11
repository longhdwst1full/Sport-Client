# Storefront checkout — maintenance note

> **Document version:** 1.1.0
>
> **Last updated:** 2026-09-11
>
> **Change summary:** Nối confirm reservation với tạo Order idempotent và hiển thị order snapshot thật ở màn thành công.

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
| 1.1.0 | 2026-09-11 | Thêm bước tạo Order idempotent sau reservation và success state theo Order. | API-20260911-ORDER-FOUNDATION |
| 1.0.0 | 2026-09-09 | Tạo maintenance note cho Storefront Checkout. | DOC-20260909-FEATURE-MAINTENANCE-NOTES |
