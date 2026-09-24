'use client';

import { useEffect, useMemo, useState } from 'react';
import { useListCatalogCategories } from '@/generated/api/catalog/catalog';
import { CACHE_POLICY } from '@/app/config/query-cache-policy';

export interface CategoryTabView {
  /** Slug thật của danh mục, dùng để lọc ở Backend. `null` nghĩa là "Tất cả". */
  slug: string | null;
  label: string;
}

/** Số tab tối đa để hàng tab không tràn trên màn hình hẹp. */
const MAX_TABS = 5;

export function useCategoryTabs(): { tabs: CategoryTabView[]; isPending: boolean } {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const query = useListCatalogCategories({
    query: { enabled: isMounted, ...CACHE_POLICY.LOOKUP },
  });

  const tabs = useMemo<CategoryTabView[]>(() => {
    const roots = (query.data?.items ?? [])
      .filter((item) => !item.parentSlug && item.productCount > 0)
      .sort((left, right) => right.productCount - left.productCount)
      .slice(0, MAX_TABS)
      .map((item) => ({ slug: item.slug, label: item.name }));

    return [{ slug: null, label: 'Tất cả' }, ...roots];
  }, [query.data?.items]);

  return { tabs, isPending: query.isPending };
}
