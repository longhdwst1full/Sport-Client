# Kế hoạch dứt điểm phần việc còn lại

> **Document version:** 1.0.0
>
> **Last updated:** 2026-09-15
>
> **Change summary:** Lập kế hoạch cho phần việc còn lại sau khi đóng R1, R3, R4, R5.

## Cách đọc

Mọi khẳng định "đang hỏng" ở đây đều kèm bằng chứng kiểm bằng mã nguồn hoặc truy vấn tại
thời điểm viết. Việc nào chưa kiểm được thì ghi rõ là **chưa kiểm chứng**.

---

## P1 — Tìm kiếm sản phẩm đang chạy dữ liệu giả (0.5 ngày)

Luồng tìm kiếm hỏng ở **cả hai đầu**:

| Chỗ | Bằng chứng | Hậu quả với khách |
| --- | --- | --- |
| Gợi ý trên header | `autocomplete-search.tsx:46` gọi `searchProducts()` của `shared/data/searchable-catalog.ts` — 291 dòng sản phẩm hardcode, chú thích trong file ghi "Demo CDN data" | Thấy sản phẩm không tồn tại, giá sai; bấm vào ra trang lỗi |
| Trang kết quả `/search` | `search-page.tsx:13` đọc `q` nhưng dòng 53 gọi `<ProductShowcase />` **không truyền q** | Gõ gì cũng ra cùng một danh sách chung |

API đã sẵn sàng: `listCatalogProducts` nhận `search`, `name`, `sku`, `category`.

### Checklist

- [ ] Thêm hook `useProductSearch(query)` trong `features/catalog/hooks`, gọi
      `useListCatalogProducts({ search, limit })`, chỉ chạy khi có từ khoá
- [ ] Mapper trả view model cho gợi ý (tên, giá đã format, ảnh, slug) — component không đọc DTO
- [ ] `AutocompleteSearch` dùng hook; giữ nguyên điều hướng bàn phím và hành vi đóng/mở
- [ ] Trạng thái: đang tìm, không có kết quả, lỗi HTTP — không im lặng trả rỗng
- [ ] `ProductShowcase` nhận thêm từ khoá và truyền xuống API
- [ ] Xoá `shared/data/searchable-catalog.ts`
- [ ] Kiểm thật: gõ một SKU có trong DB phải ra đúng sản phẩm đó; gõ chuỗi vô nghĩa phải ra
      trạng thái rỗng, không phải danh sách chung

---

## P2 — Xoá mock đã chết (1 giờ)

Kiểm bằng `grep -rln` ngoài thư mục `data/`: **0 nơi dùng**.

### Checklist

- [ ] Xoá `shared/data/mocks/home.mock.ts`
- [ ] Xoá `shared/data/mocks/profile.mock.ts`
- [ ] Xoá `shared/data/mocks/notifications.mock.ts`
- [ ] Rà `shared/constants/store.ts`: phần nào còn dùng thì giữ, phần ảnh Unsplash trang trí
      thì thay hoặc bỏ
- [ ] `yarn lint && yarn test && yarn build` xanh

---

## P3 — Route động trả 200 cho nội dung không tồn tại (0.5 ngày)

`/news/<slug-sai>`, `/category/<slug-sai>` và `/chinh-sach/<slug-sai>` đều trả **HTTP 200**
dù trang render đúng giao diện 404. `/chinh-sach` đã gọi `notFound()` từ trước khi sửa R4,
nên đây là lỗi tầng app chứ không phải lỗi của từng route.

Hệ quả: công cụ tìm kiếm lập chỉ mục trang rỗng như trang hợp lệ.

Đã có `e2e/storefront-smoke.spec.ts:61` đánh dấu `test.fixme` cho đúng lỗi này.

### Checklist

- [ ] Tìm nguyên nhân: `not-found.tsx` gốc, cấu hình `revalidate`/`dynamic`, hay tầng phục vụ
- [ ] Sửa để `notFound()` trả đúng 404
- [ ] Gỡ `test.fixme` thành test thật
- [ ] Kiểm cả ba route động

---

## P4 — R2: Đổi trả → Kiểm tra → Hoàn tiền (5–7 ngày)

**Chưa bắt đầu.** Kiểm chứng: `grep -c "model Return\|model Refund" prisma/schema.prisma` → `0`.
Đang chặn chỉ số "số đơn hoàn" trên Dashboard.

Quyết định nghiệp vụ đã chốt: cửa sổ 7 ngày từ `DELIVERED`; guest gọi hotline để nhân viên tạo
hộ; nhân viên tạo thì chờ quản lý duyệt, quản lý tạo thì duyệt luôn; chỉ hoàn phí ship khi lỗi
thuộc về shop; khách trả tiền mặt thì hoàn tiền mặt; nhóm hàng loại trừ dùng cờ `returnable` ở
cấp Category do Admin tự bật/tắt.

Chia ba đợt, mỗi đợt nghiệm thu được độc lập:

### Đợt 1 — Nền dữ liệu (~1 ngày)

- [ ] Model `Return`, `ReturnItem`, `Refund` + ràng buộc trạng thái
- [ ] Cờ `returnable` ở `Category`, mặc định cho phép
- [ ] Lịch sử trạng thái đổi trả theo kiểu chỉ-ghi-thêm, giống `order_status_history`
- [ ] Migration tiến-một-chiều + cập nhật `03-database-v1.md`

### Đợt 2 — Luồng backend (~2–3 ngày)

- [ ] Tạo yêu cầu đổi trả (kiểm cửa sổ 7 ngày, kiểm `returnable`, kiểm đơn đã giao)
- [ ] Duyệt / từ chối, phân biệt người tạo là nhân viên hay quản lý
- [ ] Nhận hàng về và ghi kết quả kiểm tra
- [ ] Hoàn tiền theo đúng hình thức khách đã trả; chỉ hoàn phí ship khi lỗi thuộc shop
- [ ] Hoàn kho theo kết quả kiểm tra
- [ ] Quyền, audit, khoá chống trùng, khoá lạc quan
- [ ] Nghiệm thu một ca đổi trả trọn vẹn trên dữ liệu thật

### Đợt 3 — Màn hình (~2 ngày)

- [ ] Admin: danh sách yêu cầu, chi tiết, các bước xử lý
- [ ] Storefront: khách gửi yêu cầu từ đơn đã giao, xem trạng thái
- [ ] Dashboard: mở lại chỉ số "số đơn hoàn"

---

## P5 — Việc lẻ, làm khi tiện

- [ ] `quoteShipping`: **0 nơi gọi** — nối vào xem trước phí, hoặc ghi lý do vào README checkout
- [ ] Mutation giỏ hàng: mới 1 nơi gọi; giỏ vẫn chủ yếu là Redux cục bộ
- [ ] `vendor-charts` 391 kB nạp ở mọi route Admin — lazy theo route dashboard. **Chưa kiểm
      chứng lại** sau khi viết lại Dashboard
- [ ] Địa giới VN gọi dịch vụ ngoài qua `vietnam-address.service.ts` — giữ hay chuyển về API nội bộ
- [ ] R6: Thông báo, Bảo hành, Marketing trang chủ — đều cần dựng model backend trước

---

## Việc của chủ dự án

- [ ] Push các commit đang chờ ở cả ba repo
- [ ] Redeploy `admin` (bản sửa 404 khi reload) và `api` (bản sửa serverless)
- [ ] Xác nhận 7 cam kết marketing đang hiển thị trên storefront: hàng chính hãng 100%, giao &
      lắp ráp 2H, bảo hành 2–5 năm, đổi mới 7 ngày, trả góp 0% duyệt 5 phút, khảo sát 24H, bảo
      trì trọn đời — **đang chờ từ nhiều phiên, chưa có trả lời**
- [ ] Ghi khoá VNPay vào `api/.env.local` khi muốn bật cổng thanh toán
- [ ] Nhập tồn cho các SKU còn lại muốn bán tại quầy

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.0.0 | 2026-09-15 | Lập kế hoạch sau khi đóng R1, R3, R4, R5. |
