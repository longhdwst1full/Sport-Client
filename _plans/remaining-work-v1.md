# Phương án cho phần việc còn lại

> **Document version:** 2.1.0
>
> **Last updated:** 2026-09-15
>
> **Change summary:** Viết lại theo trạng thái đã kiểm chứng bằng mã nguồn và database: đóng W1/W3, ghi nhận VNPay, báo cáo, bán tại quầy, vai trò và catalog thật; Sprint 6 vẫn là khối chặn lớn nhất.

## Cách đọc tài liệu này

Mọi mục "đã xong" ở đây đều được kiểm bằng mã nguồn hoặc truy vấn database tại thời điểm cập
nhật, không dựa vào trí nhớ. Mục nào chưa kiểm được thì ghi rõ là **chưa kiểm chứng**.

---

## Đã đóng kể từ bản 1.0.0

| Hạng mục | Bằng chứng |
| --- | --- |
| Worker dọn quota Flash Sale | `api/scripts/configure-flash-sale-quota-expiry-cron.cjs` |
| Catalog thật | 596 sản phẩm, 61 danh mục, 2.980 ảnh trong database |
| Trang chính sách | 9 bài `POLICY`, route `/chinh-sach` |
| Menu danh mục | Dựng từ API, đã gỡ 59 dòng hằng số cứng |
| Quản lý vai trò | CRUD đầy đủ + cây quyền tích chọn |
| VNPay | Backend + IPN + trang kết quả ở storefront |
| Báo cáo & Dashboard | 4 endpoint `Admin Reporting`, Dashboard chạy số thật |
| Đơn tại quầy | Backend xong: `POST /admin/orders/pos` |
| Tách ô tìm kiếm | Sản phẩm và đơn hàng, cộng dồn bằng AND |
| Refresh token | Sửa `/me` bị loại nhầm khỏi luồng xoay token |

---

## Còn lại, theo thứ tự đề xuất

### R1 — Nghiệm thu đơn tại quầy (0.5 ngày)

Backend xong, đã kiểm ba nhánh xác thực. Sổ tồn kho Hà Nội đã mở: 596 SKU, tồn 0, ngưỡng 5.

**Còn lại:** nhập tồn thật cho vài SKU bằng phiếu điều chỉnh tồn, chạy một đơn tại quầy, đối
chiếu tồn trước/sau, rồi dựng màn bán hàng ở Admin (chọn sản phẩm, giỏ, thu tiền, in mã đơn).

Chưa nhập tồn thì đơn tại quầy vẫn bị từ chối — đúng hành vi mong muốn, không phải lỗi.

### R2 — Sprint 6: Đổi trả → Kiểm tra → Hoàn tiền (5–7 ngày)

**Chưa bắt đầu.** Kiểm chứng: `grep -c "model Return\|model Refund" prisma/schema.prisma` → `0`.

Đây là khối lớn nhất còn lại và chặn cả tính năng "số lượng đơn hoàn" trên Dashboard.

Quyết định đã chốt: cửa sổ 7 ngày từ `DELIVERED`; guest gọi hotline để nhân viên tạo hộ;
nhân viên tạo thì chờ quản lý duyệt, quản lý tạo thì duyệt luôn; chỉ hoàn phí ship khi lỗi
thuộc về shop; khách trả tiền mặt thì hoàn tiền mặt. Nhóm hàng loại trừ dùng cờ `returnable`
ở cấp Category, Admin tự bật/tắt — **không hardcode**.

### R3 — Quản lý khách hàng ở Admin (1–2 ngày)

`admin/src/features/customers/model/customers.fixture.ts` vẫn đang được dùng — màn khách hàng
chạy **dữ liệu giả**. Backend chưa có module khách hàng cho admin.

Phạm vi giai đoạn 1 đề xuất: danh sách, tìm kiếm, xem chi tiết (thông tin, địa chỉ, lịch sử
đơn). Tạo và khoá tài khoản để giai đoạn 2.

### R4 — Nội dung bịa đang hiển thị cho khách (0.5 ngày)

`/news/[slug]` và `/category/[slug]` render thân bài hardcode, ảnh Unsplash, số liệu và tác giả
không có thật. Đây là nội dung sai đang chạy trên trang bán, nên ưu tiên cao hơn vẻ ngoài của nó.

### R5 — Dọn ảnh thu nhỏ (0.5 ngày)

596 trong 1.360 ảnh là bản thu nhỏ 150×150 lọt vào thư viện khi crawl — đúng một ảnh mỗi sản
phẩm. Cần migration dọn.

### R6 — Ba nhóm mock chờ model backend

| Nhóm | Cần ở backend |
| --- | --- |
| Thông báo | Model `Notification` + endpoint đọc/đánh dấu đã đọc |
| Bảo hành | Model `Warranty` gắn `OrderItem` |
| Marketing trang chủ | Mở rộng `ContentPost` thêm `postType`, rẻ hơn dựng module CMS mới |

---

## Việc lẻ đã kiểm chứng

- [ ] `quoteShipping`: **0 nơi gọi**. Quyết định nối vào xem trước phí, hoặc ghi lý do không dùng
      vào README của feature checkout (`RULE-CTR-06`).
- [ ] Mutation giỏ hàng: mới **1 nơi gọi**. Giỏ vẫn chủ yếu là Redux cục bộ.
- [ ] `vendor-charts` 391 kB nạp ở mọi route Admin — nên lazy theo route dashboard. **Chưa kiểm
      chứng lại** sau khi viết lại Dashboard.
- [ ] Địa giới VN gọi third-party `vietnam-address.service.ts` — giữ hay chuyển về API nội bộ.
- [ ] Rà soát câu từ toàn storefront; mới sửa các chỗ đi ngang qua.

## Việc của chủ dự án

- Redeploy `admin` (bản sửa 404 khi reload) và `api` (bản sửa serverless)
- Ghi khoá VNPay vào `api/.env.local` khi muốn bật cổng thanh toán
- Nhập tồn thật cho các SKU muốn bán tại quầy (sổ đã mở sẵn, tồn đang 0)

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 2.1.0 | 2026-09-15 | Mở sổ tồn kho Hà Nội; R1 hết chặn, chuyển sang chờ nhập tồn thật. | Quyết định của chủ dự án |
| 2.0.0 | 2026-09-15 | Viết lại theo trạng thái kiểm chứng; đóng W1/W3; thêm VNPay, báo cáo, bán tại quầy; Sprint 6 thành khối chặn chính. | Rà soát mã nguồn + database |
| 1.0.0 | 2026-09-14 | Chốt phương án cho 4 nhóm việc còn tồn. | Execution review |
