'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type CatalogViewMode = 'grid' | 'list';

/** Khoá URL của chế độ xem; vắng mặt = lưới. Không thuộc bộ lọc nên không vào query key của danh sách. */
export const CATALOG_VIEW_PARAM = 'view';

/** Chỉ `list` hợp lệ; mọi giá trị khác (rỗng, lạ, `grid`) rơi về lưới. */
export function parseCatalogViewMode(value: string | null | undefined): CatalogViewMode {
  return value === 'list' ? 'list' : 'grid';
}

/** Trả query string mới: chỉ đổi `view`, giữ nguyên mọi tham số khác (kể cả `page`/bộ lọc). Lưới thì xoá khoá. */
export function withCatalogViewMode(search: string | URLSearchParams, mode: CatalogViewMode): string {
  const next = new URLSearchParams(typeof search === 'string' ? search : search.toString());
  if (mode === 'list') next.set(CATALOG_VIEW_PARAM, 'list');
  else next.delete(CATALOG_VIEW_PARAM);
  return next.toString();
}

/**
 * Chế độ xem lưới/danh sách nằm trên URL (`?view=list`). Đổi chế độ chỉ `router.replace` với
 * `scroll:false`, không đụng bộ lọc/trang và không làm đổi query key nên không tải lại danh sách.
 * `useSearchParams` có sẵn ở server với route động nên HTML đầu đã đúng chế độ.
 */
export function useCatalogViewMode() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewMode = parseCatalogViewMode(searchParams.get(CATALOG_VIEW_PARAM));
  const search = searchParams.toString();

  const setViewMode = useCallback(
    (mode: CatalogViewMode) => {
      if (mode === parseCatalogViewMode(new URLSearchParams(search).get(CATALOG_VIEW_PARAM))) return;
      const query = withCatalogViewMode(search, mode);
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, search],
  );

  return { viewMode, setViewMode };
}
