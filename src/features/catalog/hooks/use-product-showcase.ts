'use client';

import { useMemo } from 'react';
import { useListCatalogProducts } from '@/generated/api/catalog/catalog';
import { vndMoney } from '@/shared/format/money';

export interface ProductShowcaseItem {
  id: string;
  defaultVariantId: string | null;
  defaultVariantSku: string | null;
  slug: string;
  productType: string;
  name: string;
  brand: string;
  category: string;
  badge: string;
  imageUrl: string;
  numericPrice: number;
  displayPrice: string;
}

/**
 * Nguồn sản phẩm cho các lưới trưng bày.
 *
 * Trước đây hook này trả dữ liệu mock khi API rỗng/lỗi và luôn báo `isError: false`,
 * nên lỗi backend bị che và khách thấy sản phẩm không tồn tại. Giờ trả đúng trạng
 * thái để phía gọi tự quyết định hiển thị skeleton, empty hay lỗi.
 */
export function useProductShowcase(
  categorySlug?: string,
  searchQuery?: string,
): {
  products: ProductShowcaseItem[];
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
} {
  // Lọc danh mục chạy server-side và gồm cả nhánh con. Trước đây hook lấy 8 sản phẩm
  // đầu của toàn catalog rồi lọc ở client, nên trang danh mục chỉ xét được 8 trong 596
  // sản phẩm và gần như luôn ra sai.
  const search = searchQuery?.trim();
  const query = useListCatalogProducts({
    page: 1,
    limit: categorySlug || search ? 48 : 8,
    category: categorySlug,
    search: search || undefined,
  });

  const products = useMemo<ProductShowcaseItem[]>(
    () =>
      (query.data?.items ?? [])
        .map((product) => {
          const minPrice = Number(product.minPrice ?? 0);
          return {
            id: product.id,
            defaultVariantId: product.defaultVariantId ?? null,
            defaultVariantSku: product.defaultVariantSku ?? null,
            slug: product.slug,
            productType: product.productType,
            name: product.name,
            brand: product.brand ?? 'Bảo An Sport',
            category: product.primaryCategory ?? 'Thiết bị thể thao',
            badge: product.primaryCategory ?? 'Sản phẩm',
            imageUrl: product.imageUrl ?? '/icon.svg',
            numericPrice: minPrice,
            // Giá null nghĩa là chưa có bảng giá hiệu lực, không phải giá 0.
            displayPrice:
              product.minPrice === null || product.minPrice === undefined
                ? 'Liên hệ tư vấn'
                : vndMoney.format(minPrice),
          };
        }),
    [query.data?.items],
  );

  return {
    products,
    isPending: query.isPending,
    isError: query.isError,
    refetch: () => void query.refetch(),
  };
}
