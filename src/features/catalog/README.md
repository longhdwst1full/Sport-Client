# Storefront Catalog — maintenance note

> **Document version:** 1.5.0
>
> **Last updated:** 2026-10-06
>
> **Change summary:** Trang 1 danh sách prefetch server-side; thanh mua dính đáy mobile ở PDP; thẻ sản phẩm gọn (ảnh vuông `object-contain`); JSON-LD qua `lib/seo/json-ld`; mỗi trang catalog tự render đúng một `<main>`.

## Phạm vi và ranh giới

- App Router pages sở hữu server fetch/SEO; component trong `features/catalog/components` sở hữu tương tác mua hàng và related products.
- Dữ liệu sản phẩm thật đọc qua generated Catalog SDK. Không sửa DTO/path trong `src/generated/api`.
- Product detail dùng gallery ảnh thật, thông tin bảo hành/xác thực và purchase panel; không tải Three.js ở route này.
- `/products` là route canonical; `/catalog` là alias tương thích cho menu/campaign cũ và không sở hữu logic riêng.
- Theme dùng CSS token `--dc-*` kế thừa có kiểm soát từ hệ Admin/Dragon Web và Noto Sans Vietnamese subset.

## Cache và lỗi

- Product detail và `/category/[slug]` dùng ISR 120s; `getCatalogProduct`/`listCatalogCategories` bọc React `cache()` để metadata và page dùng chung một lượt gọi. API 404 map sang Next `notFound`.

## Bán được hay không

- `model/product.mapper.ts` là nơi duy nhất quyết định: `hasOfferPrice` (null/0 = chưa có giá), `ProductShowcaseItem.isSellable` (có giá + SKU mặc định) và `ProductVariantOptionView.sellable` (biến thể ACTIVE có giá). Component không tự so `minPrice`.
- Chưa có tồn kho trong contract: không hiển thị "còn hàng/có sẵn". Khi API bổ sung, thêm điều kiện vào hai helper trên.
- Không hiển thị giá gạch, % giảm, quà tặng, trả góp hay cam kết giao/bảo hành theo sản phẩm khi contract không có dữ liệu; purchase panel dẫn sang `STORE_POLICY_PAGES`.

## Phân trang và lọc

- Trang 1 được server prefetch: `/products` gọi `loadCatalogFirstPage(filters)` theo `searchParams`, `/category/[slug]` gọi `loadCatalogFirstPage({ category })`; kết quả truyền xuống làm `initial`/`initialPage` của query client để HTML (ISR) có sẵn thẻ sản phẩm và link chi tiết, không nháy skeleton. Trang sau tải trên client.

- `useProductShowcase` dùng `useInfiniteQuery` theo `page`, `limit` cố định ≤ 100 (API trả 400 khi vượt). Query key thêm hậu tố `'infinite'` để không đè cache một trang của `useListCatalogProducts`.
- `/products`: search debounce 300ms; danh mục, từ khoá, sắp xếp (`sort`) và khoảng giá (`minPrice`/`maxPrice`) đều gửi lên API và nằm trên URL (`RULE-LIST-02`).
- Không có facet thương hiệu và "chỉ còn hàng": API danh sách chưa có tham số `brand`/`inStock`, và lọc trên client chỉ xét trang đã tải nên sai (bỏ sót trang sau, đếm lệch tổng). Thêm lại khi API có tham số.
- Cache: `useProductSearch`, `useProductReviews`, `useProductShowcase` dùng `CACHE_POLICY.CATALOG`; danh mục dùng `LOOKUP`. `QueryClient` còn suy policy từ query key (`cachePolicyForQueryKey`) làm lưới an toàn.
- Catalog public có thể cache theo contract PWA, nhưng cart/checkout/order/customer luôn private hoặc network-only.
- Không biến lỗi API thành dữ liệu đặt hàng giả ở production; fixture chỉ dành Storybook/dev được gắn flag rõ.

## SEO, landmark và PDP mobile

- Layout storefront chỉ render `div#noi-dung-chinh`; mỗi page catalog (`products-page`, `category-list-page`, `product-detail-page`, `search-page`, `/category/[slug]`) tự render đúng một `<main>` và một `<h1>`.
- JSON-LD dựng qua `src/lib/seo/json-ld.ts` (`buildProductJsonLd`, `buildBreadcrumbListJsonLd`) từ adapter `model/product-json-ld.ts`: ảnh = media ACTIVE + `imageUrl` (không dùng ảnh placeholder), `availability` theo `inStock` của API, `offers` chỉ khi có biến thể mở bán. Breadcrumb hiển thị và BreadcrumbList dùng chung một danh sách (PDP đi qua danh mục chính khi tra được slug).
- Mô tả meta thiếu thì dựng câu cụ thể theo tên (`toProductSeoDescription`/`toCategorySeoDescription`); og:image PDP đi qua `toOgImageUrl`.
- PDP mobile: `StickyBuyBar` (`data-sticky-buy-bar`, `lg:hidden`) hiện khi nhóm nút chính cuộn lên khỏi màn hình (IntersectionObserver), dùng lại đúng `handleAddToCart`/`handleBuyNow` của purchase panel. Trang PDP có `pb-28` mobile để nội dung không bị che; widget nút liên hệ nổi tự ẩn dựa vào thuộc tính trên.
- `ProductCard` và `ProductCardSkeleton` phải đổi cùng nhau (ảnh vuông, dòng hãng/danh mục `text-xs`, tiêu đề 2 dòng `min-h-[2.5rem]`).

## Checklist khi sửa

- [ ] Giữ loading/not-found/error/image fallback/mobile purchase states.
- [ ] Thay đổi API phải sửa Nest/OpenAPI rồi sync/regenerate.
- [ ] Không đưa Three.js hoặc animation nặng vào critical path nếu không có measurable benefit.
- [ ] Kiểm tra Core Web Vitals, alt text, keyboard focus và reduced motion.
- [ ] Cập nhật Storybook khi purchase/gallery/layout thay đổi đáng kể.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.5.0 | 2026-10-06 | Server prefetch trang 1, sticky buy bar mobile PDP, thẻ sản phẩm gọn, JSON-LD qua `lib/seo/json-ld` + BreadcrumbList danh mục, mô tả meta dự phòng, `<main>` mỗi trang. | CLIENT-20261006-CATALOG-UX-SEO |
| 1.4.0 | 2026-09-27 | Filter server-side, gỡ facet client-side không đúng, CACHE_POLICY cho search/review, canonical/OG theo `buildPageMetadata`. | CLIENT-20260927-CACHE-PWA-SEO |
| 1.3.0 | 2026-09-25 | Helper bán được dùng chung, phân trang theo page, gallery `media[]`, gỡ nội dung bịa, ISR 120s + `cache()`. | CLIENT-20260925-TRUTHFUL-CATALOG |
| 1.2.0 | 2026-09-13 | Nối `defaultVariantId/defaultVariantSku` với cart và vô hiệu quick-add khi API không có offer hợp lệ. | CLIENT-20260913-QUICK-ADD-CONTRACT |
| 1.1.0 | 2026-09-13 | Browser E2E phát hiện `/catalog` 404; thêm alias dùng chung Products page để không nhân đôi behavior. | CLIENT-20260913-CATALOG-ROUTE-E2E |
| 1.0.0 | 2026-09-13 | Theme DC/Noto Sans và product detail image-first không Three.js. | CLIENT-20260913-DC-PRODUCT-DETAIL |
