# PWA — tìm và cài ứng dụng trên mobile/tablet

> **Document version:** 1.0.0
>
> **Last updated:** 2026-11-03
>
> **Change summary:** CLIENT-20261103-PWA-INSTALL: khắc phục thiếu UI cài đặt dù manifest/SW đã được phục vụ.

## Phạm vi và bằng chứng

- Public journey: khách truy cập website HTTPS → thấy hướng dẫn/cài đặt → bấm cài hoặc đóng → mở ứng dụng standalone.
- Production manifest, SW, PNG 192/512 đều trả 200 tại thời điểm kiểm tra. Source chỉ có thông báo update/offline, không có `beforeinstallprompt` hay hướng dẫn iOS.
- iOS không hỗ trợ prompt giống Chromium. Browser trong app có giới hạn cài; chỉ hướng dẫn mở browser ngoài, không bypass bảo mật.
- Ngoài scope: app native/APK, push, thay cache/offline, API hoặc DB.

## Thiết kế và checklist triển khai

- [x] Client island `src/pwa/pwa-install-prompt.tsx`, compose qua `PwaRegistration`; public route vẫn server-first.
- [x] Chromium: event do browser cấp → lưu memory → click gọi prompt → accepted/dismissed/error; không mở tự động.
- [x] iPhone/iPadOS (kể cả UA Mac + touch): hướng dẫn cài thủ công.
- [x] In-app browser: hướng dẫn mở Safari/Chrome ngoài app; UA detection best-effort.
- [x] Standalone/appinstalled ẩn banner; dismissal trong session storage qua core adapter.
- [x] `/pwa` có hướng dẫn cố định và giữ chẩn đoán/reset hiện tại.
- [x] Không che checkout/payment/customer/auth; không lưu PII hoặc đổi commerce/offline contract.
- [x] Unit test: event + gesture, dismissal, error, standalone, iPad, embedded, sensitive route.
- [x] Full lint/unit/production build và Playwright manifest/offline/reset/install UI: 58 files / 432 unit tests, 5/5 E2E pass. CDP production không báo lỗi installability/manifest. Build có cảnh báo API read 403 cần theo dõi riêng, không ảnh hưởng kết quả build PWA.
- [ ] Sau deploy, UAT native install trên Android Chrome + Safari iPhone/iPad + in-app browser thực tế.

## Responsive / accessibility / rủi ro

- Banner semantic `aside`, nút qua foundation, vùng chạm tối thiểu 44px, safe-area và chừa cột contact bên phải; link hướng dẫn là navigation thật.
- Không giả lập browser install API. Event bị chặn, private mode, browser throttling hoặc policy có thể ngăn cài; hướng dẫn vẫn hữu ích, không báo đã cài khi chưa có thao tác.
- Không nâng cache version vì không thay asset cache semantics hoặc routing worker. Không thay generated SDK/API contract.
- Browser tự quyết định event, UA và standalone là heuristic; automated test không thay thế UAT thiết bị thật.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.0.0 | 2026-11-03 | Diagnose thiếu install UI, bổ sung luồng cài và test; giữ cache/offline. | CLIENT-20261103-PWA-INSTALL |
