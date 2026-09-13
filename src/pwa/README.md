# Storefront PWA — maintenance note

> **Document version:** 1.0.0
>
> **Last updated:** 2026-09-11
>
> **Change summary:** Ghi nhận cache boundary, update flow, offline fallback và reset scope an toàn cho Storefront.

## Phạm vi và cache contract

- `public/sw.js` là service worker source; `src/components/pwa-registration.tsx` đăng ký, kiểm tra update và chỉ kích hoạt worker chờ sau xác nhận người dùng.
- Cache prefix là `dctd-storefront-`; activate/reset chỉ được xóa cache có prefix này.
- Route `/`, Next static asset, manifest, icon và trang `/offline` thuộc public shell/cache allowlist.
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
| 1.0.0 | 2026-09-11 | Prefix-scoped cleanup, cache v2 và offline fallback cho route online-only. | CLIENT-20260911-PWA-ORDER-HARDENING |
