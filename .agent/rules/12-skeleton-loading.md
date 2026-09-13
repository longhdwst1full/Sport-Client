# Storefront skeleton loading

Applies to every surface that renders data from `src/generated/api`.

## RULE-SKEL-01: Foundation Skeleton only (P0)

No custom shimmer CSS. Use `src/foundation/components/feedback/skeleton`.

```tsx
import { Skeleton, SkeletonText, SkeletonCircle } from '@/foundation/components/feedback/skeleton';
```

If a needed preset does not exist, add it to foundation — not to the feature.

## RULE-SKEL-02: Decision tree

```
First load (no data)      -> Skeleton matching the real layout
Refetch (data present)    -> keep data, dim with opacity; never swap to Skeleton
Pagination / load more    -> Skeleton appended below existing items
Server-rendered page      -> route-level `loading.tsx` with the same skeleton
Offline / HTTP 4xx        -> not a loading state (see 04-offline-commerce-ux.md)
```

## RULE-SKEL-03: Skeleton mirrors the content box (P0)

Same grid columns, same card height, same image aspect ratio — layout shift on a product grid is a CLS regression (`05-commerce-content-media.md`, `06-quality.md`).

## RULE-SKEL-04: Counts

| Surface | Count |
| --- | --- |
| Product grid | fill the visible grid (match column count) |
| Card/list rail | 3–5 |
| Order history | 5 rows |
| Detail page | 1 block matching the detail layout |

## RULE-SKEL-05: Condition pattern

```tsx
// ✅ skeleton only while there is nothing to show
{isPending && items.length === 0 ? <ProductGridSkeleton /> : items.length === 0 ? <EmptyState /> : <ProductGrid items={items} />}

// ❌ flickers on every refetch
{isPending ? <ProductGridSkeleton /> : <ProductGrid items={items} />}
```

## RULE-SKEL-06: Server-first pages

A public server-rendered route uses `loading.tsx`; do not convert a page to `'use client'` merely to own a loading flag (`01-next-rendering.md`).

## Anti-patterns

| ❌ Don't | ✅ Do |
| --- | --- |
| Full-page spinner | Content-area skeleton |
| Skeleton on refetch | Opacity on existing data |
| Custom keyframes per feature | Foundation preset |
| Skeleton with different height than the card | Match the box |
