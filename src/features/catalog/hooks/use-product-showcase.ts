'use client';

import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getListCatalogProductsQueryKey,
  listCatalogProducts,
} from '@/generated/api/catalog/catalog';
import type { ProductListResponseDto } from '@/generated/api/catalog/models';
import { CACHE_POLICY } from '@/app/config/query-cache-policy';
import {
  CATALOG_PAGE_SIZE,
  toProductShowcaseItems,
  type ProductShowcaseItem,
} from '../model/product.mapper';

export type { ProductShowcaseItem } from '../model/product.mapper';

export interface ProductShowcaseOptions {
  /** Ghi đè cỡ trang; luôn bị chặn ở `CATALOG_PAGE_SIZE.MAX` vì API trả 400 khi vượt. */
  pageSize?: number;
  /**
   * Trang 1 server đã lấy sẵn (chỉ áp dụng khi không có danh mục/từ khoá), để HTML SSR có
   * sản phẩm thay vì chỉ có skeleton. Phải cùng `pageSize` với lượt gọi của server.
   */
  initialPage?: ProductListResponseDto;
  /** Thời điểm server lấy `initialPage` (ms); cache cũ hơn `staleTime` sẽ được làm mới sau mount. */
  initialPageFetchedAt?: number;
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
  options: ProductShowcaseOptions = {},
): {
  products: ProductShowcaseItem[];
  total: number;
  hasMore: boolean;
  loadMore: () => void;
  isPending: boolean;
  isLoadingMore: boolean;
  /** Lượt tải thêm lỗi; danh sách đã có vẫn giữ nguyên, nút tải thêm cho thử lại. */
  isLoadMoreError: boolean;
  isError: boolean;
  refetch: () => void;
} {
  // Lọc danh mục chạy server-side và gồm cả nhánh con. Trước đây hook lấy 8 sản phẩm
  // đầu của toàn catalog rồi lọc ở client, nên trang danh mục chỉ xét được 8 trong 596
  // sản phẩm và gần như luôn ra sai.
  const search = searchQuery?.trim() || undefined;
  const scoped = Boolean(categorySlug || search);
  const pageSize = Math.min(
    options.pageSize ?? (scoped ? CATALOG_PAGE_SIZE.SCOPED : CATALOG_PAGE_SIZE.SHOWCASE),
    CATALOG_PAGE_SIZE.MAX,
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // CONTRACT: tải thêm theo `page`, giữ `limit` cố định. Bản trước nới `limit` thêm một
  // trang mỗi lần bấm, nên tới lượt thứ 5 ở trang danh mục (limit 120) API trả 400 và
  // khách không bao giờ xem được phần còn lại.
  const params = { limit: pageSize, category: categorySlug, search };
  const initialData =
    !scoped && options.initialPage && options.initialPage.meta.limit === pageSize
      ? { pages: [options.initialPage], pageParams: [1] }
      : undefined;

  const query = useInfiniteQuery({
    // Hậu tố 'infinite' tách cache dạng `{ pages }` khỏi cache một trang của
    // `useListCatalogProducts` cùng tham số; dùng chung key là hai hình dạng dữ liệu đè nhau.
    queryKey: [...getListCatalogProductsQueryKey(params), 'infinite'],
    queryFn: ({ pageParam, signal }) =>
      listCatalogProducts({ ...params, page: pageParam }, undefined, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    initialData,
    initialDataUpdatedAt: initialData ? options.initialPageFetchedAt : undefined,
    // Khối sản phẩm trên trang chủ/danh mục: khách đi qua lại liên tục giữa danh sách và chi tiết.
    // Giá hiển thị ở đây không phải giá chốt — bước báo giá checkout luôn tính lại.
    enabled: isMounted,
    ...CACHE_POLICY.CATALOG,
  });

  const pages = query.data?.pages;
  const products = useMemo(() => toProductShowcaseItems(pages ?? []), [pages]);
  const total = pages?.[pages.length - 1]?.meta.total ?? 0;

  return {
    products,
    total,
    hasMore: query.hasNextPage,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
    },
    isPending: query.isPending,
    // Đang lấy thêm thì giữ nguyên danh sách hiện có, chỉ báo bận ở nút.
    isLoadingMore: query.isFetchingNextPage,
    isLoadMoreError: query.isFetchNextPageError,
    isError: query.isError && products.length === 0,
    refetch: () => void query.refetch(),
  };
}
