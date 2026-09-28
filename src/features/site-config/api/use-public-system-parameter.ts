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
