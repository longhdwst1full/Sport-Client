# Storefront Content — maintenance note

> **Document version:** 1.0.0
>
> **Last updated:** 2026-09-13
>
> **Change summary:** Tạo note; ghi rõ backend CMS hiện lưu in-memory nên fallback mock chưa gỡ được.

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

Chưa dùng: `getPublishedPost` (trang chi tiết còn dựng từ dữ liệu mẫu).

## Khoảng trống backend — **chặn việc gỡ mock**

`api/src/modules/cms/cms.service.ts` giữ bài viết trong **mảng in-memory**, không có model Prisma. Admin POST/DELETE content ghi vào RAM và mất khi restart.

Vì vậy `MOCK_CURATED_STORIES`, `MOCK_FALLBACK_ARTICLES`, `MOCK_NEWS_CATEGORIES` vẫn còn làm fallback. Chỉ gỡ sau khi backend có bảng `content_posts` thật (`RULE-CTR-02`: không tự chế DTO thay backend).

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
