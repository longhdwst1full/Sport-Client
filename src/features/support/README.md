# Storefront Support — maintenance note

> **Document version:** 1.0.0
>
> **Last updated:** 2026-09-13
>
> **Change summary:** Tạo note; form liên hệ chưa có endpoint backend.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Trang `/contact`: thông tin cửa hàng, form liên hệ | Hỗ trợ đơn hàng — thuộc `features/orders` |

## Server/client boundary

`pages/contact-page.tsx` là client vì có form state. Route `/contact` chỉ là vỏ.

## Public entry

`index.ts` — `ContactPage`.

## Generated operation

**Không có.** Backend chưa có endpoint nhận liên hệ; form hiện chỉ hiển thị trạng thái đã gửi phía client.

Đây là khoảng trống đã biết: không được để người dùng tin là đã gửi thành công nếu thực tế không có gì được gửi đi.

## Dữ liệu cửa hàng

Hotline/địa chỉ/giờ mở cửa lấy từ `@/shared/constants` (`STORE_CONFIG`, `STORE_CONTACT`), không hardcode trong JSX (`08-enums-constants.md`).

## Checklist khi sửa

- [ ] Khi có endpoint: dùng SDK generated, xử lý 4xx như kết quả cuối cùng, không auto-retry.
- [ ] Trước khi có endpoint: thông báo thành công phải phản ánh đúng sự thật hoặc hướng người dùng sang hotline.
- [ ] Không lưu dữ liệu liên hệ vào browser storage.

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.0.0 | 2026-09-13 | Tạo note, ghi nhận form chưa có backend. |
