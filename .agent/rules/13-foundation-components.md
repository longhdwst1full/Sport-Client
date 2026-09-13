# Storefront foundation components

`src/foundation` là tầng trình bày cấp thấp, không biết gì về commerce.

## RULE-FDN-01: Tiêu chí vào foundation (P0)

| Điều kiện | Kết luận |
| --- | --- |
| Không import `@/generated/api`, không biết cart/checkout/customer | ✅ foundation |
| Dùng ở ≥ 2 feature, chỉ nhận props trình bày | ✅ foundation |
| Biết DTO, biết luồng nghiệp vụ, chỉ 1 feature dùng | ❌ để trong `features/<domain>/components` |
| Ghép nhiều feature, xuất hiện xuyên route | ❌ `src/widgets` |

```tsx
// ❌ foundation biết nghiệp vụ
export function PriceTag({ product }: { product: ProductDetailDto }) { ... }

// ✅ foundation chỉ nhận primitive đã format
export function PriceTag({ label, strikeLabel }: { label: string; strikeLabel?: string }) { ... }
```

## RULE-FDN-02: Thiếu preset thì bổ sung vào foundation (P0)

Không tự viết biến thể riêng trong feature (đã áp dụng cho Skeleton — `12-skeleton-loading.md`). Quy tắc này áp dụng cho mọi preset trình bày: button, badge, empty state, section heading.

## RULE-FDN-03: Không tạo wrapper một dòng (P1)

Re-export lại một component foundation mà không thêm hành vi là rác. Import thẳng.
