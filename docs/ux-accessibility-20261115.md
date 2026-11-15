# Storefront UX và accessibility

Document version: 1.0.0  
Last updated: 2026-11-15  
Change summary: route loading, xác nhận xóa giỏ, contrast và ARIA của header/toast.

## Phạm vi

- Loading skeleton ở `/products`, `/catalog`, `/category/[slug]`; `/products/[slug]` có fallback chi tiết riêng. Không chuyển route sang Client Component. Loading không thay thế việc đo/tối ưu API hoặc chứng minh hết giật/đơ.
- Xóa toàn giỏ dùng Modal có tên, focus safe action, trap focus, Escape/hủy và trả focus. Chỉ clear khi xác nhận, không thay API/persistence.
- ProductCard: chữ thương hiệu, giá niêm yết và trạng thái thiếu giá dùng `text-neutral-600`. Axe serious/critical gồm color-contrast đều chặn; không có ngoại lệ contrast.
- Axe phát hiện thêm footer copyright (chữ trên nền tối), auth mode/HTTPS và phí giao giỏ rỗng. Chỉ sửa màu các dòng này: footer sáng hơn, nền trắng dùng neutral-600. E2E giảm chuyển động theo tùy chọn hệ điều hành để không quét ticker đang fade; không loại rule/node contrast.
- Navigation dùng disclosure `aria-expanded`/`aria-controls`, không gán role menu khi chưa triển khai keyboard menu pattern. Escape trả focus rồi đóng, tránh onFocus mở lại.
- Mobile search toggle liên kết panel, focus vào input khi mở; Escape đóng cả khi chưa có kết quả. Mỗi autocomplete có ID listbox/option riêng, không đụng giữa desktop/drawer/mobile.
- Toast có hai live region tồn tại sẵn: status polite cho thông tin, alert assertive cho lỗi. Chỉ nội dung được đọc; nút đóng và thanh đếm giờ nằm ngoài vùng live.

## Kiểm chứng

Component tests bao phủ skeleton, cancel/confirm/focus giỏ, menu disclosure/Escape, ID autocomplete, mobile focus/Escape và toast live region. Vitest không thay thế kiểm tra screen reader thật. Playwright a11y chạy ở 390px/1440px; trang chi tiết/danh mục cần catalog backend truy cập được. Không đánh đồng test bị chặn bởi môi trường với kết quả pass.

Kết quả local production build ngày 15/11/2026:

- TypeScript, ESLint, Next production build: pass. Build vẫn ghi cảnh báo backend catalog/sitemap HTTP 403.
- Vitest: 70 file / 471 test pass (thêm 11 regression test).
- Playwright `a11y.spec.ts` + `ux-accessibility.spec.ts`: 17 pass / 4 fail. Cả 4 failure là GET categories/products HTTP 403 trước khi axe quét trang category/PDP, ở hai viewport. Không sửa test để bỏ qua các failure này.
- Hai ca card contrast dùng fixture browser GET (sản phẩm có giá và thiếu giá), không xác nhận dữ liệu catalog live. Các trang home/products/cart/checkout/login/register/search đã quét không còn violation serious/critical trong trạng thái được kiểm tra; catalog lỗi HTTP là error state, không chứng minh lưới live đạt accessibility.
- Chưa deploy, chưa test screen reader thật. Cần gỡ 403 của môi trường rồi chạy lại đầy đủ 18 ca axe với dữ liệu thật.

## Revision history

| Version | Date | Change |
| --- | --- | --- |
| 1.0.0 | 2026-11-15 | Ghi nhận phạm vi cải thiện UX/a11y và giới hạn kiểm chứng. |
