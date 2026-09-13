# Storefront Cart — maintenance note

> **Document version:** 1.0.0
>
> **Last updated:** 2026-09-13
>
> **Change summary:** Tạo note; ghi rõ cart hiện là state cục bộ, chưa đồng bộ server cart.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Trang `/cart`, token giỏ hàng khách vãng lai | Quote/reserve/confirm — thuộc `features/checkout` |
| Hiển thị snapshot tên/giá đã lưu | Tính số tiền phải trả cuối cùng |

## Server/client boundary

`pages/cart-page.tsx` là client (đọc Redux). Route `/cart` chỉ là vỏ.

## Public entry

`index.ts` — `CartPage` + `model/guest-cart-token.store`.

## Generated operation — **khoảng trống đã biết**

Domain `cart` sinh đủ mutation guest/account (`useCreateGuestCart`, `useSetGuestCartItem`, `useUpdateGuestCartItem`, `useRemoveGuestCartItem` và bản Account) nhưng **chỉ `features/checkout/api/checkout.workflow.ts` gọi**. Giỏ hàng hiển thị vẫn thuần Redux.

Hệ quả: giỏ không đồng bộ giữa thiết bị. Đây là việc chưa làm, không phải dead code (`RULE-CTR-06`).

## State owner

Redux + Saga (`src/app/store/cart.slice.ts`, `root.saga.ts`) — đây là ngoại lệ duy nhất được phép giữ state thương mại tương tác (`07-state-tools-performance.md`).

Persist allowlist: `productId, variantId, sku, productType, name, price, quantity`. Hydration loại field lạ qua `createBrowserStore` + `isCartItem`.

## Cache / offline

- Giỏ lưu local **không phải** đơn đã đặt hay chỗ đã giữ. Tên/giá chỉ là snapshot hiển thị; checkout tải lại dữ liệu thật (`04-offline-commerce-ux.md`).
- Token guest cart lưu chuỗi thô (không JSON-encode) — đổi format sẽ làm khách mất giỏ sau deploy.

## Checklist khi sửa

- [ ] Không tính tiền phải trả từ snapshot đã lưu.
- [ ] Không thêm field PII/thanh toán vào allowlist persist.
- [ ] Đổi khoá lưu trữ phải có đường migrate, không được im lặng làm mất giỏ.

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.0.0 | 2026-09-13 | Tạo note, ghi nhận cart SDK chưa được nối. |
