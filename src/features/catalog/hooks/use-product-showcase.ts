'use client';

import { useMemo } from 'react';
import { useListCatalogProducts } from '@/generated/api/catalog/catalog';
import { vndMoney } from '@/shared/format/money';

export function useProductShowcase() {
  const query = useListCatalogProducts({ page: 1, limit: 8 });
  const products = useMemo(
    () =>
      (query.data?.items ?? []).map((product) => {
        const minPrice = Number(product.minPrice ?? 0);
        // originalPrice will be available from API when promo pricing exists
        const raw = product as unknown as Record<string, unknown>;
        const originalPrice = raw.originalPrice
          ? Number(raw.originalPrice)
          : undefined;

        return {
          id: product.id,
          slug: product.slug,
          productType: product.productType,
          name: product.name,
          brand: product.brand ?? 'DCTD Sport',
          category: product.primaryCategory ?? 'Thiết bị thể thao',
          badge: product.primaryCategory ?? 'Sản phẩm mới',
          imageUrl: product.imageUrl ?? '/icon.svg',
          numericPrice: minPrice,
          displayPrice:
            product.minPrice === null || product.minPrice === undefined
              ? 'Liên hệ tư vấn'
              : vndMoney.format(minPrice),
          originalPrice,
          displayOriginalPrice: originalPrice ? vndMoney.format(originalPrice) : undefined,
        };
      }),
    [query.data?.items],
  );

  return {
    products,
    isPending: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
  };
}
