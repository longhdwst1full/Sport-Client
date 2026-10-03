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
 *
 * `refetchOnWindowFocus: false` cho REFERENCE/LOOKUP: khách chuyển tab qua lại liên tục, mỗi lần
 * quay lại mà query đã stale là một loạt request trùng cho dữ liệu gần như không đổi. CATALOG giữ
 * refetch khi focus vì giá/tồn kho hiển thị nên theo kịp khi khách quay lại sau vài phút.
 */
export const CACHE_POLICY = {
  /**
   * Địa giới hành chính của hãng vận chuyển: tỉnh/thành, quận/huyện, phường/xã.
   *
   * Đổi vài lần một năm, và mỗi lần mở form địa chỉ là ba lượt gọi lồng nhau. Đây là nhóm đáng
   * cache nhất trên toàn Storefront.
   */
  REFERENCE: { staleTime: 30 * 60_000, gcTime: 60 * 60_000, refetchOnWindowFocus: false },

  /** Danh mục nghiệp vụ: danh mục sản phẩm, banner, bài viết nội dung. Đổi trong ngày là cùng. */
  LOOKUP: { staleTime: 10 * 60_000, gcTime: 30 * 60_000, refetchOnWindowFocus: false },

  /**
   * Nội dung bán hàng: danh sách và chi tiết sản phẩm, đánh giá.
   *
   * Đổi được bất cứ lúc nào nhưng khách không cần thấy ngay trong vòng một phút — trừ giá, mà giá
   * cuối cùng luôn do bước báo giá checkout chốt lại chứ không lấy từ đây.
   */
  CATALOG: { staleTime: 60_000, gcTime: 10 * 60_000, refetchOnWindowFocus: true },
} as const;

export type CachePolicyName = keyof typeof CACHE_POLICY;

/** Mặc định cho query không thuộc nhóm nào ở dưới (dữ liệu cá nhân, giao dịch, flash sale). */
export const DEFAULT_STALE_TIME = 30_000;

/**
 * Nhóm dữ liệu theo đường dẫn API — cùng chuỗi Orval dùng làm phần tử đầu của query key.
 *
 * Đây là lưới an toàn ở `QueryClient`: hook quên truyền policy vẫn nhận đúng mức cache. Hook tự
 * truyền policy thì option của hook thắng. Danh sách là **allowlist**: đường dẫn không khớp (giỏ,
 * checkout, đơn, thanh toán, tài khoản, flash sale) rơi về `DEFAULT_STALE_TIME`.
 */
const CACHE_POLICY_ROUTES: ReadonlyArray<readonly [RegExp, CachePolicyName]> = [
  [/^\/api\/v1\/shipping\/areas\/(provinces|districts|wards)$/, 'REFERENCE'],
  [/^\/api\/v1\/system\/parameters\/public$/, 'REFERENCE'],
  [/^\/api\/v1\/catalog\/categories$/, 'LOOKUP'],
  [/^\/api\/v1\/content\/posts(\/[^/]+)?$/, 'LOOKUP'],
  [/^\/api\/v1\/content\/banners$/, 'LOOKUP'],
  [/^\/api\/v1\/catalog\/products(\/[^/]+(\/reviews)?)?$/, 'CATALOG'],
];

/**
 * SECURITY: nhóm mang dữ liệu người dùng/giao dịch không bao giờ được xếp vào nhóm cache dài,
 * kể cả khi sau này ai đó thêm một mẫu quá rộng vào `CACHE_POLICY_ROUTES`.
 */
const NEVER_CACHED = /^\/api\/v1\/(auth|account|me|customers?|carts?|checkouts?|orders?|payments?|returns?|promotions)(\/|$)/;

export function cachePolicyForQueryKey(
  queryKey: readonly unknown[],
): (typeof CACHE_POLICY)[CachePolicyName] | undefined {
  const path = queryKey[0];
  if (typeof path !== 'string' || NEVER_CACHED.test(path)) return undefined;
  const match = CACHE_POLICY_ROUTES.find(([pattern]) => pattern.test(path));
  return match ? CACHE_POLICY[match[1]] : undefined;
}
