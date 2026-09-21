# Storefront Support — maintenance note

> **Document version:** 2.0.0
>
> **Last updated:** 2026-09-21
>
> **Change summary:** Form liên hệ không còn báo "gửi thành công" khi chưa gửi gì; chuyển sang mở email soạn sẵn và nói đúng việc đã xảy ra.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Trang `/contact`: thông tin cửa hàng, form liên hệ | Hỗ trợ đơn hàng — thuộc `features/orders` |

## Server/client boundary

`pages/contact-page.tsx` là client vì có form state. Route `/contact` chỉ là vỏ.

## Public entry

`index.ts` — `ContactPage`.

## Generated operation

**Không có.** Backend chưa có endpoint nhận yêu cầu tư vấn.

Vì vậy form **không tự gửi gì cả**: nó dựng sẵn một email `mailto:` với đúng nội dung khách vừa
nhập và mở ứng dụng mail của họ. Việc gửi do chính họ bấm, và màn hình nói đúng điều đó — "Đã mở
email soạn sẵn", kèm câu nhắc yêu cầu chỉ tới nơi sau khi họ bấm gửi, và số hotline để gọi thẳng.

Bản trước chỉ đặt cờ `submitted` rồi báo "Gửi yêu cầu thành công" trong khi không có gì rời khỏi
trình duyệt; khách ngồi đợi một cuộc gọi không bao giờ tới.

**Khi backend có endpoint nhận liên hệ**, thay `mailto:` bằng lời gọi thật và đổi lại thông báo
thành công — nhưng chỉ khi API đã trả về thành công, không phải khi form vừa submit.

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
