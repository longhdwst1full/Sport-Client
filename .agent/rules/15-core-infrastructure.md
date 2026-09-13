# Storefront core infrastructure

`src/core` sở hữu hạ tầng trình duyệt dùng chung: storage, session. Transport nằm ở `src/lib/api` (adapter Orval), giống Admin — không tách đôi. Kế thừa `core/` của `dragon-web-v2` nhưng cắt gọn theo nhu cầu storefront.

## RULE-CORE-01: Feature không chạm storage trực tiếp (P0)

```ts
// ❌ trong feature
localStorage.setItem('dctd.cart.guestToken', token);

// ✅ qua adapter core, feature chỉ sở hữu key + schema
import { createBrowserStore } from '@/core/storage';
export const guestCartTokenStore = createBrowserStore<string>('dctd.cart.guestToken');
```

Lý do: hydration phải chạy đúng một chỗ, chịu được storage hỏng/bị chặn và chỉ chạy trên browser (`07-state-tools-performance.md`).

## RULE-CORE-02: Một transport duy nhất (P0)

`src/lib/api/fetcher.ts` là mutator Orval duy nhất. Feature **không** import `axios`. Core không chứa đường dẫn endpoint hay DTO nghiệp vụ (`02-api-contract.md`).

## RULE-CORE-03: Core không import feature (P0)

Chiều phụ thuộc: `app → widgets/features → foundation/shared → core/lib`. Core import ngược lên feature là lỗi kiến trúc.

## RULE-CORE-04: Token nằm ở cookie, không ở web storage (P0)

Theo `admin-client` và `dragon-web-v2` (`core/storage/auth/auth-service.ts`).

```ts
// ❌ localStorage/sessionStorage giữ token: không có hạn, không có SameSite/Secure
window.localStorage.setItem('auth', JSON.stringify(tokens));

// ✅ AuthService: memory trước, cookie làm lớp bền
import { AuthService } from '@/core/storage';
AuthService.save(tokens); // Max-Age = expiresIn, SameSite=Lax, Secure trên https
```

`AuthService` là API token duy nhất; feature không tự đọc cookie hay storage. Khi
`AUTH_TOKEN_TRANSPORT=COOKIE`, server sở hữu HttpOnly cookie và client **không** giữ bản sao.

## RULE-CORE-05: Không cache dữ liệu riêng tư trong core (P0)

Token, PII, payload thanh toán không được ghi vào cache dùng chung (`03-pwa-security-caching.md`).
