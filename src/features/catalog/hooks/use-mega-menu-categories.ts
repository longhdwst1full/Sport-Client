'use client';

import { useMemo, useState, useEffect } from 'react';
import { useListCatalogCategories } from '@/generated/api/catalog/catalog';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';
import { CACHE_POLICY } from '@/app/config/query-cache-policy';

export interface MegaMenuEntry {
  slug: string;
  label: string;
  href: string;
  imageUrl: string | null;
  productCount: number;
  children: { slug: string; label: string; href: string; productCount: number }[];
}

/** Giới hạn để menu không đổ ra hàng chục mục khi catalog lớn dần. */
const MAX_PARENTS = 8;
const MAX_CHILDREN = 8;

function toHref(slug: string): string {
  return `/category/${slug}`;
}

/**
 * Menu danh mục dựng từ dữ liệu thật thay vì danh sách viết cứng.
 * API trả danh sách phẳng kèm `depth` và `parentSlug`, nên cây được ghép ở đây.
 */
export function useMegaMenuCategories(): {
  categories: MegaMenuEntry[];
  isPending: boolean;
} {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const query = useListCatalogCategories({
    // Menu danh mục hiện trên mọi trang; đây là truy vấn lặp lại nhiều nhất của Storefront.
    query: { enabled: isMounted, ...CACHE_POLICY.LOOKUP },
  });

  const categories = useMemo(() => {
    const items: CatalogCategoryDto[] = query.data?.items ?? [];
    const childrenByParent = new Map<string, CatalogCategoryDto[]>();
    for (const item of items) {
      if (!item.parentSlug) continue;
      const bucket = childrenByParent.get(item.parentSlug) ?? [];
      bucket.push(item);
      childrenByParent.set(item.parentSlug, bucket);
    }

    return items
      .filter((item) => item.depth === 0)
      // Danh mục rỗng cả nhánh thì không đưa lên menu: bấm vào chỉ thấy trang trống.
      .filter(
        (item) =>
          item.productCount > 0 ||
          (childrenByParent.get(item.slug) ?? []).some((child) => child.productCount > 0),
      )
      .slice(0, MAX_PARENTS)
      .map((item) => ({
        slug: item.slug,
        label: item.name,
        href: toHref(item.slug),
        imageUrl: item.imageUrl ?? null,
        productCount: item.productCount,
        children: (childrenByParent.get(item.slug) ?? [])
          .filter((child) => child.productCount > 0)
          .slice(0, MAX_CHILDREN)
          .map((child) => ({
            slug: child.slug,
            label: child.name,
            href: toHref(child.slug),
            productCount: child.productCount,
          })),
      }));
  }, [query.data]);

  return { categories, isPending: query.isPending };
}
