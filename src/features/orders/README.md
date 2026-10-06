# Storefront Orders — maintenance note

> **Document version:** 1.8.0
>
> **Last updated:** 2026-10-06
>
> **Change summary:** Hook idempotency chuyển sang `src/shared/hooks`; upload minh chứng thanh toán dùng helper chung `src/lib/api/signed-media-upload.ts` và lỗi upload chuẩn hoá thành `ApiError` có câu tiếng Việt; phân trang dùng `PaginationControls` của shared.

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

## Tra cứu đơn bằng OTP email (V1.1)

- `/orders/lookup` (`pages/guest-order-lookup-page.tsx`, `hooks/use-guest-order-lookup.ts`): bước 1 `{orderNo, email}` → `createGuestOrderLookupChallenge`; bước 2 mã 6 số → `verifyGuestOrderLookup` → lưu grant `{orderNo, lookupToken, expiresAt}` rồi mở `/orders/[orderNo]`. Gửi lại mã sau 60 giây.
- SECURITY: bước 1 luôn hiện cùng một câu ("nếu thông tin khớp, mã đã được gửi") và luôn chuyển sang bước nhập mã — không tiết lộ đơn/email có tồn tại. API trả 202 cùng body trong mọi trường hợp.
- Grant (`model/guest-order-lookup.store.ts`) chỉ ở **sessionStorage** (mất khi đóng tab), bỏ khi hết hạn; storage bị chặn thì giữ trong bộ nhớ cho lần điều hướng hiện tại. Không bao giờ localStorage.
- `useOrderDetail` chọn `accessMode`: `account` → `guest-cart` (`x-cart-token`, có quyền thanh toán/huỷ) → `lookup` (`getGuestOrderByLookup` + header `x-order-lookup-token`, query key `getGetGuestOrderByLookupQueryKey`) → `none`. Chế độ `lookup` **chỉ xem**: ẩn khối thanh toán, `canCancel = false`, hiện thời điểm hết hạn.
- **Không tiết lộ đơn nào có thật.** Bước 1 luôn hiện đúng một câu (`GUEST_LOOKUP_COPY.sent`) và luôn sang bước 2, dù cặp `orderNo + email` có khớp hay không. Bước 2: API trả **duy nhất** 400 `GUEST_LOOKUP_INVALID` cho mọi lý do thất bại (mã sai, hết hạn, không có challenge, hết lượt thử, đơn không tồn tại) — lý do thật chỉ nằm trong log server. Vì vậy client map tất cả về một câu `GUEST_LOOKUP_INVALID_MESSAGE` và **không** được suy lý do từ status hay `message` của backend; làm vậy sẽ dựng lại đúng kênh rò rỉ mà API đã bịt. Test khoá bất biến này: `model/guest-order-lookup-error.test.ts`.
- Mã lỗi còn lại: `GUEST_LOOKUP_TOKEN_INVALID`/401 (grant chết → dọn sessionStorage, mời xác thực lại), `GUEST_LOOKUP_UNAVAILABLE`/503 (server thiếu khoá HMAC → tạm ngưng), 429 không mã (throttle theo IP ở tầng ngoài).
- `GUEST_LOOKUP_LOCKED` đã bị **gỡ khỏi API**. `GuestLookupErrorCode.LOCKED_LEGACY` + `isGuestLookupLocked` chỉ còn là nhánh dự phòng cho backend cũ chưa deploy: dùng chung câu của `INVALID` nên không lộ thêm gì, chỉ khác ở chỗ xoá mã đang nhập và buộc gửi mã mới. Xoá được khi mọi môi trường đã lên bản đã hardening.
- Lối vào: trạng thái "không có mã truy cập" của trang chi tiết đơn, trang `/orders` khi chưa đăng nhập, và gợi ý trong widget trợ lý khi khách ẩn danh hỏi về đơn. Barrel export `GUEST_LOOKUP_ROUTE`, `readLatestGuestOrderLookupGrant`, `clearGuestOrderLookupGrant` cho `features/assistant`.

## Cấu trúc

| File | Vai trò |
| --- | --- |
| `pages/order-detail-page.tsx` | Chỉ ghép hook và component; giữ `showTimeline`/`showSupportModal` ở page để state không reset khi block bị unmount. |
| `hooks/use-order-detail.ts` | Chọn Guest/Account, query detail, thu hồi guest token khi đơn kết thúc, `view`, `canCancel`. |
| `hooks/use-cancel-order.ts` | Mutation hủy + idempotency key theo chữ ký `id:version:reason` (`useSignatureIdempotencyKey` từ `@/shared/hooks`, dùng chung với Returns). |
| `api/payment-evidence-upload.ts` | Chỉ xin chữ ký qua SDK payments (Account hoặc Guest `x-cart-token`) rồi gọi `uploadSignedMedia`. Upload ảnh ký sẵn dùng helper chung `src/lib/api/signed-media-upload.ts` (kiểm MIME/`maxBytes`, 9 field FormData, POST bằng `fetch` có `AbortSignal`); lỗi HTTP/mạng khi tải lên chuẩn hoá thành `ApiError(status, { message: 'Cloudinary không nhận được ảnh. Vui lòng thử lại.' })` (`status = 0` khi mất mạng), huỷ qua signal ném lại lỗi abort gốc. |
| `hooks/use-reorder.ts`, `use-order-copy.ts`, `use-order-detail-toast.ts` | Mua lại; 3 cờ copy (`copiedTrackingNo` dùng chung cho hai nút copy mã vận đơn); toast cục bộ của trang. |
| `components/order-detail/*` | Header, trạng thái, stepper mốc (bản desktop và mobile), vận chuyển, sản phẩm, hóa đơn, hành động, địa chỉ, hỗ trợ, dialog hủy (`CANCEL_REASONS`) và dialog hỗ trợ. |
| `hooks/use-account-orders.ts`, `use-order-payment.ts` | Danh sách đơn có phân trang; trạng thái thanh toán + gửi bằng chứng chuyển khoản. |
| `model/order-detail-error.ts` | Map lỗi truy cập đơn sang thông báo. |

Orders chỉ được import `returns`, `reviews` (và `auth`, `cart`) qua barrel; `yarn lint` chặn phần còn lại. `assistant` được import barrel của Orders.

## Checklist khi sửa

- [ ] Không cache công khai order/customer data hoặc đưa vào service worker allowlist.
- [ ] Giữ loading/empty/unauthorized/not-found/error/success/cancel states.
- [ ] Retry cùng payload phải giữ cùng idempotency key; payload đổi phải tạo key mới.
- [ ] Thay đổi contract phải sửa API/OpenAPI trước rồi regenerate.

## Tiến trình đơn và Vận chuyển (2026-09-28)

- `toOrderMilestones` dựng 5 mốc giao nhận độc lập: Đặt hàng thành công → Đã xác nhận đơn hàng → Đã xuất kho/Đóng gói → Đang giao hàng → Đã giao hàng (kèm mốc "Đơn đã hủy" nếu đơn hủy).
- Trạng thái thanh toán (đặc biệt là COD) được tách khỏi thanh tiến trình giao hàng để tránh khách hàng hiểu nhầm bước thanh toán nằm giữa chuỗi xử lý kho.
- Khối "Thông tin vận chuyển thực tế" tổng hợp Đơn vị vận chuyển, Mã vận đơn điện tử (kèm sao chép nhanh), Thời gian dự kiến giao và Tình trạng bưu kiện; link theo dõi trực tiếp từ `shipment.trackingUrl`.
- Hỗ trợ theo ngữ cảnh: Nút hủy đơn chỉ kích hoạt khi đơn còn ở trạng thái `PENDING_CONFIRMATION` và `PENDING` fulfillment. Khi đơn đã xuất kho/đang giao, giao diện thay bằng nút "Liên hệ hỗ trợ đơn" tự đính kèm mã đơn để tiện thoại/chat với CSKH.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.8.0 | 2026-10-06 | Hook idempotency về `src/shared/hooks`; upload minh chứng dùng `src/lib/api/signed-media-upload.ts`, lỗi upload là `ApiError` có message tiếng Việt (trước là message Axios tiếng Anh); `PaginationControls` dùng chung với Returns; chuyển UI sang primitive foundation. | feat/storefront-brand-ui-refresh (dedup) |
| 1.7.0 | 2026-09-30 | Một câu lỗi duy nhất cho mọi thất bại `verify`; `GUEST_LOOKUP_LOCKED` thành nhánh dự phòng; map `GUEST_LOOKUP_UNAVAILABLE`. | feat/assistant-v1 (V1.1 guest lookup hardening) |
| 1.6.0 | 2026-09-30 | Tra cứu đơn khách vãng lai bằng OTP email, grant sessionStorage, chế độ xem "lookup". | feat/assistant-v1 (V1.1 guest lookup) |
| 1.5.0 | 2026-09-29 | Tách order-detail thành 5 hook + 15 component và đưa data danh sách/thanh toán vào hook, không đổi hành vi; thêm mục Cấu trúc. | Client restructure (order detail split) |
| 1.4.0 | 2026-09-28 | Tách tiến trình giao nhận và thanh toán, nổi bật trạng thái đơn, thêm khối thông tin vận chuyển và hỗ trợ ngữ cảnh. | UX-REVIEW-ORDER-TRACKING-20260928 |
| 1.3.0 | 2026-09-26 | Tiến trình theo mốc, mã vận đơn và link theo dõi. | API-20260926-ORDER-TRACKING-VNPAY-RULES |
| 1.2.0 | 2026-09-12 | Thêm Guest token TTL/terminal cleanup và Payment→Order list invalidation. | API-20260912-ORDER-GUEST-HARDENING |
| 1.1.0 | 2026-09-11 | Hardening cache isolation, pagination, cancel invalidation và Guest storage fallback. | CLIENT-20260911-ORDER-S41-HARDENING |
| 1.0.1 | 2026-09-11 | Tách guest Order token theo orderNo khỏi vòng đời cart kế tiếp. | CLIENT-20260911-GUEST-ORDER-TOKEN-STORE |
| 1.0.0 | 2026-09-11 | Tạo Account list và Guest/Account detail/cancel flow. | API-20260911-ORDER-OWN-ACCESS-TRANSITIONS |
