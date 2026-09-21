# Storefront Auth — maintenance note

> **Document version:** 1.1.0
>
> **Last updated:** 2026-09-21
>
> **Change summary:** Đồng bộ LoginDto remember-me; Storefront V1 mặc định dùng session refresh cookie.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Đăng nhập/đăng ký customer, lưu trữ token, trạng thái đăng nhập | Auth của Admin (repo `dctd-utc/admin`) |
| Chuẩn hoá lỗi auth cho UI (`model/auth-error.ts`) | Xoay token trên 401 — thuộc `lib/api/fetcher.ts` |
| Phát sự kiện `dctd:auth-change` khi phiên đổi | Xoá cache TanStack Query khi đổi subject — thuộc `app/providers.tsx` |

## Server/client boundary

Toàn bộ feature là client: `pages/customer-login-page.tsx`, `pages/customer-register-page.tsx`, `hooks/use-customer-auth.ts`. Route `/login`, `/register` chỉ là vỏ.

## Public entry

`index.ts` — `CustomerLoginPage`, `CustomerRegisterPage`, `useCustomerAuth`, và toàn bộ `model/auth-token.store`, `model/auth-error`.

## Generated operation

| Dùng | Nguồn |
| --- | --- |
| `useLoginCustomer` | `src/generated/api/auth/auth.ts` |
| `useRegisterCustomer` | `src/generated/api/auth/auth.ts` |

Chưa dùng: `useLogoutCustomer`, `useRefreshCustomerToken`, `getCustomerCurrentUser`. Logout hiện chỉ xoá token phía client; refresh do fetcher tự gọi. Ghi nhận theo `RULE-CTR-06`.

## State owner

`AuthService` (`src/core/storage/auth`) sở hữu token. Feature **không** đọc cookie/localStorage trực tiếp (`15-core-infrastructure.md` RULE-CORE-04).

## Cache / bảo mật

- Token nằm ở cookie `SameSite=Lax`, `Secure` trên https, `Max-Age` = `expiresIn`. Không ghi vào `localStorage`/`sessionStorage`.
- `NEXT_PUBLIC_AUTH_TOKEN_TRANSPORT=COOKIE` ⇒ server sở hữu HttpOnly cookie, client không giữ bản sao.
- Storefront hiện gửi `rememberMe=false`; refresh cookie hết khi đóng phiên trình duyệt. Chỉ thêm lựa chọn lưu dài hạn khi UX khách hàng được chốt, không tự đặt mặc định `true`.
- Route auth là class A (online-only), service worker không cache.

## Checklist khi sửa

- [ ] Không thêm nơi lưu token thứ hai; mọi thay đổi đi qua `AuthService` và test `core/storage/auth/auth-service.test.ts`.
- [ ] Giữ `dctd:auth-change` để `Providers` còn xoá được query cache khi đổi tài khoản.
- [ ] 4xx là kết quả nghiệp vụ cuối cùng, không phải trạng thái offline (`04-offline-commerce-ux.md`).

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.1.0 | 2026-09-21 | Đồng bộ `LoginDto.rememberMe`; giữ Storefront ở session-cookie mode. |
| 1.0.0 | 2026-09-13 | Tạo note cùng đợt chuyển token sang cookie. |
