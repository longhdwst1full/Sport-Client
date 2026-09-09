# Storefront features — maintenance guide

> **Document version:** 1.0.0
>
> **Last updated:** 2026-09-09
>
> **Change summary:** Bổ sung bản đồ feature, state ownership và checklist bảo trì cho Sport Client.

## Luồng phụ thuộc chuẩn

```text
Next.js app route (server-first)
  → feature page/composition
    → narrow client component/hook khi cần tương tác
      → generated Storefront SDK
        → shared Axios transport
```

- `app/` khai báo route, metadata và boundary của Next.js; không đặt commerce workflow dài tại đây.
- `features/<domain>` sở hữu UI và orchestration của một domain.
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
| `content` / `reviews` | Bài viết và social proof | Public read; nội dung rich text phải sanitize theo boundary hiện tại. |

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
| 1.0.0 | 2026-09-09 | Tạo bản đồ và quy tắc maintenance cho Storefront features. | DOC-20260909-FEATURE-MAINTENANCE-NOTES |
