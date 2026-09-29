# Storefront features — maintenance guide

> **Document version:** 1.3.1
>
> **Last updated:** 2026-09-29
>
> **Change summary:** Bỏ cạnh `assistant → catalog` (thẻ chat đã có `productId`/`variantId`); còn `assistant → support, orders`.

## Luồng phụ thuộc chuẩn

```text
Next.js app route (server-first)
  → feature page/composition
    → narrow client component/hook khi cần tương tác
      → generated Storefront SDK
        → shared Axios transport
```

- `app/` khai báo route, metadata và boundary của Next.js; không đặt commerce workflow dài tại đây.
- `features/<domain>` sở hữu UI và orchestration của một domain. `features/<domain>/index.ts` là public API duy nhất; mọi import từ ngoài feature (kể cả `widgets`, kể cả feature khác) phải qua barrel này, không deep-import `model/`, `components/`, `hooks/` trực tiếp.
- `widgets/` chỉ dành cho khối ghép nhiều feature hoặc xuất hiện xuyên nhiều route.
- `shared/` chứa thành phần trung lập thật sự; không chuyển policy catalog/cart/checkout vào shared.
- `src/generated/api` là output Orval, read-only.

## Bản đồ feature hiện tại

| Feature | Trách nhiệm | State/boundary chính |
| --- | --- | --- |
| `home` | Landing và discovery | Ưu tiên server/static content; animation không được làm chậm LCP. |
| `catalog` | Danh sách/detail, variant và purchase panel | Giá/tồn hiển thị chỉ là snapshot cho tới Checkout. |
| `cart` | Giỏ hàng xuyên route | Redux giữ interaction snapshot; Backend cart là nguồn kiểm tra khi checkout. |
| `checkout` | Quote, branch/shipping/payment choice và reservation | Local page state + generated API; xem README trong feature. |
| `auth` | Register/login/session customer | Token qua shared transport; không import Admin auth operation. |
| `profile` | Hồ sơ/địa chỉ customer | Dữ liệu private không cache offline công khai. |
| `returns` | Khách tạo/theo dõi/huỷ yêu cầu trả hàng | Luật lấy từ API eligibility; route `/returns` network-only trong SW. Xem README trong feature. |
| `content` / `reviews` | Bài viết và social proof | Public read; nội dung rich text phải sanitize theo boundary hiện tại. |
| `address` | Tra cứu địa giới hành chính VN, chọn/định dạng địa chỉ giao hàng | Dùng bởi `checkout`, `profile`; không giữ policy đơn hàng. |
| `site-config` | Tham số hệ thống công khai (public system parameter) | Chỉ đọc, cache ngắn hạn qua TanStack Query. |
| `assistant` | Widget chat "Trợ lý mua sắm" nổi trên mọi trang storefront | Chỉ launcher trong bundle đầu; panel tải lười. Tin nhắn trong cache Query; session ẩn danh ở localStorage. Xem README trong feature. |
| `support` | Trang liên hệ và phiếu hỗ trợ của khách (`/account/support*`) | Private, network-only; không bao giờ hiện ghi chú nội bộ. Xem README trong feature. |

## Ma trận feature → feature

Chỉ được import feature khác qua barrel `index.ts` của feature đích, và chỉ theo các cạnh sau:

| Feature | Được phụ thuộc |
| --- | --- |
| mọi feature | `auth`, `cart` |
| `checkout` | `orders`, `address` |
| `orders` | `returns`, `reviews` |
| `home` | `catalog`, `content`, `reviews`, `promotions` |
| `assistant` | `support` (handoff, thẻ phiếu), `orders` (nhãn trạng thái thẻ đơn) |

Không có cạnh nào khác. `auth` và `cart` không phụ thuộc feature nào ngoài nhau.

## State ownership

| Loại state | Owner |
| --- | --- |
| API response/cache | TanStack Query hoặc server fetch/generated SDK |
| Cart tương tác xuyên header/cart/checkout | Redux Toolkit/Saga |
| Form/quote tạm trong một route | Component state hoặc React Hook Form |
| Auth token/refresh | Shared API transport/auth store |
| PWA cache | Service worker policy; không dùng Redux |

Không sao chép cùng một API payload vào Redux và TanStack Query. Nếu state không đi qua route khác, ưu tiên giữ trong feature.

## Khi nào cần comment

- Server/client boundary không hiển nhiên.
- Lý do cache/offline không được áp dụng cho price, stock, checkout hoặc dữ liệu private.
- Guest/account workflow khác nhau nhưng dùng chung UI.
- Idempotency, optimistic version hoặc retry cần giữ cùng request identity.
- Workaround trình duyệt/provider có điều kiện gỡ bỏ rõ ràng.

## Checklist khi sửa feature

- [ ] Public page mặc định server component; `'use client'` chỉ ở boundary cần tương tác/browser API.
- [ ] Loading, empty, error, offline, not-found và stale price/stock được xử lý.
- [ ] Chỉ import Storefront generated operation; không gọi URL/Axios trực tiếp trong UI.
- [ ] Mobile-first, keyboard/focus, ảnh responsive và layout shift được kiểm tra.
- [ ] Không cache public các request auth/cart/checkout/payment/customer.
- [ ] API contract đổi thì sync/regenerate, không sửa generated output.
- [ ] Rule commerce quan trọng có test; build production phải đạt.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.3.1 | 2026-09-29 | Bỏ cạnh `assistant → catalog`. | feat/assistant-v1 review fixes |
| 1.3.0 | 2026-09-29 | Thêm `assistant`, phiếu hỗ trợ trong `support`; cạnh `assistant → support, orders, catalog`. | feat/assistant-v1 |
| 1.2.0 | 2026-09-28 | Thêm feature `address`, `site-config`; ma trận feature → feature; bắt buộc barrel `index.ts`. | client-restructure |
| 1.1.0 | 2026-09-24 | Thêm feature `returns`. | API-20260924-RETURN-EVIDENCE-IMAGES |
| 1.0.0 | 2026-09-09 | Tạo bản đồ và quy tắc maintenance cho Storefront features. | DOC-20260909-FEATURE-MAINTENANCE-NOTES |
