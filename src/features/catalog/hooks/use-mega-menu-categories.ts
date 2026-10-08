'use client';

import { useMemo } from 'react';
import { useListCatalogCategories } from '@/generated/api/catalog/catalog';
import { CACHE_POLICY } from '@/lib/query/query-cache-policy';
import { useIsMounted } from '@/shared/hooks';
import { toMegaMenuEntries, type MegaMenuEntry } from '../model/mega-menu.mapper';

export type { MegaMenuEntry } from '../model/mega-menu.mapper';

/**
 * Menu danh mục dựng từ dữ liệu thật thay vì danh sách viết cứng.
 *
 * `initialCategories` do layout server dựng sẵn (ISR) để link danh mục có trong HTML đầu tiên
 * (SEO, không chờ hydrate). Có dữ liệu server thì không gọi lại API ở client; chỉ khi server lỗi
 * (`undefined`) mới tải sau khi mount như trước.
 */
export function useMegaMenuCategories(initialCategories?: MegaMenuEntry[]): {
  categories: MegaMenuEntry[];
  isPending: boolean;
} {
  const hasInitial = initialCategories !== undefined;
  const isMounted = useIsMounted();

  const query = useListCatalogCategories({
    // Menu danh mục hiện trên mọi trang; đây là truy vấn lặp lại nhiều nhất của Storefront.
    query: { enabled: isMounted && !hasInitial, ...CACHE_POLICY.LOOKUP },
  });

  const categories = useMemo(
    () => (query.data ? toMegaMenuEntries(query.data.items) : (initialCategories ?? [])),
    [query.data, initialCategories],
  );

  return { categories, isPending: hasInitial ? false : query.isPending };
}
