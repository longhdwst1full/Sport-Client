# Kịch bản Playwright — Storefront

> **Document version:** 1.0.1
>
> **Last updated:** 2026-09-18
>
> **Change summary:** Tổng hợp luồng Client đã kiểm, bổ sung PWA, tách DB test cô lập và đặt output Playwright trong `.playwright/` đã ignore.

## Nguyên tắc môi trường

- Mặc định Playwright chạy production build trên cổng 3199, API đọc từ `E2E_API_URL`.
- Artifact/report sinh ra ở `.playwright/artifacts` và `.playwright/report` (đã ignore), không ghi đè artifact lịch sử trong `e2e/`.
- Các ca hiện có chỉ GET catalog/content và thao tác giỏ cục bộ trong browser context. Không tạo đơn, thanh toán, tài khoản hay sửa Supabase dùng chung.
- Ca có POST/PATCH/DELETE thật phải dùng database test cô lập với seed có thể lặp lại và cleanup theo ID của lần chạy. Không chạy trên DB dev/prod dùng chung.
- Không gọi test dùng API thật là “test cô lập”: thay đổi catalog/seed có thể khiến chúng thất bại dù code không đổi.

## Ma trận kịch bản

| Nhóm | Hiện có | Kịch bản chính | Còn thiếu |
| --- | ---: | --- | --- |
| Trang chủ/danh mục | 14 | điều hướng, tab, sản phẩm thật, sort/filter, link chi tiết | ảnh lỗi, màn hình nhỏ, loading API chậm |
| Chi tiết/tìm kiếm | 9 | slug thật/404, metadata, số lượng, giỏ, gợi ý tìm kiếm | biến thể/combo không còn hàng, lỗi API 5xx |
| Giỏ hàng | 6 | rỗng, thêm/tăng/xoá, tổng tiền, reload | giá/tồn thay đổi sau khi lưu giỏ |
| Chính sách/SEO/smoke | 9 | bài thật, breadcrumb, 404 đúng HTTP status | news 5xx, cache revalidation |
| PWA | 3 | manifest/icon 192–512, banner mất mạng, reset cache đúng prefix | cài đặt trên HTTPS, update prompt, offline navigation sau activate |
| Auth/Checkout/Orders | 0 | — | môi trường test cô lập: login/guest, quote, idempotency, thanh toán, xem đơn |

## Ca PWA mới — `e2e/specs/pwa.spec.ts`

| ID | Điều kiện | Kết quả mong đợi |
| --- | --- | --- |
| PWA-01 | GET manifest và icon | `standalone`, hai PNG 192/512 trả 200 đúng MIME |
| PWA-02 | Mất kết nối khi đang ở `/pwa` | Banner nói rõ đặt hàng/thanh toán cần mạng |
| PWA-03 | Reset với cache của Storefront và ứng dụng khác | Chỉ cache prefix `dctd-storefront-` bị xoá |

## Thứ tự bổ sung tiếp

1. API lỗi/timeout ở danh sách và chi tiết: error, retry, không hiển thị giá/tồn giả.
2. Biến thể/combo và giỏ: hết hàng, thay đổi giá, reset số lượng.
3. PWA trên HTTPS: install, worker update có xác nhận, route riêng tư không cache.
4. Auth/Checkout/Orders dùng DB test cô lập; kiểm rollback/idempotency, không dùng Supabase chung.

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.0.1 | 2026-09-18 | Tách output Playwright khỏi artifact cũ đã được Git theo dõi. |
| 1.0.0 | 2026-09-18 | Lập ma trận 41 ca và backlog an toàn dữ liệu. |
