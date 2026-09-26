# Kế hoạch & Đặc tả Kỹ thuật Redesign UI/UX Trang chủ Bảo An Sport

> **Tài liệu đặc tả:** `HOME-PAGE-UIUX-REDESIGN.md`  
> **Phiên bản:** 1.0.0  
> **Dự án:** Bảo An Sport (Storefront Client)  
> **Trạng thái:** Sẵn sàng triển khai (Ready for Implementation)  

---

## 1. Bối cảnh & Mục tiêu Chuyển đổi

### 1.1. Hiện trạng
- Website hiện tại đã có nền tảng cơ bản vững chắc (Design system sạch, tone màu xanh thể thao, kết nối API catalog/promotions/content/auth).
- **Vấn đề cốt lõi:** Bố cục trang chủ đang bị **"phẳng" (content-heavy, mang tính catalog/danh bạ)** thay vì **thương mại & thúc đẩy chuyển đổi (commercial & conversion-driven)**. Tất cả các section có trọng số thị giác tương đương nhau, người dùng thiếu các lối tắt ra quyết định mua hàng (decision shortcuts).
- **Lỗi kỹ thuật đã giải quyết:** Lỗi nháy khối Flash Sale rồi biến mất do điều kiện `!isPending && !campaign` đã được sửa triệt để thành `!campaign || campaign.deals.length === 0`.

### 1.2. Mục tiêu Redesign
Chuyển hóa Homepage từ mô hình *"Hiển thị nội dung tuần tự"* sang phễu bán lẻ e-commerce chuyên nghiệp:
$$\text{THU HÚT} \longrightarrow \text{ĐỊNH HƯỚNG} \longrightarrow \text{KHÁM PHÁ} \longrightarrow \text{SO SÁNH} \longrightarrow \text{TIN TƯỞNG} \longrightarrow \text{MUA HÀNG}$$

---

## 2. Chuẩn hóa Design System & Tokens

Để tránh lộn xộn các giá trị lẻ, toàn bộ giao diện trang chủ tuân thủ bộ quy chuẩn:

### 2.1. Bảng màu (Color Palette)
- **Primary / Accent:** `emerald-600` (`#059669`) / `emerald-500` (`#10B981`) — Năng động, tin cậy.
- **Deep Dark / Premium Contrast:** `slate-950` (`#020617`), `slate-900` (`#0F172A`).
- **Surface / Background:** Nền sáng `slate-50` (`#F8FAFC`) / `white` (`#FFFFFF`).
- **Text:** Primary `slate-900` (`#0F172A`), Secondary `slate-600` (`#475569`), Muted `slate-400` (`#94A3B8`).
- **Borders:** `slate-200` (`#E2E8F0`) hoặc `slate-100` (`#F1F5F9`).
- **Sale / Flash Promo:** `rose-600` (`#E11D48`) / `rose-500` (`#F43F5E`).

### 2.2. Bo góc (Border Radius) chuẩn hóa
- **Button:** `rounded-lg` (8px) hoặc `rounded-full` (cho pill badge / pill button).
- **Input / Search bar:** `rounded-xl` (12px) hoặc `rounded-full`.
- **Product Card:** `rounded-2xl` (16px).
- **Section Card / Container lớn:** `rounded-3xl` (24px).
- **Modal / Popup:** `rounded-3xl` (24px).

### 2.3. Khoảng cách (Vertical Spacing)
- **Khoảng cách giữa các Section:**
  - Desktop (lg/xl): `py-16` đến `py-20` (64px – 80px).
  - Mobile (sm): `py-10` đến `py-12` (40px – 48px).
- **Max Container Width:** `max-w-7xl` (1280px), padding ngang `px-4 sm:px-6 lg:px-8`.

---

## 3. Kiến trúc Thông tin & Luồng Trang chủ Đề xuất

```
┌─────────────────────────────────────────────────────────────┐
│ 1. TOP ANNOUNCEMENT BAR (Hotline, Giờ mở cửa, Showroom)    │
├─────────────────────────────────────────────────────────────┤
│ 2. MAIN HEADER (Logo | Search Bar Trung Tâm | Account | Cart)│
├─────────────────────────────────────────────────────────────┤
│ 3. NAVIGATION BAR (Danh mục chính, Bộ môn, Sale, Khuyến mãi)│
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. HERO SECTION (Conversion: Giải pháp Home Gym & Combo)   │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. "BẠN ĐANG TÌM GÌ?" (Quick Goal Navigation: 4 Mục tiêu)  │
│    [ 🏠 Tập tại nhà ] [ 💪 Tăng cơ ] [ 🔥 Giảm cân ] [ 🏢 Gym ]│
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. KHÁM PHÁ THEO BỘ MÔN (Category Discovery Visual Cards)  │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. FLASH SALE (Live Countdown - Tự động ẩn nếu không có ca) │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. SẢN PHẨM BÁN CHẠY & NỔI BẬT (Product Tabs + Quick Add)   │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. CHỌN THIẾT BỊ THEO NGÂN SÁCH (Budget Shortcuts)        │
│    [ Dưới 500K ] [ 500K - 2TR ] [ 2TR - 5TR ] [ Trên 5TR ]  │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. VÌ SAO CHỌN BẢO AN SPORT? (4 Cam kết giải quyết ngần ngại)│
│    [ 🚚 Giao hàng ] [ 💰 Giá tốt ] [ 🎧 Tư vấn ] [ 🛡 Bảo hành ]│
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 11. SOCIAL PROOF & HỆ THỐNG SHOWROOM (Đánh giá 4.9★, Địa chỉ)│
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 12. BẢO AN TRAINING LAB CTA (Tư vấn chọn thiết bị miễn phí) │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 13. KIẾN THỨC THỂ THAO & BÀI VIẾT MỚI (1 bài lớn + 3 bài nhỏ)│
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 14. FOOTER (Gọn gàng, phân cấp rõ Sản phẩm - Hỗ trợ - Pháp lý)│
└─────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────┐
│ 15. FLOATING ACTIONS (Gọi hotline, Chat Zalo, Về đầu trang) │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Đặc tả Chi tiết Từng Section

### Section 1: Header & Ô tìm kiếm (Search Bar)
- **Vấn đề cũ:** Ô tìm kiếm Desktop hơi nhỏ, khi bấm vào ô trống chưa có gợi ý ngữ cảnh.
- **Giải pháp mới:**
  - Ô Search là thành phần trọng tâm (Primary interaction) tại Header: chiều rộng `max-w-xl` đến `max-w-2xl`.
  - **Trạng thái khi Focus vào ô Search (ngay cả khi chưa gõ ký tự):**
    - Hiển thị popover với 2 khối rõ ràng:
      1. *Từ khóa tìm nhiều:* "Máy chạy bộ", "Ghế tập tạ", "Bộ tạ 20kg", "Bàn bóng bàn", "Bao cát boxing".
      2. *Bộ môn phổ biến:* Phím tắt dẫn nhanh sang `/category/gym`, `/category/yoga`, `/category/boxing`.
  - **Trạng thái gõ từ khóa:** Phân loại kết quả rõ ràng:
    - *Sản phẩm tương ứng* (Ảnh thumbnail, Tên, Giá, Variant).
    - *Danh mục gợi ý* ("Xem thêm tất cả sản phẩm thuộc Dụng cụ Gym...").
  - Phím tắt bàn phím: `Escape` để đóng, `Mũi tên lên/xuống` để chọn, `Enter` để điều hướng.

### Section 2: Hero Section (Định vị Giải pháp & Chuyển đổi)
- **Vấn đề cũ:** Hero giới thiệu bài viết và khẩu hiệu chung, cảm giác thương mại chưa đủ mạnh.
- **Giải pháp mới:**
  - Slide ưu tiên: **"GIẢI PHÁP HOME GYM — Biến góc nhà thành không gian rèn luyện chuẩn chuyên nghiệp"**.
  - Bổ sung thông điệp kích hoạt mua: *"Thiết bị nhập khẩu chính hãng từ 1.000.000đ • Tư vấn combo theo diện tích 5m² - 20m²"*.
  - 2 CTA rõ ràng:
    - CTA 1 (Primary): `[ Khám phá Giải pháp Home Gym → ]` dẫn tới nhóm sản phẩm combo/thiết bị gia đình.
    - CTA 2 (Secondary / Outline): `[ Xem danh mục máy tập ]`.
  - Giữ tính năng xoay bài viết tin tức hữu ích ở các slide kế tiếp (tận dụng dữ liệu thật từ API CMS).

### Section 3: "Bạn đang tìm gì?" (Quick Goal Navigation)
- **Vị trí:** Ngay dưới Hero Slider, trên nền xám nhẹ hoặc dải phân cách nổi.
- **Ý nghĩa:** Khách hàng không nghĩ theo category ("Dụng cụ tập thể lực"), họ nghĩ theo mục tiêu tập luyện.
- **Bố cục:** Grid 4 card mục tiêu (Desktop 4 cột, Mobile 2 cột):
  1. **🏠 Tập luyện tại nhà (Home Fitness):** Máy chạy bộ, xe đạp, thảm, dây kháng lực $\rightarrow$ `/category/tap-tai-nha` hoặc link lọc.
  2. **💪 Tăng cơ & Sức mạnh (Strength & Muscle):** Giàn tạ, tạ đơn, ghế tập tạ, xà đơn $\rightarrow$ `/category/gym`.
  3. **🔥 Đốt mỡ & Giảm cân (Cardio & Fat Burn):** Máy chạy, máy chèo thuyền, dây nhảy $\rightarrow$ `/category/cardio`.
  4. **🏢 Setup Phòng Gym / Doanh nghiệp:** Thiết bị thương mại, tạ khối, thảm sàn cao su $\rightarrow$ `/contact`.
- **Card UI:** Icon 3D/vector hiện đại, tiêu đề in đậm, nhãn phụ gợi ý ("Từ 350.000đ"), hover hiệu ứng nhấc thẻ (`hover:-translate-y-1 hover:shadow-md`).

### Section 4: Category Discovery (Khám phá theo Bộ môn)
- **Vấn đề cũ:** Thẻ danh mục icon tối màu trông hơi giống nút chức năng hơn là catalog hấp dẫn.
- **Giải pháp mới:**
  - Tiêu đề section: **"Khám Phá Thiết Bị Theo Bộ Môn"** — Subtitle: *"Đầy đủ dụng cụ tập luyện cho mọi lứa tuổi và cấp độ"*.
  - Card danh mục to hơn, hiển thị ảnh đại diện bộ môn chất lượng cao (hoặc gradient phong cách thể thao cao cấp) kèm badge số lượng sản phẩm thật từ API (`item.productCount`).
  - Lối tắt nhanh các từ khóa sản phẩm hot nhất ở ngay dưới dải danh mục.

### Section 5: Flash Sale Section (Live Promotion)
- **Logic:** Tự động ẩn hoàn toàn nếu không có chiến dịch `ACTIVE` (đã fix).
- **Giao diện khi hiển thị:**
  - Nền gradient tối `slate-950` tạo cảm giác chớp nhoáng (Urgency).
  - Đồng hồ đếm ngược đồng bộ giờ server.
  - Thẻ sản phẩm Flash Sale có thanh tiến độ số lượng đã bán (`Còn lại 4/10 suất`).
  - Nút thêm nhanh vào giỏ.

### Section 6: Cải tiến Product Card & Quick Add to Cart
- **Vấn đề cũ:** Chỉ có 1 nút duy nhất là "Mua ngay" (bấm là nhảy sang `/checkout`), không có nút thêm nhanh vào giỏ tại chỗ; thiếu phân cấp giá rõ ràng.
- **Giải pháp mới:**
  - **Cấu trúc Card:**
    ```
    ┌──────────────────────────────────┐
    │ [Badge Giảm giá/Combo]       [♡] │
    │                                  │
    │         ẢNH SẢN PHẨM             │
    │   (Hover: Nút [+ Thêm Giỏ] nổi)  │
    ├──────────────────────────────────┤
    │ THƯƠNG HIỆU • DANH MỤC           │
    │ Tên sản phẩm (tối đa 2 dòng)      │
    │ ⭐ 4.9 (Đánh giá thực tế)        │
    │                                  │
    │ 3.850.000đ   <del>4.500.000đ</del>│
    │                                  │
    │ [ + Thêm vào giỏ ]  [ Mua ngay ] │
    └──────────────────────────────────┘
    ```
  - **Hành vi Quick Add to Cart:**
    - Bấm `[+ Thêm vào giỏ]`: Thêm sản phẩm vào Redux Cart State, bắn **Global Toast** thông báo thành công: *"Đã thêm [Tên sản phẩm] vào giỏ hàng"*, icon giỏ hàng trên Header nhảy số (+1) kèm hiệu ứng bounce nhẹ.
    - Không chuyển hướng trang, giữ khách hàng tiếp tục lướt xem các món khác.

### Section 7: Lối tắt "Chọn theo Ngân sách" (Budget Decision Shortcuts)
- **Mục đích:** Hỗ trợ khách hàng có ngân sách cố định tìm đồ nhanh chóng.
- **4 Mốc phân khúc:**
  1. `[ Dưới 500.000đ ]` — Phụ kiện, dây kháng lực, bình nước, găng tay, con lăn tập bụng.
  2. `[ 500.000đ – 2.000.000đ ]` — Tạ tay, đòn tạ, xà đơn, thảm tập cao cấp, vợt.
  3. `[ 2.000.000đ – 5.000.000đ ]` — Ghế tập tạ đa năng, trụ đấm bốc, bàn bóng bàn mini.
  4. `[ Trên 5.000.000đ ]` — Máy chạy bộ, giàn tạ khối đa năng, xe đạp trượt tuyết.
- **Điều hướng:** Bấm vào sẽ mở trang `/category` hoặc `/search` với bộ lọc giá tương ứng.

### Section 8: Core Commitments & Trust (Cam kết & Bằng chứng Tin cậy)
- **Vấn đề cũ:** Phần cam kết (USP) nằm quá cao hoặc tản mạn, còn thông tin Showroom/Bảo hành lại nằm tuốt ở Footer. Khách mua máy tập tiền triệu rất e ngại về vận chuyển, lắp đặt và bảo hành.
- **Giải pháp mới:**
  - **4 Cam kết Vàng:**
    1. 🚚 **Giao hàng & Lắp đặt:** Hỗ trợ vận chuyển toàn quốc, hướng dẫn lắp đặt tận nhà.
    2. 💰 **Cam kết Giá tốt:** Hàng nhập khẩu chính ngạch, giá minh bạch đã gồm VAT.
    3. 🎧 **Tư vấn Huấn luyện viên:** Đội ngũ am hiểu thể hình tư vấn đúng nhu cầu & diện tích.
    4. 🛡 **Bảo hành Chính hãng:** Đổi mới 7 ngày nếu lỗi, bảo hành khung sườn lên đến 5 năm.
  - **Dải Bằng chứng Tin cậy (Social Proof & Showroom):**
    - Đánh giá trung bình: `★★★★★ 4.9/5` từ hơn 3.200+ khách hàng.
    - Hệ thống 2 showroom thực tế tại Hà Nội và TP. Hồ Chí Minh để khách đến tập thử máy trực tiếp.

### Section 9: Bảo An Training Lab & Kiến thức Luyện tập (Content & SEO)
- Thay vì 4 thẻ tin tức ngang nhau, sử dụng layout Tạp chí thể thao:
  - 1 Bài viết tâm điểm (Featured Post) lớn bên trái: Ảnh to, tiêu đề hấp dẫn (VD: *Hướng dẫn setup phòng gym gia đình 10m² đầy đủ bài tập*).
  - 2-3 Bài viết phụ dạng danh sách bên phải.
  - Nút xem toàn bộ cẩm nang luyện tập.

### Section 10: Floating Action Buttons (Hỗ trợ Nhanh)
- Nút cố định góc dưới bên phải màn hình:
  - 💬 **Tư vấn Zalo / Chat trực tiếp:** Mở popup nhanh chọn nhu cầu (Tư vấn máy chạy / Ghế tạ / Phụ kiện) rồi điều hướng Zalo OA.
  - 📞 **Hotline khẩn cấp:** Gọi nhanh khi cần giải quyết đơn hàng.
  - ⬆ **Về đầu trang:** Hiện khi cuộn qua 600px.

---

## 5. Lộ trình Triển khai (Phased Implementation)

### 📌 Giai đoạn P0: Cốt lõi Chuyển đổi & Trải nghiệm Mua (Triển khai ngay)
- [x] **P0.1: Fix bug Flash Sale:** Sửa điều kiện ẩn hiện Flash Sale trong `flash-sale-section.tsx`.
- [ ] **P0.2: Quick Goal Navigation:** Tạo component `quick-goal-navigation.tsx` và đặt ngay dưới Hero trên trang chủ.
- [ ] **P0.3: Nâng cấp Product Card + Quick Add Cart:**
  - Bổ sung nút `+ Thêm vào giỏ` kèm Toast thông báo.
  - Giữ nút `Mua ngay` cho khách muốn thanh toán liền.
- [ ] **P0.4: Tinh chỉnh Search Header:** Thêm popover gợi ý từ khóa/bộ môn hot khi focus ô tìm kiếm.

### 📌 Giai đoạn P1: Xây dựng Niềm tin & Lối tắt Ra quyết định
- [ ] **P1.1: Budget Navigation:** Tạo khối "Chọn thiết bị theo ngân sách" 4 khoảng giá.
- [ ] **P1.2: Rework Trust & Showroom Section:** Đưa khối Showroom và đánh giá 4.9★ lên phía trên phần bài viết.
- [ ] **P1.3: Cải tiến Floating Buttons:** Tối ưu cụm liên hệ nổi bên góc phải màn hình.

### 📌 Giai đoạn P2: Nội dung & Tối ưu Giao diện
- [ ] **P2.1: Rework Blog / Stories:** Chuyển layout bài viết sang dạng 1 bài lớn + danh sách bài nhỏ.
- [ ] **P2.2: Rework Hero Banner:** Bổ sung slide chuyên đề "Setup Home Gym trọn gói".
- [ ] **P2.3: Mobile Responsive Audit:** Đảm bảo toàn bộ touch targets trên điện thoại $\ge 44\text{px}$.

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

1. **Hiệu năng & Trải nghiệm:**
   - Không còn hiện tượng nhấp nháy / giật layout (Zero CLS) khi tải trang chủ.
   - Khi bấm `+ Thêm vào giỏ` trên thẻ sản phẩm, giỏ hàng cập nhật ngay lập tức mà không reload hay nhảy trang.
2. **Khả năng tương thích:**
   - Hoạt động trơn tru trên mọi độ phân giải (Mobile 375px, Tablet 768px, Desktop 1280px+).
   - Tôn trọng dữ liệu API thật (không dùng dữ liệu ảo có thể gây lỗi checkout hay catalog).
3. **SEO & Accessibility:**
   - Đầy đủ thẻ `alt` hình ảnh, `aria-label` cho các nút bấm, cấu trúc heading `H1 -> H2 -> H3` chuẩn chuẩn mực.
