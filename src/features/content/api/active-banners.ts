import { listActiveBanners } from '@/generated/api/content/content';
import type { BannerPlacement } from '@/generated/api/content/content.schemas';
import { toBannerView, type BannerView } from '../model/banner.mapper';

/**
 * Banner đang hiệu lực cho một vị trí, gọi ở server component (trang/layout ISR 300s).
 *
 * Banner là nội dung phụ trợ: API lỗi hoặc chưa bật kho nội dung thì trả mảng rỗng để nơi gọi
 * giữ nguyên giao diện mặc định, không chặn render trang. API đã sắp theo `sortOrder`, `id`.
 */
export async function loadActiveBanners(
  placement: BannerPlacement,
  categoryId?: string,
): Promise<BannerView[]> {
  try {
    const { items } = await listActiveBanners({ placement, ...(categoryId ? { categoryId } : {}) });
    return items.filter((item) => item.placement === placement && item.desktopImageUrl).map(toBannerView);
  } catch {
    return [];
  }
}
