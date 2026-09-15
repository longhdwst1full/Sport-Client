'use client';

import { useMemo } from 'react';
import { useListCatalogCategories } from '@/generated/api/catalog/catalog';

export interface CategoryTabView {
  /** Slug thật của danh mục, dùng để lọc ở Backend. `null` nghĩa là "Tất cả". */
  slug: string | null;
  label: string;
}

/** Số tab tối đa để hàng tab không tràn trên màn hình hẹp. */
const MAX_TABS = 5;

/**
 * Tab lọc dựng từ danh mục thật.
 *
 * Bản trước dùng danh sách tab viết cứng với id tự đặt ('gym', 'cardio'...) rồi so sánh
 * với tên danh mục trả về từ API ('Tạ Tay - Tạ Đơn'). Hai vế không bao giờ bằng nhau nên
 * bấm tab nào cũng ra danh sách rỗng.
 */
export function useCategoryTabs(): { tabs: CategoryTabView[]; isPending: boolean } {
  const query = useListCatalogCategories();

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
