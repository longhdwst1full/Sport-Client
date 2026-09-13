# Storefront data transformation

Generated DTOs are transport shapes, not view models. Map them once, at the feature boundary.

## RULE-DT-01: One mapper per feature (P0)

```ts
// ❌ Wrong — DTO fields formatted inline in JSX, repeated per component
<span>{product.priceAmount?.toLocaleString('vi-VN')} đ</span>

// ✅ Correct — src/features/catalog/model/product.mapper.ts
export type ProductCardView = { id: string; slug: string; name: string; priceLabel: string; imageUrl: string | null };
export function toProductCardView(dto: StorefrontProductDto): ProductCardView { /* ... */ }
```

- Mapper lives in `src/features/<feature>/model/*.mapper.ts` and is the only place that reads generated field names.
- Components receive view models, never raw DTOs.

## RULE-DT-02: Never mutate the DTO (P0)

Query data is cache-owned. Derive new objects; do not assign onto the response.

## RULE-DT-03: Money and stock are not formatted twice (P0)

- Display formatting belongs in `src/shared/format`.
- The payable amount is never recomputed on the client from snapshots — see `07-state-tools-performance.md`.

## RULE-DT-04: Derive, memoized, at the smallest scope (P1)

```ts
// ✅ selector-style derivation, stable identity
const items = useMemo(() => (data?.items ?? []).map(toProductCardView), [data]);
```

Do not put derived view models into Redux — Redux owns interactive commerce state only.

## RULE-DT-05: Enum → label mapping stays separate (P1)

Codes come from generated DTOs; Vietnamese labels map beside them (`08-enums-constants.md`). Changing copy must not change a comparison.

## Anti-patterns

| ❌ Don't | ✅ Do |
| --- | --- |
| Import a generated model type into a leaf UI component | Pass a feature view model |
| `as any` to bridge DTO ↔ props | Fix the mapper |
| Duplicate the same `toLocaleString` in 5 files | `src/shared/format` |
| Re-shape a DTO inside `render` | `useMemo` mapper at the feature hook |
