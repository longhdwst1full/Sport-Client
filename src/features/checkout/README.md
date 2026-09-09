# Storefront checkout — maintenance note

> **Document version:** 1.0.0
>
> **Last updated:** 2026-09-09
>
> **Change summary:** Mô tả ranh giới UI/API, Guest/Account flow và các invariant cần giữ khi bảo trì Checkout.

## Phạm vi

Checkout thực hiện hai bước rõ ràng:

1. `prepareCheckout`: đồng bộ cart lên Backend và lấy quote đã kiểm tra giá, tồn kho, branch và phí giao.
2. `confirmCheckout`: khách chấp nhận quote để Backend tạo reservation giữ hàng có TTL.

Reservation thành công chưa phải Order hoàn tất, chưa xác nhận doanh thu và chưa bảo đảm Payment đã thu. Các bước Order/Payment/Fulfillment phải dùng API/state machine của Sprint tương ứng.

## Cấu trúc

| File | Vai trò |
| --- | --- |
| `pages/checkout-page.tsx` | Điều phối form, quote, consultation refresh, confirm và UI states. |
| `api/checkout.workflow.ts` | Ghép generated Cart/Checkout operations cho Guest và Account. |
| `components/checkout-order-summary.tsx` | Hiển thị snapshot hàng, phí và CTA theo trạng thái. |
| `components/checkout-success.tsx` | Hiển thị reservation thành công và thời hạn giữ hàng. |
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
- `Idempotency-Key` đại diện một ý định quote/confirm. Khi bổ sung automatic retry, phải tái sử dụng key của cùng ý định; không tạo key mới cho mỗi network retry.
- Lỗi Backend hiển thị từ error envelope tiếng Việt; lỗi mạng/client mới dùng fallback tại feature.
- Sau confirm thành công mới clear Redux cart.

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
| 1.0.0 | 2026-09-09 | Tạo maintenance note cho Storefront Checkout. | DOC-20260909-FEATURE-MAINTENANCE-NOTES |
