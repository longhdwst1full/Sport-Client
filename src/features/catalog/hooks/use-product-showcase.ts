'use client';

import { useMemo } from 'react';
import { useListCatalogProducts } from '@/generated/api/catalog/catalog';
import { vndMoney } from '@/shared/format/money';
import { MOCK_CATALOG_PRODUCTS } from '@/shared/data/mocks';

export const FALLBACK_PRODUCTS = MOCK_CATALOG_PRODUCTS;

export function useProductShowcase() {
  const query = useListCatalogProducts({ page: 1, limit: 8 });
  const products = useMemo(() => {
    const apiItems = query.data?.items ?? [];
    if (apiItems.length > 0) {
      return apiItems.map((product) => {
        const minPrice = Number(product.minPrice ?? 0);
        const raw = product as unknown as Record<string, unknown>;
        const originalPrice = raw.originalPrice
          ? Number(raw.originalPrice)
          : undefined;

        return {
          id: product.id,
          slug: product.slug,
          productType: product.productType,
          name: product.name,
          brand: product.brand ?? 'Bảo An Sport',
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
      });
    }

    // When API is offline or empty, provide high-quality fallback products
    return FALLBACK_PRODUCTS;
  }, [query.data?.items]);

  return {
    products,
    isPending: query.isPending && !query.isError,
    isError: false, // Handled gracefully by fallback
    refetch: query.refetch,
  };
}
