# Storefront Catalog — maintenance note

> **Document version:** 1.4.0
>
> **Last updated:** 2026-09-27
>
> **Change summary:** Lọc/sắp xếp/khoảng giá chạy server-side; gỡ facet thương hiệu và "còn hàng" lọc trên client; search/review dùng `CACHE_POLICY.CATALOG`; metadata canonical theo `buildPageMetadata`.

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

- `useProductShowcase` dùng `useInfiniteQuery` theo `page`, `limit` cố định ≤ 100 (API trả 400 khi vượt). Query key thêm hậu tố `'infinite'` để không đè cache một trang của `useListCatalogProducts`.
- `/products`: search debounce 300ms; danh mục, từ khoá, sắp xếp (`sort`) và khoảng giá (`minPrice`/`maxPrice`) đều gửi lên API và nằm trên URL (`RULE-LIST-02`).
- Không có facet thương hiệu và "chỉ còn hàng": API danh sách chưa có tham số `brand`/`inStock`, và lọc trên client chỉ xét trang đã tải nên sai (bỏ sót trang sau, đếm lệch tổng). Thêm lại khi API có tham số.
- Cache: `useProductSearch`, `useProductReviews`, `useProductShowcase` dùng `CACHE_POLICY.CATALOG`; danh mục dùng `LOOKUP`. `QueryClient` còn suy policy từ query key (`cachePolicyForQueryKey`) làm lưới an toàn.
- Catalog public có thể cache theo contract PWA, nhưng cart/checkout/order/customer luôn private hoặc network-only.
- Không biến lỗi API thành dữ liệu đặt hàng giả ở production; fixture chỉ dành Storybook/dev được gắn flag rõ.

## Checklist khi sửa

- [ ] Giữ loading/not-found/error/image fallback/mobile purchase states.
- [ ] Thay đổi API phải sửa Nest/OpenAPI rồi sync/regenerate.
- [ ] Không đưa Three.js hoặc animation nặng vào critical path nếu không có measurable benefit.
- [ ] Kiểm tra Core Web Vitals, alt text, keyboard focus và reduced motion.
- [ ] Cập nhật Storybook khi purchase/gallery/layout thay đổi đáng kể.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.4.0 | 2026-09-27 | Filter server-side, gỡ facet client-side không đúng, CACHE_POLICY cho search/review, canonical/OG theo `buildPageMetadata`. | CLIENT-20260927-CACHE-PWA-SEO |
| 1.3.0 | 2026-09-25 | Helper bán được dùng chung, phân trang theo page, gallery `media[]`, gỡ nội dung bịa, ISR 120s + `cache()`. | CLIENT-20260925-TRUTHFUL-CATALOG |
| 1.2.0 | 2026-09-13 | Nối `defaultVariantId/defaultVariantSku` với cart và vô hiệu quick-add khi API không có offer hợp lệ. | CLIENT-20260913-QUICK-ADD-CONTRACT |
| 1.1.0 | 2026-09-13 | Browser E2E phát hiện `/catalog` 404; thêm alias dùng chung Products page để không nhân đôi behavior. | CLIENT-20260913-CATALOG-ROUTE-E2E |
| 1.0.0 | 2026-09-13 | Theme DC/Noto Sans và product detail image-first không Three.js. | CLIENT-20260913-DC-PRODUCT-DETAIL |
