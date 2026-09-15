# Kế hoạch dứt điểm phần việc còn lại

> **Document version:** 3.2.0
>
> **Last updated:** 2026-09-15
>
> **Change summary:** C1 và C2 xong. R2 làm sau cùng theo chỉ đạo.

## Cách đọc

Mọi khẳng định "đang hỏng" ở đây đều kèm bằng chứng kiểm bằng mã nguồn hoặc truy vấn tại
thời điểm viết. Việc nào chưa kiểm được thì ghi rõ là **chưa kiểm chứng**.

---

## P1 — Tìm kiếm sản phẩm đang chạy dữ liệu giả ✅ XONG

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

## P2 — Xoá mock đã chết ✅ XONG (thu hẹp: chỉ `MOCK_INITIAL_ORDERS` thật sự chết)

Kiểm bằng `grep -rln` ngoài thư mục `data/`: **0 nơi dùng**.

### Checklist

- [ ] Xoá `shared/data/mocks/home.mock.ts`
- [ ] Xoá `shared/data/mocks/profile.mock.ts`
- [ ] Xoá `shared/data/mocks/notifications.mock.ts`
- [ ] Rà `shared/constants/store.ts`: phần nào còn dùng thì giữ, phần ảnh Unsplash trang trí
      thì thay hoặc bỏ
- [ ] `yarn lint && yarn test && yarn build` xanh

---

## P3 — Route động trả 200 ✅ XONG (xem B2)

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


---

# Backlog bổ sung (giao 2026-09-15)

Xếp theo giá trị trên chi phí. Mỗi mục là một đợt giao được độc lập.

## B1 — Đồng bộ trạng thái tài liệu ✅ XONG

Tài liệu đang lệch thực tế, làm mất khả năng trace tiến độ. Bốn chỗ đã chỉ đích danh:

- [ ] `20-sprint-1-execution-status.md` — vẫn ghi thiếu apply migration cũ
- [ ] `28-sprint-3-execution-status.md` — ghi 94% và thiếu cron/browser E2E, trong khi Sprint 4
      đã ghi các bằng chứng này hoàn tất
- [ ] `35-flash-sale-quota-hardening-plan.md` — ghi chưa có PostgreSQL integration test, nhưng
      `test/flash-sale-quota.integration-spec.ts` đã tồn tại
- [ ] `21-admin-crud-coverage.md` — nhiều nhận định về fixture đã lỗi thời
- [ ] Chốt **một nguồn tiến độ duy nhất**; các tài liệu sprint cũ trỏ về đó thay vì tự khai

## B2 — Soft-404 trên route động ✅ XONG

Đã mô tả ở P3 phía trên. Ưu tiên cao vì công cụ tìm kiếm đang lập chỉ mục trang rỗng.

## B3 — Chuẩn hoá thông báo lỗi Backend sang tiếng Việt (1 ngày)

- [ ] Kiểm kê thông báo lỗi còn tiếng Anh trong `api/src`
- [ ] Chuẩn hoá theo giọng đã dùng (ngắn, nói rõ việc cần làm, không lộ chi tiết kỹ thuật)
- [ ] Giữ nguyên `code` máy đọc; chỉ đổi phần `message` cho người
- [ ] Không đổi thông báo trong log kỹ thuật và tên lỗi nội bộ

## B4 — Notification + gửi email (2–3 ngày)

Gộp yêu cầu Nodemailer và Notification làm một vì cùng một luồng.

- [ ] Model `Notification` + endpoint đọc/đánh dấu đã đọc (gỡ `notifications.mock` ở storefront)
- [ ] `MailerService` dùng Nodemailer, cấu hình qua biến môi trường (**khoá SMTP chủ dự án gửi sau**)
- [ ] Template email "đặt hàng thành công": mã đơn, sản phẩm, tổng tiền, địa chỉ nhận, hình thức
      thanh toán
- [ ] Gửi email **không được làm hỏng việc đặt hàng**: lỗi SMTP chỉ ghi nhận, không rollback đơn
- [ ] Chạy được khi chưa có khoá: tắt êm và ghi log, không ném lỗi
- [ ] Warranty để sau, không nằm trong V1 bắt buộc

## B5 — Vật lý hoá Outbox + publisher/retry/dead-letter (1–2 ngày)

- [ ] Bảng outbox thật thay cho cơ chế hiện tại
- [ ] Publisher chạy nền, khoá bản ghi khi phát
- [ ] Retry có giới hạn và giãn cách tăng dần
- [ ] Dead-letter cho bản ghi vượt ngưỡng, kèm màn/hoặc truy vấn để xem lại
- [ ] Gắn với B4: email đi qua outbox thay vì gửi thẳng trong transaction

## B6 — Export báo cáo CSV/XLSX (1 ngày)

- [ ] Export cho từng báo cáo hiện có
- [ ] Quyền riêng cho hành vi export, không dùng chung quyền xem
- [ ] Ghi audit mỗi lần export: ai, báo cáo nào, khoảng thời gian nào

## B7 — PWA hoàn thiện (0.5–1 ngày)

- [ ] Icon PNG 192 và 512 trong manifest (hiện chỉ có SVG)
- [ ] Đạt tiêu chí cài đặt được
- [ ] Nghiệm thu offline bằng trình duyệt, tách khỏi bộ test hiện có

## B8 — Giảm bundle Admin (0.5 ngày)

- [ ] `vendor-charts` ~370 kB đang nạp ở mọi route — lazy theo route dashboard
- [ ] Chunk chính ~747 kB — tách theo route
- [ ] Đo lại và ghi số trước/sau

## B9 — Đồng bộ giỏ hàng nhiều thiết bị (1–2 ngày)

- [ ] Giỏ đang chủ yếu là Redux cục bộ dù API giỏ server-side đã có
- [ ] Đồng bộ khi đăng nhập: gộp giỏ cục bộ vào giỏ server
- [ ] Xử lý xung đột số lượng và sản phẩm hết hàng khi gộp


---

# Backlog hợp nhất (giao 15/09, đợt 2)

Các mục trùng đã gộp: "chuẩn hoá lỗi" (B3 = mục 5), "export báo cáo" (B6 nằm trong mục 8).

## C1 — Loại dữ liệu giả khỏi Client production ✅ XONG

- [x] Profile lấy tên/email/SĐT từ API *(thêm `GET /account/profile` ở Backend — trước đó chưa có endpoint nào trả email/SĐT)*
- [x] Chưa đăng nhập thì chuyển hướng `/login`
- [x] Bỏ hạng Gold và điểm thưởng giả
- [x] Bỏ `MOCK_WARRANTIES` khỏi trang chạy thật; hiện "Chức năng đang phát triển" kèm hotline
- [x] Bỏ rating 4.9, "120+ đã mua" và khai cứng "Còn hàng"
- [x] Không cho thêm vào giỏ khi chưa có giá hợp lệ
- [x] Bỏ giá fallback 1.890.000
- [x] JSON-LD chỉ khai `offers` khi có giá; bỏ hẳn `aggregateRating` và `availability` vì contract không có nguồn
- [x] Domain lấy từ `NEXT_PUBLIC_SITE_URL`

## C2 — Đồng bộ OpenAPI + chặn drift ✅ XONG

- [x] Sinh OpenAPI từ Backend
- [x] Sync contract đúng cho từng repo (17 admin, 11 storefront)
- [x] Chạy Orval cho Admin và Client
- [x] Không sửa tay `src/generated/api` — mọi thay đổi đều qua sinh lại
- [x] `contracts:check` ở cả hai repo, gắn vào `verify` nên CI chạy sẵn
- [x] `permissionVersion`: đã có trên đĩa ở cả contract lẫn SDK hai repo — **đang chờ commit**; chính `contracts:check` phát hiện ra nó thiếu trong HEAD

## C3 — Chuẩn hoá lỗi Backend sang tiếng Việt (1–1.5 ngày) *(gộp B3)*

Hiện còn hơn 100 exception tiếng Anh.

- [ ] Tập trung error code và message vào một nơi
- [ ] Chuyển lỗi: Auth, IAM, Catalog, Cart, Checkout, Inventory, CMS, Review, Media
- [ ] Giữ một định dạng duy nhất: `statusCode`, `code`, `message`, `details`, `path`, `method`, `timestamp`, `requestId`
- [ ] Toast ở FE không hiện `requestId`
- [ ] Test hợp đồng lỗi và thông điệp tiếng Việt

## C4 — Hoàn thiện CMS bài viết (2–3 ngày)

Backend hiện mới có list, detail, create-publish, archive.

- [ ] Backend: nháp, sửa, đăng lại, lưu trữ, phân trang/tìm/lọc theo loại và trạng thái
- [ ] Backend: `expectedVersion` chống ghi đè, audit actor/thời điểm, kiểm slug sản phẩm liên quan
- [ ] Admin: danh sách có lọc và phân trang; tạo/sửa bằng CKEditor 4; xem trước; đăng/lưu trữ/đăng lại
- [ ] Admin: mở form sửa phải điền đủ dữ liệu sẵn có
- [ ] Client: render HTML CKEditor có khử mã độc; không tự chuyển HTML sang Markdown
- [ ] Client: đủ trạng thái tải/lỗi/rỗng/không tìm thấy; **API 500 không được biến thành 404**

## C5 — Hoàn thiện đánh giá và bình luận (3–4 ngày)

- [ ] Khách đã mua mới gửi được đánh giá; có sao, nội dung, hình ảnh
- [ ] Xác minh đã mua hàng
- [ ] Admin duyệt/từ chối/ẩn; từ chối bắt buộc có lý do
- [ ] Admin hoặc cửa hàng trả lời đánh giá
- [ ] Phân trang, tìm kiếm, lọc
- [ ] Bắt buộc khoá lạc quan
- [ ] Audit cho mọi thao tác kiểm duyệt
- [ ] Điểm trung bình và số lượt đánh giá tính từ dữ liệu thật
- [ ] Ghép vào trang chi tiết sản phẩm ở Client

## C6 — Sửa Dashboard và Reporting (1.5–2 ngày) *(gộp B6)*

- [ ] Quyền route khớp quyền API
- [ ] OWNER xem toàn hệ thống; quản lý/nhân viên chi nhánh chỉ xem chi nhánh được gán
- [ ] Số khách cùng phạm vi với đơn hàng
- [ ] Chuẩn múi giờ Asia/Ho_Chi_Minh; doanh thu theo ngày Việt Nam
- [ ] Export CSV/XLSX, quyền riêng cho hành vi export, ghi audit mỗi lần export
- [ ] Test khoảng thời gian giao ngày và giao tháng

## C7 — Sửa giao diện catalog/sản phẩm ở Client (1 ngày, ước lượng của tôi)

- [ ] Tab danh mục dùng mã/slug thay vì so sánh với nhãn hiển thị
- [ ] Bỏ `<button>` nằm trong `<Link>`
- [ ] Tắt thêm nhanh vào giỏ khi không có giá hoặc hết hàng
- [ ] Trang tìm kiếm có phân trang hoặc tải thêm
- [ ] Ô gợi ý bổ sung ARIA combobox/listbox
- [ ] Không hiện kết quả cũ khi từ khoá mới đang chờ
- [ ] Ảnh thiếu dùng ảnh thay thế trung tính của chính dự án

## Thứ tự đề xuất

Nhóm theo "chặn khách hàng" trước, "nợ kỹ thuật" sau:

| Đợt | Gồm | Ước lượng |
| --- | --- | --- |
| 1 | ~~C1, C2~~ ✅ xong | — |
| 2 | C3 (lỗi tiếng Việt), C7 (catalog UI) | 2–2.5 ngày |
| 3 | B4 (Notification + email), B5 (Outbox) | 3–5 ngày |
| 4 | C4 (CMS), C6 (Dashboard/Reporting) | 3.5–5 ngày |
| 5 | C5 (đánh giá), R2 (đổi trả) | 8–11 ngày |
| 6 | B7 (PWA), B8 (bundle), B9 (giỏ hàng) | 2–3.5 ngày |

Tổng còn lại: khoảng **20–29 ngày công việc**.
