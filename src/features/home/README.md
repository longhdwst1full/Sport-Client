# Storefront Home — maintenance note

> **Document version:** 2.0.0
>
> **Last updated:** 2026-09-25
>
> **Change summary:** Bỏ toàn bộ mock trang chủ: hero dựng từ bài viết + flash sale thật, thẻ bộ môn/lối tắt từ cây danh mục; gỡ popup voucher, planner, training guide, stats, brand partners.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Bố cục trang chủ và các section riêng của nó | Lưới sản phẩm (`features/catalog`), bài viết (`features/content`), đánh giá (`features/reviews`), flash sale (`features/promotions`) |

## Server/client boundary

`pages/home-page.tsx` là **server component async** — tự lấy danh mục, bài viết và trang 1 sản phẩm rồi truyền xuống. Chỉ 2 component cần tương tác mới là client: `hero-banner-slider` (slide + flash sale theo giờ server) và `category-visual-showcase`.

Không được biến `home-page.tsx` thành `'use client'` để tiện quản lý loading (`RULE-SKEL-06`).

## Public entry

`index.ts` — `HomePage`.

## Generated operation

| Dùng | Nguồn |
| --- | --- |
| `listCatalogCategories` (server) — rail, thẻ "theo bộ môn" (danh mục gốc, `productCount` cao nhất), lối tắt nhóm sản phẩm (danh mục con) | `src/generated/api/catalog/catalog.ts` |
| `listPublishedPosts` (server, bỏ `POLICY`) — slide hero từ bài có ảnh bìa | `src/generated/api/content/content.ts` |
| `listPublicFlashSales` (client qua `useFlashSale`) — slide chiến dịch đang chạy | `src/generated/api/promotions/promotions.ts` |
| `listCatalogProducts` trang 1, `limit = CATALOG_PAGE_SIZE.SHOWCASE` (server) | `src/generated/api/catalog/catalog.ts` |

Trang 1 truyền xuống `ProductShowcase` làm `initialData` của `useInfiniteQuery` (cùng `limit` và chỉ cho lưới "Tất cả"), nên HTML SSR có sản phẩm; `initialPageFetchedAt` giúp client làm mới khi bản ISR đã cũ hơn `staleTime`. Đổi `limit` ở một phía mà không đổi phía kia thì hook bỏ qua `initialData` và quay về skeleton.

Rail danh mục lấy từ API thật: tên, ảnh Cloudinary và **số sản phẩm thật** (`productCount`), không còn nhãn ước lượng kiểu `120+`.

## Cache

Route `/` đặt `revalidate = 300` (ISR 5 phút). Thiếu dòng này thì dữ liệu bị đóng băng ở thời điểm build.

API lỗi ⇒ rail ẩn hẳn, không chặn trang chủ và không hiện dữ liệu bịa.

## Không còn mock

`src/shared/data/mocks` đã xoá. Section nào chưa có API thì gỡ hẳn thay vì dựng dữ liệu:

| Đã gỡ | Lý do |
| --- | --- |
| Popup voucher (`event-announcement-modal`) | Chưa có API voucher |
| `training-space-guide`, `gym-project-planner` | Gói thiết bị/diện tích/ngân sách viết cứng, chưa có API |
| `stats-counter`, `brand-partners` | Số liệu và đối tác viết cứng, không có nguồn xác nhận |

Hero không có bài viết lẫn flash sale thì hiển thị một slide thương hiệu tĩnh từ `STORE_CONFIG`, không có giá hay phần trăm. Danh mục chưa có ảnh trong DB nên thẻ "theo bộ môn" dùng icon, không dùng ảnh stock.

## Checklist khi sửa

- [ ] Thêm section mới: mặc định server component; chỉ tách island client khi thật sự cần tương tác.
- [ ] Ảnh hero/ảnh danh mục phải có kích thước hoặc aspect, tránh CLS (`17-image-usage.md`).
- [ ] Không hiển thị số liệu bán hàng/đếm ngược giả (`_plans/storefront-benchmark-homepage-v1.md`).

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 2.0.0 | 2026-09-25 | Xoá mock: hero/bộ môn/lối tắt từ API; gỡ voucher popup, planner, training guide. |
| 1.1.0 | 2026-09-25 | Gỡ stats/brand partners giả, SSR trang 1 lưới sản phẩm, sửa link `/catalog?…`/`/#products`. |
| 1.0.0 | 2026-09-13 | Tạo note; rail danh mục sang API thật, `/` bật ISR 5 phút. |
