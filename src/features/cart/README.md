# Storefront Cart — maintenance note

> **Document version:** 2.5.0
>
> **Last updated:** 2026-11-07
>
> **Change summary:** `CartItem.availableQuantity` (ảnh chụp) + `useCartStockLimits` (đọc giỏ server); dòng vượt tồn bị cảnh báo và khoá "Đặt hàng".

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Trang `/cart`, token giỏ hàng khách vãng lai | Quote/reserve/confirm — thuộc `features/checkout` |
| Hiển thị snapshot tên/giá đã lưu | Tính số tiền phải trả cuối cùng |

## Server/client boundary

`pages/cart-page.tsx` là client (đọc Redux). Route `/cart` chỉ là vỏ.

## Public entry

`index.ts` — `CartPage` + `model/guest-cart-token.store`.

## Gộp giỏ khi đăng nhập / đăng ký

`api/merge-guest-cart.ts` gọi `mergeGuestCartIntoAccount` ngay sau khi login hoặc register thành công.

**Kịch bản:** khách duyệt web, bỏ hàng vào giỏ, đến lúc thanh toán mới tạo tài khoản. Không gộp thì giỏ vừa chọn biến mất đúng lúc khách sắp mua.

| Tình huống | Kết quả |
| --- | --- |
| Cùng biến thể ở cả hai giỏ | **Cộng dồn số lượng** — khách đã chủ động chọn ở cả hai phiên |
| Biến thể chỉ có ở giỏ vãng lai | Tạo dòng mới trong giỏ tài khoản |
| Gọi lại lần hai cùng token | Không cộng thêm — giỏ vãng lai đã chuyển `CONVERTED` |
| Token sai hoặc hết hạn | Không lỗi, trả giỏ tài khoản hiện tại |

Guest token vẫn chỉ tồn tại trên cùng trình duyệt. Sau khi đăng nhập, `account cart` trên server là nguồn chung: thiết bị đẩy thay đổi qua API và lần đăng nhập ở thiết bị khác pull lại cùng giỏ.

**Lỗi khi gộp không chặn đăng nhập.** Khách đã xác thực xong rồi; hỏng việc gộp giỏ thì cùng lắm mất giỏ tạm, không được làm mất phiên.

## Generated operation

| Dùng | Ở đâu |
| --- | --- |
| `mergeGuestCartIntoAccount` | `api/merge-guest-cart.ts` |
| `getAccountCart`, `setAccountCartItem`, `removeAccountCartItem` | `api/cart-sync.ts` |
| `createGuestCart`, `setGuestCartItem`, quote/reserve/confirm | `features/checkout/api/checkout.workflow.ts` |

`api/cart-sync.ts` reconcile từng dòng server, bỏ dòng không còn ở local, xử lý SKU ngừng bán và pull `account cart` về Redux sau đăng nhập. Redux giữ state tương tác của tab hiện tại; API là authority đồng bộ tài khoản.

## State owner

Redux + Saga (`src/app/store/cart.slice.ts`, `root.saga.ts`) — đây là ngoại lệ duy nhất được phép giữ state thương mại tương tác (`07-state-tools-performance.md`).

Persist allowlist: `productId, variantId, sku, productType, name, price, quantity`. Hydration loại field lạ qua `createBrowserStore` + `isCartItem`.

## Cache / offline

- Giỏ lưu local **không phải** đơn đã đặt hay chỗ đã giữ. Tên/giá chỉ là snapshot hiển thị; checkout tải lại dữ liệu thật (`04-offline-commerce-ux.md`).
- `cart-summary` chỉ hiện **tạm tính** theo snapshot giá của các dòng đã chọn; phí vận chuyển ghi "tính ở bước thanh toán", không ước lượng ở giỏ. Phí ship, khuyến mãi và tổng phải trả do checkout quote (`features/checkout`) quyết định.
- Token guest cart lưu chuỗi thô (không JSON-encode) — đổi format sẽ làm khách mất giỏ sau deploy.

## Checklist khi sửa

- [ ] Không tính tiền phải trả từ snapshot đã lưu.
- [ ] Không thêm field PII/thanh toán vào allowlist persist.
- [ ] Đổi khoá lưu trữ phải có đường migrate, không được im lặng làm mất giỏ.

## Chặn theo tồn (2026-11-07)

- `model/stock-limit.ts`: `maxOrderableQuantity`, `clampToStock`, `isOverStock`, `MAX_LINE_QUANTITY` (999), `LOW_STOCK_THRESHOLD` (10) — dùng chung cho PDP, giỏ, checkout qua barrel.
- Nguồn số đặt được của một dòng: `useCartStockLimits` đọc giỏ server (chỉ ĐỌC: `getAccountCart` khi đăng nhập, `getGuestCart` khi khách còn token) lấy `CartItemDto.availableQuantity`; SKU chưa có trên giỏ server rơi về ảnh chụp `CartItem.availableQuantity` (lưu lúc thêm từ PDP / tải giỏ tài khoản, có trong allowlist localStorage); không có cả hai thì không chặn. Không tạo giỏ khách mới chỉ để xem tồn.
- Slice: `addCartItem` có `availableQuantity` thì kẹp tổng (kể cả cộng dồn) về số đó và bỏ qua khi = 0; `updateQuantity` chỉ kẹp 999 — trang giỏ tự kẹp theo số mới nhất.
- Trang giỏ: nút + khoá khi chạm max, gõ tay vượt thì kẹp + toast; dòng `quantity > availableQuantity` hiện cảnh báo đỏ và nút "Đặt hàng" khoá tới khi khách sửa/xoá dòng đã chọn đó.

## Nhắc miễn phí giao theo ngưỡng (2026-11-07)

- Ngưỡng `SHIPPING_FREE_ORDER_MIN_AMOUNT` (tham số công khai, 0 = tắt) do `site-config` đọc; `cart` là kernel nên không import `site-config` — route giỏ/checkout bọc `FreeShippingBridge` (`app/(storefront)/_components`) cấp số qua `FreeShippingThresholdProvider`/`useFreeShippingThreshold`.
- `FreeShippingProgress` (giỏ + tóm tắt checkout) chỉ là NHẮC theo tạm tính client; có miễn phí hay không do báo giá checkout (`freeDeliveryReason = ORDER_AMOUNT_THRESHOLD`) quyết định.

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 2.5.0 | 2026-11-07 | `CartItem.availableQuantity` (ảnh chụp) + `useCartStockLimits` (đọc giỏ server); dòng vượt tồn bị cảnh báo và khoá "Đặt hàng". |
| 2.4.0 | 2026-10-17 | `CartItem.regularPrice` (giá niêm yết lúc thêm, lưu localStorage); chiến dịch đóng → dòng thêm với giá flash về giá niêm yết; sửa hydration làm rơi `slug`. |
| 2.3.0 | 2026-10-17 | Vượt suất flash: giỏ tách 2 phần (trong suất giá flash + phần dư giá gốc) khớp checkout tách dòng; bỏ nút "giữ giá flash"; toast nêu số lượng mỗi phần. |
| 2.2.0 | 2026-10-17 | Thêm `resolveCartLinePrice` (luật vượt suất của `CheckoutService.snapshotItems`), `CartPromoPriceProvider`/`useCartLinePricing`; dòng giỏ hiện giá flash/giá thường, cảnh báo và nút "Giảm về N để giữ giá flash", toast khi vượt ngưỡng. |
| 2.1.0 | 2026-10-06 | Giỏ hiển thị tạm tính; phí vận chuyển/tổng thanh toán ở checkout. |
| 2.0.0 | 2026-09-28 | Đồng bộ account cart đa thiết bị; merge guest rồi pull server cart sau auth. |
| 1.1.0 | 2026-09-14 | Gộp guest cart vào account khi auth. |
| 1.0.0 | 2026-09-13 | Tạo note, ghi nhận cart SDK chưa được nối. |
