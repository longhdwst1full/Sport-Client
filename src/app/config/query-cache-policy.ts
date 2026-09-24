/**
 * Thời gian coi dữ liệu còn tươi, theo tính chất dữ liệu chứ không theo màn hình.
 *
 * Cùng quy ước với Admin (`admin/src/app/config/query-cache-policy.ts`) để hai frontend không có
 * hai cách hiểu về cùng một loại dữ liệu.
 *
 * Mặc định của react-query là `staleTime: 0`: mỗi lần component gắn lại là một lượt gọi mạng nữa.
 * Với API đặt khác region so với database, mỗi lượt như vậy tốn gần nửa giây mà phần lớn trả về
 * đúng dữ liệu cũ. Storefront còn nhạy hơn Admin vì khách điều hướng qua lại liên tục giữa danh
 * sách và chi tiết.
 *
 * Mức nào KHÔNG được cache dài cũng quan trọng ngang mức nào được:
 * - Giỏ hàng, báo giá checkout, đơn, thanh toán: đọc xong là hành động theo số đó. Dữ liệu cũ ở đây
 *   nghĩa là khách bấm đặt hàng dựa trên một cái giá không còn đúng.
 * - Suất flash sale: số suất còn lại đổi theo từng giây. Cache là hiển thị "còn hàng" cho một
 *   chương trình đã hết suất.
 */
export const CACHE_POLICY = {
  /**
   * Địa giới hành chính của hãng vận chuyển: tỉnh/thành, quận/huyện, phường/xã.
   *
   * Đổi vài lần một năm, và mỗi lần mở form địa chỉ là ba lượt gọi lồng nhau. Đây là nhóm đáng
   * cache nhất trên toàn Storefront.
   */
  REFERENCE: { staleTime: 30 * 60_000, gcTime: 60 * 60_000 },

  /** Danh mục nghiệp vụ: danh mục sản phẩm, bài viết nội dung. Đổi trong ngày là cùng. */
  LOOKUP: { staleTime: 5 * 60_000, gcTime: 30 * 60_000 },

  /**
   * Nội dung bán hàng: danh sách và chi tiết sản phẩm, đánh giá.
   *
   * Đổi được bất cứ lúc nào nhưng khách không cần thấy ngay trong vòng một phút — trừ giá, mà giá
   * cuối cùng luôn do bước báo giá checkout chốt lại chứ không lấy từ đây.
   */
  CATALOG: { staleTime: 60_000, gcTime: 10 * 60_000 },
} as const;
