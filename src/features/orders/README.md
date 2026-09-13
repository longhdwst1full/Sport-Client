# Storefront Orders — maintenance note

> **Document version:** 1.2.0
>
> **Last updated:** 2026-09-12
>
> **Change summary:** Thêm TTL env/terminal cleanup cho Guest token và đồng bộ Order list cache sau Payment mutation.

## Phạm vi và ranh giới

- `/orders` chỉ tải danh sách khi customer đã đăng nhập; dữ liệu cá nhân không được server/shared cache.
- `/orders/[orderNo]` chọn Account ownership hoặc Guest `orderNo + x-cart-token` sau khi auth state đã hydrate.
- Guest token dùng credential cart đã phát hành, raw token chỉ nằm trong browser storage; backend chỉ lưu SHA-256 trên cart.
- Browser lưu token theo từng `orderNo`, tách khỏi token cart hiện tại để tạo cart mới không làm mất quyền mở các đơn cũ.
- Token lưu tối đa `NEXT_PUBLIC_GUEST_ORDER_TOKEN_TTL_DAYS` (mặc định 90 ngày); bản cũ dạng string được migrate an toàn. Khi Order `COMPLETED/CANCELLED`, persistent token bị dọn nhưng tab hiện tại giữ session fallback đến khi đóng/refresh.
- Hủy đơn gửi `expectedVersion`, lý do và `Idempotency-Key`; mutation không tự retry. API quyết định trạng thái có hợp lệ và giải phóng reservation atomic.
- Logout, token hết hạn hoặc đổi tài khoản phải xóa private TanStack Query cache; UI không render cached Order khi chưa authenticated.
- Danh sách dùng server pagination; cancel thành công cập nhật detail và invalidate toàn bộ Account Order list.
- Payment mutation cập nhật Payment detail và invalidate cả Order detail lẫn mọi trang Account Order list vì `paymentStatus` là summary của Order.
- Lỗi localStorage sau khi server tạo Order không được biến thành lỗi đặt hàng; UI cảnh báo khách lưu mã đơn/liên hệ cửa hàng.
- DTO/request chỉ nhập từ `src/generated/api/orders`; không hard-code endpoint.

## Checklist khi sửa

- [ ] Không cache công khai order/customer data hoặc đưa vào service worker allowlist.
- [ ] Giữ loading/empty/unauthorized/not-found/error/success/cancel states.
- [ ] Retry cùng payload phải giữ cùng idempotency key; payload đổi phải tạo key mới.
- [ ] Thay đổi contract phải sửa API/OpenAPI trước rồi regenerate.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.2.0 | 2026-09-12 | Thêm Guest token TTL/terminal cleanup và Payment→Order list invalidation. | API-20260912-ORDER-GUEST-HARDENING |
| 1.1.0 | 2026-09-11 | Hardening cache isolation, pagination, cancel invalidation và Guest storage fallback. | CLIENT-20260911-ORDER-S41-HARDENING |
| 1.0.1 | 2026-09-11 | Tách guest Order token theo orderNo khỏi vòng đời cart kế tiếp. | CLIENT-20260911-GUEST-ORDER-TOKEN-STORE |
| 1.0.0 | 2026-09-11 | Tạo Account list và Guest/Account detail/cancel flow. | API-20260911-ORDER-OWN-ACCESS-TRANSITIONS |
