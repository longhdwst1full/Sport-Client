'use client';

import { useMemo } from 'react';
import { useListCatalogProducts } from '@/generated/api/catalog/catalog';
import { toProductSuggestionView, type ProductSuggestionView } from '../model/product.mapper';

/** Gợi ý đủ để chọn nhanh mà không che hết trang; gõ tiếp sẽ thu hẹp thêm. */
const SUGGESTION_LIMIT = 8;

/**
 * Tìm sản phẩm theo từ khoá người dùng gõ.
 *
 * Trước đây ô tìm kiếm chạy trên một danh sách sản phẩm viết cứng trong mã nguồn, nên khách
 * thấy hàng không tồn tại và bấm vào thì ra trang lỗi. Việc lọc thuộc về Backend: nó nắm
 * toàn bộ catalog, còn client chỉ thấy trang hiện tại.
 */
export function useProductSearch(
  query: string,
  limit: number = SUGGESTION_LIMIT,
): {
  suggestions: ProductSuggestionView[];
  isPending: boolean;
  isError: boolean;
} {
  const search = query.trim();
  const result = useListCatalogProducts(
    { page: 1, limit, search: search || undefined },
    { query: { enabled: search.length > 0 } },
  );

  const suggestions = useMemo(
    () => (result.data?.items ?? []).map(toProductSuggestionView),
    [result.data?.items],
  );

  return {
    suggestions,
    // Chưa gõ gì thì không phải đang chờ kết quả; query đang tắt nên `isPending` luôn bật.
    isPending: search.length > 0 && result.isFetching,
    isError: result.isError,
  };
}
