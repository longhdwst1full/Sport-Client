# Storefront server data cache

Trang ISR đọc API bằng Axios (không qua `fetch` của Next) nên không có Data Cache tự động.

## RULE-SDC-01: Dữ liệu công khai dùng chung đi qua `_data/public-data.ts` (P0)

Cây danh mục, banner… dùng ở nhiều route lấy qua `app/(storefront)/_data/public-data.ts`
(`unstable_cache` có tag = giữa các request, `React.cache` = trong một request).

```ts
// ❌ mỗi route/feature tự gọi, layout + page = 2–3 lượt API mỗi lần dựng trang
const { items } = await listCatalogCategories();
// ✅ route lấy qua loader có cache rồi truyền xuống feature bằng props
const categories = await getPublicCategories();
return <CategoryListPage categories={categories ?? []} />;
```

## RULE-SDC-02: Chỉ cache dữ liệu công khai, có tag làm mới (P0)

- Không bao giờ đưa dữ liệu theo phiên/khách (giỏ, đơn, báo giá, hồ sơ) vào `unstable_cache`.
- Mỗi loader có tag trong `public-data-tags.ts`; sự kiện tương ứng ở `/api/revalidate`
  (`revalidateTags`) phải làm mới tag đó, không chỉ `revalidatePath`.
- Lỗi API không bị cache; loader trả giá trị dự phòng (`undefined`/`[]`), không ném lỗi làm hỏng trang.

## RULE-SDC-03: `next/cache` không vào barrel feature (P0)

Barrel feature bị component `'use client'` import. Loader dùng `unstable_cache` đặt ở tầng `app`;
feature nhận dữ liệu qua props hoặc chỉ export mapper thuần (vd. `toActiveBannerViews`).

## RULE-SDC-04: Cache phía client theo nhóm (P1)

TanStack Query: `lib/query/query-cache-policy.ts` (REFERENCE 30′ · LOOKUP 10′ · CATALOG 1′). Endpoint
mới ít đổi → thêm vào nhóm phù hợp; dữ liệu giao dịch/cá nhân không có policy dài.
