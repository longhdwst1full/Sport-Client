# Storefront PWA — maintenance note

> **Document version:** 1.3.0
>
> **Last updated:** 2026-09-27
>
> **Change summary:** Tách luật định tuyến worker ra `public/sw-routing.js` có unit test; cache v4 theo nhóm (shell/static/images/pages/api), SWR có giới hạn tuổi cho API tham chiếu công khai, dọn cache khi đăng xuất, icon maskable/apple-touch.

## Phạm vi và cache contract

- `public/sw.js` nối Cache/Fetch API; **mọi luật** nằm trong `public/sw-routing.js` (hàm thuần, nạp bằng `importScripts`, test ở `src/pwa/sw-routing.test.ts`). `src/pwa/pwa-registration.tsx` chỉ đăng ký ở production, kiểm tra update và chỉ kích hoạt worker chờ sau khi người dùng bấm "Cập nhật" (`SKIP_WAITING`).
- Cache `dctd-storefront-<nhóm>-v4`; activate chỉ xoá cache có prefix này mà không thuộc phiên bản hiện tại. Nhóm runtime bị cắt theo số entry (`CACHE_LIMITS`).

| Nhóm | Chiến lược | Phạm vi |
| --- | --- | --- |
| shell | precache lúc install | `/`, `/offline`, manifest, icon |
| static | cache-first | `/_next/static/*`, icon, manifest |
| images | cache-first | `/_next/image`, `/images/*` cùng origin (ảnh origin khác là opaque → bỏ qua) |
| pages | network-first, offline dùng bản cache | `/`, `/category`, `/news`, `/news/:slug`, `/chinh-sach`, `/chinh-sach/:slug`, `/contact` không có query |
| api | SWR ≤ 5 phút, quá hạn thì network-first, offline dùng bản cũ | `GET /api/v1/catalog/categories`, `/content/posts[/:slug]`, `/shipping/areas/*`, `/system/parameters/public` |

- **Luôn bỏ qua** (browser tự xử lý): mọi method khác GET; mọi request có header `Authorization`; `/api/v1/(auth|account|me|customers|carts|checkouts|orders|payments|returns|admin)`; sản phẩm/đánh giá/flash sale (giá, tồn kho, suất); RSC payload; `/admin`.
- Navigation `/cart`, `/checkout`, `/profile`, `/orders`, `/returns`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/pwa` là network-only; offline chỉ nhận `/offline` tĩnh.
- Trang sản phẩm/danh mục con không vào cache trang vì HTML có giá (`04-offline-commerce-ux.md`).
- `Set-Cookie` không đọc được trong service worker (forbidden header); cookie endpoint bị chặn bằng allowlist đường dẫn, response còn bị loại khi `Cache-Control: no-store|private` hoặc `Vary: Cookie|Authorization|*`.
- Đăng xuất/đổi tài khoản (`src/app/providers.tsx`): xoá React Query cache, reset giỏ, `clearSessionPwaCaches()` xoá nhóm `api`/`pages`. Token khách vãng lai (`guest-order-access.store`) giữ nguyên vì không thuộc tài khoản và có TTL riêng.
- Reset: trang `/pwa` (`resetPwaAndReload`) hoặc message `CLEAR_CACHES` / `CLEAR_SESSION_CACHES` gửi tới worker.
- Không queue cart/checkout/payment/order mutation. Mọi mutation commerce vẫn online-only và không tự retry.

## Checklist khi sửa

- [ ] Tăng cache version nếu thay đổi asset/cache semantics.
- [ ] Không mở rộng runtime cache ngoài public allowlist khi chưa review dữ liệu cá nhân và stale commerce data.
- [ ] Giữ user-confirmed `SKIP_WAITING`, offline banner và `/pwa` diagnostics/reset.
- [ ] Production build pass; kiểm tra install, offline navigation, update và reset trên HTTPS.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.3.0 | 2026-09-27 | `sw-routing.js` + unit test, cache v4 theo nhóm, SWR API tham chiếu, cache trang biên tập, dọn cache khi đăng xuất, icon maskable/apple-touch. | CLIENT-20260927-CACHE-PWA-SEO |
| 1.2.0 | 2026-09-18 | Reset chỉ unregister worker của Storefront; thêm ca kiểm thử PWA. | E2E review |
| 1.1.0 | 2026-09-18 | Thêm PNG icon 192/512, đưa vào public shell, tăng cache v3. | B7 — PWA installability |
| 1.0.0 | 2026-09-11 | Prefix-scoped cleanup, cache v2 và offline fallback cho route online-only. | CLIENT-20260911-PWA-ORDER-HARDENING |
