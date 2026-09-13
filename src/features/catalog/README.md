# Storefront Catalog — maintenance note

> **Document version:** 1.2.0
>
> **Last updated:** 2026-09-13
>
> **Change summary:** Quick-add dùng Sellable SKU do API trả về, không tự tạo variant ID giả từ product ID.

## Phạm vi và ranh giới

- App Router pages sở hữu server fetch/SEO; component trong `features/catalog/components` sở hữu tương tác mua hàng và related products.
- Dữ liệu sản phẩm thật đọc qua generated Catalog SDK. Không sửa DTO/path trong `src/generated/api`.
- Product detail dùng gallery ảnh thật, thông tin bảo hành/xác thực và purchase panel; không tải Three.js ở route này.
- `/products` là route canonical; `/catalog` là alias tương thích cho menu/campaign cũ và không sở hữu logic riêng.
- Theme dùng CSS token `--dc-*` kế thừa có kiểm soát từ hệ Admin/Dragon Web và Noto Sans Vietnamese subset.

## Cache và lỗi

- Product detail hiện network-first (`revalidate = 0`); API 404 map sang Next `notFound`.
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
| 1.2.0 | 2026-09-13 | Nối `defaultVariantId/defaultVariantSku` với cart và vô hiệu quick-add khi API không có offer hợp lệ. | CLIENT-20260913-QUICK-ADD-CONTRACT |
| 1.1.0 | 2026-09-13 | Browser E2E phát hiện `/catalog` 404; thêm alias dùng chung Products page để không nhân đôi behavior. | CLIENT-20260913-CATALOG-ROUTE-E2E |
| 1.0.0 | 2026-09-13 | Theme DC/Noto Sans và product detail image-first không Three.js. | CLIENT-20260913-DC-PRODUCT-DETAIL |
