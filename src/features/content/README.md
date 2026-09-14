# Storefront Content — maintenance note

> **Document version:** 2.0.0
>
> **Last updated:** 2026-09-13
>
> **Change summary:** Backend CMS đã lên Prisma; gỡ toàn bộ mock, bài viết đọc 100% từ API.

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

## State owner

TanStack Query. Không mirror dữ liệu bài viết vào Redux hay `useState`.

## Checklist khi sửa

- [ ] Giữ đủ 6 trạng thái của list page (`18-list-page-pattern.md`).
- [ ] Mock phải gắn nhãn non-production, không trộn lẫn với dữ liệu API trong cùng danh sách mà không phân biệt được.
- [ ] Ảnh bài viết qua `next/image` kèm kích thước (`17-image-usage.md`).

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.0.0 | 2026-09-13 | Tạo note, ghi nhận CMS backend in-memory. |
