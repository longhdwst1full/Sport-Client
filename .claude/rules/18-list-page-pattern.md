# Storefront list page pattern

Áp dụng cho danh mục, tìm kiếm, tin tức, lịch sử đơn hàng.

## RULE-LIST-01: Sáu trạng thái bắt buộc (P0)

| Trạng thái | Hành vi |
| --- | --- |
| First load | Skeleton khớp layout (`12-skeleton-loading.md`) |
| Refetch | Giữ dữ liệu, giảm opacity |
| Empty | Empty state + hành động gợi ý, **không** phải skeleton |
| Lỗi HTTP 4xx/5xx | Thông báo cuối cùng, không coi là offline (`04-offline-commerce-ux.md`) |
| Offline | Banner kết nối, dữ liệu cache phải gắn nhãn cũ |
| Load more / paging | Skeleton nối dưới danh sách hiện có |

## RULE-LIST-02: Filter nằm trong URL (P0)

```tsx
// ❌ filter chỉ trong useState — mất khi reload, không chia sẻ được link
// ✅ đọc/ghi qua searchParams; server component nhận searchParams trực tiếp
```

Lý do: trang list public phải chia sẻ/index được (`01-next-rendering.md`).

## RULE-LIST-03: Query key khớp filter (P0)

Mọi tham số ảnh hưởng kết quả phải nằm trong query key, nếu không danh sách sẽ hiện dữ liệu của filter cũ.

## RULE-LIST-04: Mapper trước khi render (P1)

List nhận view model từ `features/<domain>/model/*.mapper.ts`, không nhận DTO thô (`09-data-transformation.md`).
