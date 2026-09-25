# Storefront Home — maintenance note

> **Document version:** 1.1.0
>
> **Last updated:** 2026-09-25
>
> **Change summary:** Gỡ số liệu/đối tác giả, SSR trang 1 lưới sản phẩm qua `initialData`, link trang chủ trỏ về route thật.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Bố cục trang chủ và các section riêng của nó | Lưới sản phẩm (`features/catalog`), bài viết (`features/content`), đánh giá (`features/reviews`), flash sale (`features/promotions`) |

## Server/client boundary

`pages/home-page.tsx` là **server component async** — tự lấy rail danh mục rồi truyền xuống. Chỉ 4 component cần tương tác mới là client: `hero-banner-slider`, `category-visual-showcase`, `gym-project-planner`, `event-announcement-modal`.

Không được biến `home-page.tsx` thành `'use client'` để tiện quản lý loading (`RULE-SKEL-06`).

## Public entry

`index.ts` — `HomePage`.

## Generated operation

| Dùng | Nguồn |
| --- | --- |
| `listCatalogCategories` (server) | `src/generated/api/catalog/catalog.ts` |
| `listCatalogProducts` trang 1, `limit = CATALOG_PAGE_SIZE.SHOWCASE` (server) | `src/generated/api/catalog/catalog.ts` |

Trang 1 truyền xuống `ProductShowcase` làm `initialData` của `useInfiniteQuery` (cùng `limit` và chỉ cho lưới "Tất cả"), nên HTML SSR có sản phẩm; `initialPageFetchedAt` giúp client làm mới khi bản ISR đã cũ hơn `staleTime`. Đổi `limit` ở một phía mà không đổi phía kia thì hook bỏ qua `initialData` và quay về skeleton.

Rail danh mục lấy từ API thật: tên, ảnh Cloudinary và **số sản phẩm thật** (`productCount`), không còn nhãn ước lượng kiểu `120+`.

## Cache

Route `/` đặt `revalidate = 300` (ISR 5 phút). Thiếu dòng này thì dữ liệu bị đóng băng ở thời điểm build.

API lỗi ⇒ rail ẩn hẳn, không chặn trang chủ và không hiện dữ liệu bịa.

## Mock còn lại — chờ backend

`MOCK_HERO_SLIDES`, `MOCK_HOME_VOUCHERS`, `MOCK_TRAINING_SPACES`, `MOCK_GYM_PACKAGES`, `MOCK_HOME_SPORT_CATEGORIES`, `MOCK_POPULAR_SEARCH_KEYWORDS`.

`MOCK_HOME_STATS` (bộ đếm showroom/khách hàng) và `MOCK_BRAND_PARTNERS` đã bị gỡ cùng section: số liệu và đối tác viết cứng không có nguồn xác nhận. Slide hero không khai % giảm giá/quà tặng; thẻ "theo bộ môn" chỉ dẫn vào `/category/<slug>` khi slug có trong cây danh mục API, ngược lại về `/products`.

Đây là nội dung marketing chưa có module CMS tương ứng phía backend. Không tự tạo endpoint để lấp (`RULE-CTR-02`).

## Checklist khi sửa

- [ ] Thêm section mới: mặc định server component; chỉ tách island client khi thật sự cần tương tác.
- [ ] Ảnh hero/ảnh danh mục phải có kích thước hoặc aspect, tránh CLS (`17-image-usage.md`).
- [ ] Không hiển thị số liệu bán hàng/đếm ngược giả (`_plans/storefront-benchmark-homepage-v1.md`).

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.1.0 | 2026-09-25 | Gỡ stats/brand partners giả, SSR trang 1 lưới sản phẩm, sửa link `/catalog?…`/`/#products`. |
| 1.0.0 | 2026-09-13 | Tạo note; rail danh mục sang API thật, `/` bật ISR 5 phút. |
