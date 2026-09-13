# Storefront Promotions — maintenance note

> **Document version:** 2.0.0
>
> **Last updated:** 2026-09-13
>
> **Change summary:** Bỏ toàn bộ mock; flash sale lấy từ API thật với đếm ngược theo giờ server.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Trang `/flash-sale`, section flash sale trên trang chủ và `/products` | Giữ suất khi thanh toán — thuộc `features/checkout` |
| Map DTO sang view model, đếm ngược | Giá phải trả cuối cùng — do server quyết |

## Server/client boundary

Toàn bộ là client vì có đếm ngược và thêm vào giỏ: `pages/flash-sale-page.tsx`, `components/flash-sale-section.tsx`, `components/flash-sale-deal-card.tsx`, `hooks/use-flash-sale.ts`.

## Public entry

`index.ts` — `FlashSalePage`, `FlashSaleSection`, `FlashSaleDealCard`, `useFlashSale`, mapper và view type.

## Generated operation

| Dùng | Nguồn |
| --- | --- |
| `useListPublicFlashSales` | `src/generated/api/promotions/promotions.ts` |

## Đếm ngược chạy theo giờ server

`useFlashSale` tính `clockOffset = serverTime - Date.now()` từ response, rồi đếm ngược tới `endsAt` theo giờ server đã hiệu chỉnh. Người dùng chỉnh đồng hồ máy **không** kéo dài được chương trình.

Khi đếm về 0, hook `refetch()` để server xác nhận lại thay vì client tự kết luận đã hết hạn.

Không có chiến dịch đang chạy ⇒ section ẩn hẳn. **Không dựng đếm ngược giả** như bản mock cũ (đếm về 0 rồi tự reset 8 giờ).

## Số liệu đều là thật

| Trước (mock) | Nay (API) |
| --- | --- |
| `discount` cứng | `regularPrice` vs `salePrice`, null thì không hiện badge |
| `sold/total` bịa | `soldQuantity` / `availableQuantity` từ quota thật |
| `badge`, `gift` bịa | đã gỡ; hiện "Còn N suất" |
| đếm ngược giả | `endsAt` theo giờ server |

## Cảnh báo: thêm vào giỏ chưa giữ suất

Nút "Thêm vào giỏ" chỉ đưa item vào Redux cart. **Quota chỉ thực sự bị giữ khi checkout gọi `reserveQuota`, mà bước này chưa được nối** (xem `api/src/modules/promotion/README.md`). Vì vậy giá flash hiển thị ở giỏ là snapshot; checkout sẽ xác thực lại với server.

Không được đổi thông điệp UI thành "đã giữ suất" cho tới khi checkout nối xong.

## Checklist khi sửa

- [ ] Không tính giá phải trả từ snapshot trong giỏ.
- [ ] Không đếm ngược bằng giờ máy khách.
- [ ] Suất hết (`availableQuantity <= 0`) phải disable nút, không để khách bấm rồi mới báo lỗi.
- [ ] Ảnh có thể null — luôn có nhánh placeholder (`17-image-usage.md`).

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 2.0.0 | 2026-09-13 | Nối API thật, gỡ `flash-sale.mock.ts`, đếm ngược theo giờ server. |
| 1.0.0 | 2026-09-13 | Tạo note, gắn nhãn non-production. |
