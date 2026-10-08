'use client';

import { useMemo } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import {
  getListCatalogProductsQueryKey,
  listCatalogProducts,
} from '@/generated/api/catalog/catalog';
import type { ProductListResponseDto, ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import { CACHE_POLICY } from '@/lib/query/query-cache-policy';
import { useIsMounted } from '@/shared/hooks';
import { isSameCatalogFilters, type CatalogListFilters } from '../model/catalog-filter.constants';
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
   * Trang 1 server đã lấy sẵn, để HTML SSR có sản phẩm (SEO) thay vì chỉ có skeleton.
   * Chỉ dùng khi bộ lọc hiện tại trùng `initialPageFilters` và cùng `pageSize` với lượt gọi
   * của server; đổi tab/bộ lọc sau đó sẽ không bao giờ nhận nhầm trang này.
   */
  initialPage?: ProductListResponseDto;
  /** Bộ lọc server dùng khi lấy `initialPage`; bỏ trống = không lọc (trang chủ). */
  initialPageFilters?: CatalogListFilters;
  /** Thời điểm server lấy `initialPage` (ms); cache cũ hơn `staleTime` sẽ được làm mới sau mount. */
  initialPageFetchedAt?: number;
  /** Thứ tự do API sắp trên toàn bộ kết quả; bỏ trống là mới nhất. */
  sort?: ProductListSort;
  /** Khoảng giá (VND, dạng chuỗi số) áp trên `minPrice` ở server; sản phẩm chưa có giá bị loại. */
  minPrice?: string;
  maxPrice?: string;
  /**
   * Đổi bộ lọc/tab thì giữ danh sách cũ (làm mờ) tới khi kết quả mới về, thay vì quay lại
   * skeleton làm nhảy layout (RULE-SKEL-02). Tắt mặc định: khối "liên quan" không nên hiện
   * tạm sản phẩm của danh mục khác.
   */
  keepPreviousResults?: boolean;
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
  /** Đang hiển thị kết quả của bộ lọc trước trong lúc chờ kết quả mới (chỉ khi `keepPreviousResults`). */
  isShowingPreviousResults: boolean;
  refetch: () => void;
} {
  // Lọc danh mục chạy server-side và gồm cả nhánh con. Trước đây hook lấy 8 sản phẩm
  // đầu của toàn catalog rồi lọc ở client, nên trang danh mục chỉ xét được 8 trong 596
  // sản phẩm và gần như luôn ra sai.
  const search = searchQuery?.trim() || undefined;
  const { sort, minPrice, maxPrice } = options;
  const scoped = Boolean(categorySlug || search || sort || minPrice || maxPrice);
  const pageSize = Math.min(
    options.pageSize ?? (scoped ? CATALOG_PAGE_SIZE.SCOPED : CATALOG_PAGE_SIZE.SHOWCASE),
    CATALOG_PAGE_SIZE.MAX,
  );

  const isMounted = useIsMounted();

  // CONTRACT: tải thêm theo `page`, giữ `limit` cố định. Bản trước nới `limit` thêm một
  // trang mỗi lần bấm, nên tới lượt thứ 5 ở trang danh mục (limit 120) API trả 400 và
  // khách không bao giờ xem được phần còn lại.
  // RULE-LIST-03: mọi tham số ảnh hưởng kết quả đều nằm trong `params`, tức trong query key.
  const params = { limit: pageSize, category: categorySlug, search, sort, minPrice, maxPrice };
  const initialData =
    options.initialPage &&
    options.initialPage.meta.limit === pageSize &&
    isSameCatalogFilters(options.initialPageFilters ?? {}, { category: categorySlug, search, sort, minPrice, maxPrice })
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
    placeholderData: options.keepPreviousResults ? keepPreviousData : undefined,
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
    isShowingPreviousResults: query.isPlaceholderData,
    refetch: () => void query.refetch(),
  };
}
