# Storefront Home — maintenance note

> **Document version:** 1.0.0
>
> **Last updated:** 2026-09-13
>
> **Change summary:** Tạo note sau khi rail danh mục chuyển sang API thật; liệt kê phần còn dùng mock.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Bố cục trang chủ và các section riêng của nó | Lưới sản phẩm (`features/catalog`), bài viết (`features/content`), đánh giá (`features/reviews`), flash sale (`features/promotions`) |

## Server/client boundary

`pages/home-page.tsx` là **server component async** — tự lấy rail danh mục rồi truyền xuống. Chỉ 5 component cần tương tác mới là client: `hero-banner-slider`, `category-visual-showcase`, `stats-counter`, `gym-project-planner`, `event-announcement-modal`.

Không được biến `home-page.tsx` thành `'use client'` để tiện quản lý loading (`RULE-SKEL-06`).

## Public entry

`index.ts` — `HomePage`.

## Generated operation

| Dùng | Nguồn |
| --- | --- |
| `listCatalogCategories` (server) | `src/generated/api/catalog/catalog.ts` |

Rail danh mục lấy từ API thật: tên, ảnh Cloudinary và **số sản phẩm thật** (`productCount`), không còn nhãn ước lượng kiểu `120+`.

## Cache

Route `/` đặt `revalidate = 300` (ISR 5 phút). Thiếu dòng này thì dữ liệu bị đóng băng ở thời điểm build.

API lỗi ⇒ rail ẩn hẳn, không chặn trang chủ và không hiện dữ liệu bịa.

## Mock còn lại — chờ backend

`MOCK_HERO_SLIDES`, `MOCK_HOME_STATS`, `MOCK_HOME_VOUCHERS`, `MOCK_BRAND_PARTNERS`, `MOCK_TRAINING_SPACES`, `MOCK_GYM_PACKAGES`, `MOCK_HOME_SPORT_CATEGORIES`, `MOCK_POPULAR_SEARCH_KEYWORDS`.

Đây là nội dung marketing chưa có module CMS tương ứng phía backend. Không tự tạo endpoint để lấp (`RULE-CTR-02`).

## Checklist khi sửa

- [ ] Thêm section mới: mặc định server component; chỉ tách island client khi thật sự cần tương tác.
- [ ] Ảnh hero/ảnh danh mục phải có kích thước hoặc aspect, tránh CLS (`17-image-usage.md`).
- [ ] Không hiển thị số liệu bán hàng/đếm ngược giả (`_plans/storefront-benchmark-homepage-v1.md`).

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.0.0 | 2026-09-13 | Tạo note; rail danh mục sang API thật, `/` bật ISR 5 phút. |
