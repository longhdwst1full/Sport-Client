'use client';

import { useEffect, useState } from 'react';
import { useListPublishedPosts } from '@/generated/api/content/content';
import { CACHE_POLICY } from '@/lib/query/query-cache-policy';
import {
  NEWS_PAGE_SIZE,
  toNewsPostViews,
  type ContentPostView,
} from '../model/content-post.mapper';

/**
 * Trang `/news` dùng "Xem thêm" thay vì tải hết một lần: contract phân trang (`page`/`limit`)
 * nên client gom dần theo trang, dừng khi `meta.hasMore` là false.
 *
 * Server đã render trang 1 (`initialPosts`) thì client không gọi lại trang 1, chỉ tải từ trang 2
 * khi khách bấm "Xem thêm". Server lỗi (`initialPosts` undefined) thì client tự tải trang 1.
 */
export function usePaginatedContentPosts({
  initialPosts,
  initialHasMore = false,
}: { initialPosts?: ContentPostView[]; initialHasMore?: boolean } = {}): {
  posts: ContentPostView[];
  isPending: boolean;
  isError: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  /** Gọi lại đúng trang vừa lỗi (không nhảy sang trang kế). */
  retry: () => void;
} {
  const hasInitial = initialPosts !== undefined;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<ContentPostView[]>(initialPosts ?? []);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const query = useListPublishedPosts(
    { page, limit: NEWS_PAGE_SIZE },
    { query: { enabled: isMounted && (!hasInitial || page > 1), ...CACHE_POLICY.LOOKUP } },
  );

  useEffect(() => {
    if (!query.data) return;
    const mapped = toNewsPostViews(query.data.items);
    setAccumulated((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
    setHasMore(query.data.meta.hasMore);
  }, [query.data, page]);

  return {
    posts: accumulated,
    // Có dữ liệu server thì trang 1 không bao giờ ở trạng thái "đang tải lần đầu".
    isPending: !hasInitial && query.isPending,
    isError: query.isError,
    hasMore,
    isLoadingMore: query.isFetching && page > 1,
    loadMore: () => setPage((current) => current + 1),
    retry: () => void query.refetch(),
  };
}
