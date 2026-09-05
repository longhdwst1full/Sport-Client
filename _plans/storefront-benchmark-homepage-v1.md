# Storefront benchmark và tối ưu trang chủ V1

> **Document version:** 1.0.0
>
> **Last updated:** 2026-09-05
>
> **Change summary:** Đánh giá sáu storefront cùng ngành và chốt các pattern được áp dụng chọn lọc cho DCTD Sport.

## Mục tiêu

Trang chủ phải giúp khách trả lời nhanh ba câu hỏi: sản phẩm nào phù hợp môn tập, thiết bị
nào phù hợp không gian và vì sao có thể tin tưởng trước khi xem chi tiết. Không sao chép
layout, nhận diện, hình ảnh thương mại hoặc nội dung của website tham khảo.

## Benchmark

| Website | Điểm mạnh nên học | Điểm không áp dụng nguyên trạng |
| --- | --- | --- |
| Decathlon Việt Nam | Điều hướng theo môn thể thao và nhu cầu; catalog rộng nhưng dễ quét | Mega-menu lớn chưa phù hợp số lượng SKU V1 |
| Elipsport | Khuyến mãi, showroom, hotline, bảo hành và độ phủ dịch vụ tạo niềm tin | Không dùng số liệu showroom/khuyến mãi khi chưa có dữ liệu thật |
| Bảo An Sport | Phân nhóm thiết bị gia đình/phòng gym; nội dung tư vấn gắn với catalog | Trang dài và mật độ SEO lớn không phù hợp homepage V1 |
| Kingsport | Card giá/ưu đãi rõ, bằng chứng bán hàng và hệ nội dung hậu mãi | Không hiển thị lượt bán/rating giả hoặc countdown giả |
| Johnson Fitness | Tư vấn theo mục tiêu, diện tích, công suất; thông số và hậu mãi tốt | Chi tiết kỹ thuật chỉ xuất hiện khi API có dữ liệu chuẩn |
| Fitme | Lifestyle imagery, typography và product card dễ quét trên mobile | Visual thời trang không lấn át nhóm thiết bị tập luyện cốt lõi |

## Thay đổi được chọn

- Thêm thanh danh mục nhanh ở desktop và cụm từ khóa phổ biến trên homepage.
- Giữ hero định vị theo giải pháp tập luyện, tăng phân cấp CTA và khả năng đọc.
- Thêm khối chọn cấu hình theo diện tích: góc tập nhỏ, home gym gia đình, studio/phòng tập.
- Chuẩn hóa product card: toàn card có thể truy cập, nhãn combo/category, VAT rõ ràng,
  không còn rating `0` giả và giá thiếu dữ liệu chuyển thành “Liên hệ tư vấn”.
- Thay loading text bằng responsive skeleton; error có `role=alert` và thao tác thử lại.
- Mở rộng footer theo nhóm mua sắm, cam kết và hỗ trợ nhưng không tạo route/policy giả.
- Chỉ dùng CSS transition nhẹ và tôn trọng `prefers-reduced-motion`; chưa thêm Three.js để
  không làm tăng JavaScript/cold load khi chưa có một use case sản phẩm 3D cụ thể.

## Trạng thái hành trình

| Trạng thái | Hành vi |
| --- | --- |
| Loading | Product grid giữ đúng tỷ lệ bằng skeleton bốn card |
| Empty | Thông báo trung tính, không dựng sản phẩm giả |
| Error | Thông báo dễ hiểu và nút thử lại |
| Offline | Service worker chỉ cache shell/public allowlist hiện hành; API vẫn online-only |
| Success | Điều hướng từ môn tập/không gian tới catalog và từ card tới product detail |

## Việc tiếp theo sau homepage

- Catalog route có filter/sort/pagination thật từ API.
- Search overlay dùng API search thay cho anchor trang chủ.
- Store locator, hotline và tư vấn lead chỉ triển khai sau khi chốt dữ liệu chi nhánh.
- Product detail cần gallery, thông số, tồn theo kho, variant/combo và chính sách hậu mãi
  lấy từ contract thay vì nội dung tĩnh.

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.0.0 | 2026-09-05 | Benchmark sáu website và áp dụng navigation, space guide, product card, UI states cho homepage V1. |
