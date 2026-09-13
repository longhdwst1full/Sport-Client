# Storefront Reviews — maintenance note

> **Document version:** 1.0.0
>
> **Last updated:** 2026-09-13
>
> **Change summary:** Tạo note; ghi rõ chỉ đọc được, chưa gửi được đánh giá.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Hiển thị đánh giá trên trang sản phẩm và trang chủ | Kiểm duyệt — thuộc Admin |
| Map DTO đánh giá sang view model | Tổng hợp điểm trung bình phía server |

## Server/client boundary

`components/product-review-section.tsx`, `components/product-reviews.tsx`, `hooks/use-product-reviews.ts` đều là client.

## Public entry

`index.ts` — `ProductReviewSection`, `ProductReviews`, `useProductReviews`.

## Generated operation

| Dùng | Nguồn |
| --- | --- |
| `useListProductReviews` | `src/generated/api/reviews/reviews.ts` |

## Khoảng trống backend

1. **Không gửi được đánh giá.** `api/src/modules/review/review.controller.ts` chỉ có `@Get()` cho `Storefront Reviews`; chưa có `POST`. UI viết đánh giá hiện chỉ là form cục bộ với `MOCK_INITIAL_REVIEWS`.
2. **Không có model Prisma.** `ReviewService` giữ dữ liệu trong mảng in-memory như CMS.

Cả hai là task backend, không lấp bằng cách tự chế endpoint (`RULE-CTR-02`).

## Hiển thị

Chỉ render nội dung đã duyệt; phân biệt đánh giá có xác thực mua hàng khi API cung cấp (`05-commerce-content-media.md`).

## Checklist khi sửa

- [ ] Không hiển thị đánh giá chưa duyệt.
- [ ] Không bịa điểm trung bình khi danh sách rỗng.
- [ ] Giữ empty state riêng, không dùng skeleton thay cho "chưa có đánh giá".

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.0.0 | 2026-09-13 | Tạo note, ghi nhận thiếu POST review và thiếu model Prisma. |
