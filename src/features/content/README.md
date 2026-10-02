# Storefront Content — maintenance note

> **Document version:** 2.2.0
>
> **Last updated:** 2026-10-02
>
> **Change summary:** Thêm banner CMS-02 (`listActiveBanners`): HOME_HERO/HOME_PROMO trên trang chủ, FOOTER trong layout, CATEGORY_TOP trên trang danh mục; không có banner thì giao diện giữ nguyên.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Trang `/news`, rail bài viết trên trang chủ | Soạn/duyệt nội dung — thuộc Admin |
| Map DTO bài viết sang view model của list/rail | SEO chi tiết bài — thuộc `app/news/[slug]` |

## Server/client boundary

`pages/news-list-page.tsx`, `components/content-stories.tsx`, `hooks/use-content-stories.ts` đều là client vì dùng TanStack Query + filter cục bộ.

## Public entry

`index.ts` — `NewsListPage`, `ContentStories`, `useContentStories`.

## Generated operation

| Dùng | Nguồn |
| --- | --- |
| `useListPublishedPosts` | `src/generated/api/content/content.ts` |

Chưa dùng: `getPublishedPost` (trang chi tiết `/news/[slug]`).

## Đã gỡ hết mock

`MOCK_CURATED_STORIES`, `MOCK_FALLBACK_ARTICLES`, `MOCK_NEWS_CATEGORIES` đã xoá. Backend giờ có model `ContentPost` thật.

| Trước (bịa) | Nay (thật) |
| --- | --- |
| `date: '05/09/2026'` cứng cho mọi bài | `publishedAt` từ API |
| `readTime: '6 phút'` cứng | ước lượng từ độ dài bài thật |
| `views: 1200 + idx * 150` | **đã gỡ** — backend không đếm lượt xem, hiển thị là bịa dữ liệu tương tác |
| Danh sách category cố định | dựng từ `postType` của bài đang có |
| Ảnh bìa mock khi API thiếu | dùng `coverUrl` thật |

`model/content-post.mapper.ts` là nơi duy nhất đọc field DTO; nhãn tiếng Việt của `postType` map riêng nên đổi chữ không làm hỏng bộ lọc.

## Cache, ISR và lọc

- `/news/[slug]`, `/chinh-sach`, `/chinh-sach/[slug]` dùng ISR 300s (`generateStaticParams` rỗng + React `cache()`); chỉ API 404 mới thành `notFound`, lỗi tạm thời ném ra để ISR giữ bản tốt trước đó.
- Bài vừa đăng/sửa hiện ngay khi API gọi `POST /api/revalidate` với `{ "resource": "post", "slug": "<slug>" }` và header `x-revalidate-secret` (`src/app/api/revalidate/route.ts`). Không gọi thì chậm tối đa 5 phút (ISR) + 5 phút (cache SW cho `GET /content/posts`).
- Client hooks dùng `CACHE_POLICY.LOOKUP` (không refetch khi quay lại tab).
- Lọc theo loại bài (`postType`) và loại trang chính sách chạy trên client **trên toàn bộ danh sách**: `listPublishedPosts` không phân trang, nên kết quả đúng. Khi API thêm phân trang, phải chuyển bộ lọc sang tham số `postType` của API.

## Banner (CMS-02)

- Server-only: `api/active-banners.ts` (`loadActiveBanners(placement, categoryId?)`) gọi `listActiveBanners`, map qua `model/banner.mapper.ts` (`BannerView`). API lỗi → `[]`, nơi gọi giữ giao diện mặc định.
- Nơi dùng: `features/home` (HOME_HERO thành slide đứng đầu slider, HOME_PROMO thay hai thẻ bên phải, tối đa 2), `widgets/site-footer/footer-newsletter-banner.tsx` (FOOTER: dải banner đầu tiên phía trên khối nhận tin, khối nhận tin luôn giữ), `app/(storefront)/category/[slug]` (`CategoryTopBanners` trên lưới sản phẩm, không có thì không render).
- Ảnh: `BannerPicture` (`next/image` `fill`; ảnh mobile dưới `md` nếu có). Host Cloudinary đã có trong `next.config` `remotePatterns`.
- Cache: trang chủ ISR 300s; layout storefront đặt `revalidate = 300` vì footer đọc banner bằng Axios (không tự gắn ISR); trang danh mục giữ 120s.
- GAP: `CatalogCategoryDto` công khai chưa có `id`, nên CATEGORY_TOP hiện chỉ lấy banner áp cho mọi danh mục (không gửi `categoryId`). Cần API bổ sung `id` (hoặc lọc theo slug) để hiện banner riêng từng danh mục.

## State owner

TanStack Query. Không mirror dữ liệu bài viết vào Redux hay `useState`.

## Checklist khi sửa

- [ ] Giữ đủ 6 trạng thái của list page (`18-list-page-pattern.md`).
- [ ] Mock phải gắn nhãn non-production, không trộn lẫn với dữ liệu API trong cùng danh sách mà không phân biệt được.
- [ ] Ảnh bài viết qua `next/image` kèm kích thước (`17-image-usage.md`).

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 2.2.0 | 2026-10-02 | Banner CMS-02: loader server, mapper, `BannerPicture`, `CategoryTopBanners`; fallback giữ nguyên UI khi không có banner. |
| 2.1.0 | 2026-09-27 | ISR 300s + `/api/revalidate` cho trang bài viết/chính sách; ghi nhận phạm vi lọc client. |
| 1.0.0 | 2026-09-13 | Tạo note, ghi nhận CMS backend in-memory. |
