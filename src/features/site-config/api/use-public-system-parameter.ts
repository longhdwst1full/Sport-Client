import { useListPublicSystemParameters } from '@/generated/api/system/system';
import { CACHE_POLICY } from '@/lib/query/query-cache-policy';

/**
 * Đọc một tham số công khai (Admin đổi được trong "Tham số hệ thống") và trả `fallback`
 * khi chưa tải xong, lỗi mạng hoặc giá trị không phải số — UI không bao giờ hiển thị trống.
 */
export function usePublicNumberParameter(code: string, fallback: number): number {
  const { data } = useListPublicSystemParameters({ query: { ...CACHE_POLICY.REFERENCE, retry: false } });
  const raw = data?.items.find((item) => item.code === code)?.value;
  const value = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Ngưỡng tiền hàng được miễn phí giao (`SHIPPING_FREE_ORDER_MIN_AMOUNT`, VND).
 *
 * Fallback 0 = ẩn mọi nhắc miễn phí khi chưa tải được: hiển thị sai ngưỡng (Admin có thể đã tắt)
 * nguy hiểm hơn tạm không hiển thị. Phí thật vẫn do báo giá checkout quyết định.
 */
export function useFreeShippingMinAmount(): number {
  return usePublicNumberParameter('SHIPPING_FREE_ORDER_MIN_AMOUNT', 0);
}
