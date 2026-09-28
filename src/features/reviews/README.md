# Storefront Reviews — maintenance note

> **Document version:** 3.0.0
>
> **Last updated:** 2026-09-28
>
> **Change summary:** Bổ sung gửi đánh giá thật từ đơn hoàn tất, upload ảnh và trạng thái chờ Admin duyệt.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Hiển thị đánh giá đã duyệt trên trang sản phẩm và trang chủ | Kiểm duyệt — thuộc Admin |
| Khách đã đăng nhập gửi đánh giá từ dòng đơn `COMPLETED` | Sửa/xóa đánh giá sau khi gửi |
| Upload tối đa 5 ảnh qua media contract | Video đánh giá |
| Map DTO đánh giá sang view model | Tổng hợp điểm trung bình phía server |

## Server/client boundary

`components/product-review-section.tsx`, `components/product-reviews.tsx`, `hooks/use-product-reviews.ts` đều là client.

## Public entry

`index.ts` — `ProductReviewSection`, `ProductReviews`, `ReviewFormDialog`, `useProductReviews`.

## Generated operation

| Dùng | Nguồn |
| --- | --- |
| `useListProductReviews` | `src/generated/api/reviews/reviews.ts` |
| `createAccountProductReview` | `src/generated/api/reviews/reviews.ts` |
| `createAccountReviewMediaUpload`, `finalizeAccountReviewMediaUpload` | `src/generated/api/reviews/reviews.ts` |

## Đã gỡ hết mock

| Trước (bịa) | Nay (thật) |
| --- | --- |
| `totalReviews = reviews.length + 124` ("social base proof") | `total` từ API |
| `averageRating = 4.9` cứng | `averageRating` do server tính |
| Phân bố sao cố định 108/15/3/1/1 | tính từ chính danh sách đã duyệt |
| `helpfulCount`, ảnh đính kèm, pros/cons | **đã gỡ** — DTO không có các field này |
| Form gửi đánh giá thêm vào state cục bộ **và tự sinh phản hồi của cửa hàng** | **đã gỡ** |

Form hiện tại gửi dữ liệu thật tới API. Sau khi gửi thành công, dòng đơn hiển thị "Đang chờ duyệt" trong phiên hiện tại; backend vẫn là nguồn bảo vệ duy nhất cho quy tắc một đánh giá trên mỗi dòng đơn.

## Luồng và state

- Form chỉ xuất hiện với khách đã đăng nhập và đơn `COMPLETED`.
- Ảnh được upload/finalize trước, sau đó request tạo review gửi danh sách `mediaAssetIds`.
- Review mới nhận `PENDING` và không xuất hiện công khai cho tới khi Admin duyệt.
- API xác minh ownership của customer/order item, trạng thái đơn và unique `order_item_id`; điều kiện UI không phải security boundary.

## Hiển thị

Chỉ render nội dung đã duyệt; phân biệt đánh giá có xác thực mua hàng khi API cung cấp (`05-commerce-content-media.md`).

## Checklist khi sửa

- [ ] Không hiển thị đánh giá chưa duyệt.
- [ ] Không bịa điểm trung bình khi danh sách rỗng.
- [ ] Giữ empty state riêng, không dùng skeleton thay cho "chưa có đánh giá".
- [ ] Không sửa DTO/operation generated; thay OpenAPI producer rồi regenerate.
- [ ] Không coi trạng thái nút ở Client là bảo vệ quy tắc một đánh giá/dòng đơn.

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 3.0.0 | 2026-09-28 | Gửi review từ order item đã hoàn tất, tối đa 5 ảnh và workflow PENDING. |
| 2.0.0 | 2026-09-13 | Đọc review thật từ API và gỡ form giả. |
| 1.0.0 | 2026-09-13 | Tạo note, ghi nhận thiếu POST review và thiếu model Prisma. |
