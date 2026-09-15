'use client';

import { useEffect, useMemo, useState } from 'react';
import { useListCatalogProducts } from '@/generated/api/catalog/catalog';
import { vndMoney } from '@/shared/format/money';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';

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
  /** Chưa có bảng giá hiệu lực thì không bán được: giá 0 không phải là giá. */
  hasPrice: boolean;
}

/**
 * Nguồn sản phẩm cho các lưới trưng bày.
 *
 * Trước đây hook này trả dữ liệu mock khi API rỗng/lỗi và luôn báo `isError: false`,
 * nên lỗi backend bị che và khách thấy sản phẩm không tồn tại. Giờ trả đúng trạng
 * thái để phía gọi tự quyết định hiển thị skeleton, empty hay lỗi.
 */
/** Số sản phẩm mỗi lượt khi có phạm vi lọc; lưới trưng bày ở trang chủ thì ít hơn. */
const SCOPED_PAGE_SIZE = 24;
const SHOWCASE_SIZE = 8;

export function useProductShowcase(
  categorySlug?: string,
  searchQuery?: string,
): {
  products: ProductShowcaseItem[];
  total: number;
  hasMore: boolean;
  loadMore: () => void;
  isPending: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  refetch: () => void;
} {
  // Lọc danh mục chạy server-side và gồm cả nhánh con. Trước đây hook lấy 8 sản phẩm
  // đầu của toàn catalog rồi lọc ở client, nên trang danh mục chỉ xét được 8 trong 596
  // sản phẩm và gần như luôn ra sai.
  const search = searchQuery?.trim();
  const scoped = Boolean(categorySlug || search);
  const pageSize = scoped ? SCOPED_PAGE_SIZE : SHOWCASE_SIZE;

  // Tải thêm bằng cách nới dần số lượng lấy về. Trước đây lấy cứng 48 rồi dừng, nên tìm
  // từ khoá phổ biến là mất phần kết quả dư mà khách không có cách nào xem tiếp.
  const [limit, setLimit] = useState(pageSize);
  useEffect(() => setLimit(pageSize), [categorySlug, search, pageSize]);

  const query = useListCatalogProducts({
    page: 1,
    limit,
    category: categorySlug,
    search: search || undefined,
  });
  const total = query.data?.meta.total ?? 0;

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
            // Ảnh thay thế trung tính của chính dự án. Trước đây dùng '/icon.svg' là logo
            // ứng dụng, nên lưới sản phẩm thiếu ảnh trông như lỗi hiển thị.
            imageUrl: product.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE,
            numericPrice: minPrice,
            hasPrice: product.minPrice !== null && product.minPrice !== undefined,
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
    total,
    hasMore: products.length < total,
    loadMore: () => setLimit((current) => current + pageSize),
    isPending: query.isPending,
    // Đang lấy thêm thì giữ nguyên danh sách hiện có, chỉ báo bận ở nút.
    isLoadingMore: query.isFetching && !query.isPending,
    isError: query.isError,
    refetch: () => void query.refetch(),
  };
}
