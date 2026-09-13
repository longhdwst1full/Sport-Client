# Storefront Promotions — maintenance note

> **Document version:** 1.0.0
>
> **Last updated:** 2026-09-13
>
> **Change summary:** Tạo note; đánh dấu toàn bộ feature là demo cho tới khi có module Promotion/Flash Sale.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Trang `/flash-sale`, section flash sale trên trang chủ và trang `/products` | Giá bán thật và tồn kho — thuộc `features/catalog` / checkout |

## Trạng thái: **NON-PRODUCTION**

`api/src/modules/promotion/` chỉ có `promotion.module.ts`, **không có controller, không có model Prisma**. Không tồn tại operation `Storefront Promotions` nào trong `src/generated/api`.

Toàn bộ dữ liệu đến từ `MOCK_FLASH_PRODUCTS`, `MOCK_FLASH_SLOTS`, `MOCK_HOMEPAGE_FLASH_DEALS`. Đếm ngược và mức giảm là số minh hoạ.

Feature này chỉ được coi là Done sau `S6.4 Flash Sale` (`api/document/33-sprint-6-execution-plan.md`): bảng `flash_sale_campaigns` / `flash_sale_items` / `flash_sale_quota_reservations` và ba operation `FLS-01/02/03`.

## Server/client boundary

`pages/flash-sale-page.tsx` và `components/flash-sale-section.tsx` đều là client (đếm ngược + thêm vào giỏ).

## Public entry

`index.ts` — `FlashSalePage`, `FlashSaleSection`.

## Checklist khi sửa

- [ ] Không hiển thị giá/tồn kho giả như dữ liệu thật; giữ nhãn minh hoạ khi chưa có API.
- [ ] Khi có `FLS-02`, quota flash **không** thay thế reservation tồn kho vật lý — checkout phải giành cả hai trong cùng transaction.
- [ ] Giá phải trả cuối cùng luôn do server quyết (`07-state-tools-performance.md`).

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.0.0 | 2026-09-13 | Tạo note, gắn nhãn non-production và nối với S6.4. |
