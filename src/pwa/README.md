# Storefront PWA — maintenance note

> **Document version:** 1.2.0
>
> **Last updated:** 2026-09-18
>
> **Change summary:** Giới hạn reset service worker vào `/sw.js` của Storefront và bổ sung kiểm thử PWA, giữ nguyên boundary dữ liệu riêng tư.

## Phạm vi và cache contract

- `public/sw.js` là service worker source; `src/components/pwa-registration.tsx` đăng ký, kiểm tra update và chỉ kích hoạt worker chờ sau xác nhận người dùng.
- Cache prefix là `dctd-storefront-`; activate/reset chỉ được xóa cache có prefix này.
- Reset chỉ unregister service worker `/sw.js` với scope gốc của Storefront; không chạm worker ứng dụng khác chung origin.
- Route `/`, Next static asset, manifest, icon và trang `/offline` thuộc public shell/cache allowlist.
- Manifest khai icon PNG 192/512 từ `public/icon.svg`; các icon chỉ là asset công khai, không có dữ liệu cá nhân.
- API, Admin và các navigation Account/Order/Profile/Checkout không bao giờ đọc personalized response từ cache. Khi mất mạng, navigation riêng tư chỉ nhận trang `/offline` tĩnh.
- Không queue cart/checkout/payment/order mutation. Mọi mutation commerce vẫn online-only và không tự retry.

## Checklist khi sửa

- [ ] Tăng cache version nếu thay đổi asset/cache semantics.
- [ ] Không mở rộng runtime cache ngoài public allowlist khi chưa review dữ liệu cá nhân và stale commerce data.
- [ ] Giữ user-confirmed `SKIP_WAITING`, offline banner và `/pwa` diagnostics/reset.
- [ ] Production build pass; kiểm tra install, offline navigation, update và reset trên HTTPS.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.2.0 | 2026-09-18 | Reset chỉ unregister worker của Storefront; thêm ca kiểm thử PWA. | E2E review |
| 1.1.0 | 2026-09-18 | Thêm PNG icon 192/512, đưa vào public shell, tăng cache v3. | B7 — PWA installability |
| 1.0.0 | 2026-09-11 | Prefix-scoped cleanup, cache v2 và offline fallback cho route online-only. | CLIENT-20260911-PWA-ORDER-HARDENING |
