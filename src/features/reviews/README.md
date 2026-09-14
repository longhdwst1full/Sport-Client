# Storefront Reviews — maintenance note

> **Document version:** 2.0.0
>
> **Last updated:** 2026-09-13
>
> **Change summary:** Backend review đã lên Prisma; gỡ mock, đánh giá đọc 100% từ API. Form gửi đánh giá giả đã bị loại bỏ.

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

## Đã gỡ hết mock

| Trước (bịa) | Nay (thật) |
| --- | --- |
| `totalReviews = reviews.length + 124` ("social base proof") | `total` từ API |
| `averageRating = 4.9` cứng | `averageRating` do server tính |
| Phân bố sao cố định 108/15/3/1/1 | tính từ chính danh sách đã duyệt |
| `helpfulCount`, ảnh đính kèm, pros/cons | **đã gỡ** — DTO không có các field này |
| Form gửi đánh giá thêm vào state cục bộ **và tự sinh phản hồi của cửa hàng** | **đã gỡ** |

Form cũ là vấn đề nghiêm trọng nhất: khách bấm gửi thì thấy đánh giá xuất hiện kèm lời cảm ơn "từ cửa hàng", trong khi **không có gì được gửi tới hệ thống**. Nay thay bằng hướng dẫn gọi hotline.

## Khoảng trống backend còn lại

**Chưa gửi được đánh giá từ Storefront** — `review.controller.ts` mới chỉ có `@Get()` cho tag `Storefront Reviews`, chưa có `POST`. Đây là task backend (`RULE-CTR-02`).

`verifiedPurchase` bị ràng buộc database `product_reviews_verified_requires_order_item_check`: chỉ đánh dấu được khi có `orderItemId` thật. Dữ liệu seed hiện để `false` vì không gắn với đơn nào.

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
