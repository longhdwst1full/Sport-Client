import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { toActiveBannerViews, type BannerView } from '@/features/content';
import { listCatalogCategories } from '@/generated/api/catalog/catalog';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';
import { listActiveBanners } from '@/generated/api/content/content';
import { PUBLIC_DATA_TAGS } from './public-data-tags';
import type { BannerPlacement } from '@/generated/api/content/content.schemas';

/**
 * Dữ liệu công khai, ít đổi, dùng ở nhiều route: cây danh mục (layout, trang chủ, danh mục, sản
 * phẩm) và banner. Axios không đi qua `fetch` của Next nên không có Data Cache; trước đây mỗi lượt
 * dựng lại một trang ISR gọi API danh mục 2–3 lần (layout và page mỗi nơi một `cache()` riêng).
 *
 * - `unstable_cache`: chia sẻ kết quả GIỮA các request/trang, có tag để `/api/revalidate` làm mới
 *   ngay (`revalidateTag`) thay vì chờ hết cửa sổ.
 * - `cache` (React): gộp các lượt gọi trong CÙNG một request.
 *
 * Chỉ dành cho dữ liệu công khai, không phụ thuộc phiên (server không có token khách). Lỗi API
 * không bị cache (`unstable_cache` không lưu exception), nơi gọi tự chọn giá trị dự phòng.
 * Đặt ở tầng `app` vì `next/cache` không được lọt vào barrel feature mà component client import.
 */
export { PUBLIC_DATA_TAGS };

/** Khớp ISR 300s của layout storefront; tag cho phép làm mới sớm hơn. */
const PUBLIC_DATA_REVALIDATE_SECONDS = 300;

const cachedCategories = unstable_cache(
  async (): Promise<CatalogCategoryDto[]> => (await listCatalogCategories()).items,
  ['public-catalog-categories-v1'],
  { revalidate: PUBLIC_DATA_REVALIDATE_SECONDS, tags: [PUBLIC_DATA_TAGS.categories] },
);

const cachedBanners = unstable_cache(
  async (placement: BannerPlacement, categoryId: string) =>
    (await listActiveBanners({ placement, ...(categoryId ? { categoryId } : {}) })).items,
  ['public-content-banners-v1'],
  { revalidate: PUBLIC_DATA_REVALIDATE_SECONDS, tags: [PUBLIC_DATA_TAGS.banners] },
);

/** Cây danh mục công khai; API lỗi → `undefined` để nơi gọi tự quyết dự phòng. */
export const getPublicCategories = cache(async (): Promise<CatalogCategoryDto[] | undefined> => {
  try {
    return await cachedCategories();
  } catch {
    return undefined;
  }
});

/** Banner đang hiệu lực của một vị trí; lỗi → mảng rỗng (banner là nội dung phụ trợ). */
export const getActiveBannerViews = cache(
  async (placement: BannerPlacement, categoryId?: string): Promise<BannerView[]> => {
    try {
      return toActiveBannerViews(await cachedBanners(placement, categoryId ?? ''), placement);
    } catch {
      return [];
    }
  },
);
