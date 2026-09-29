'use client';

import { useEffect, useMemo, useState } from 'react';
import { useListPublishedPosts } from '@/generated/api/content/content';
import { CACHE_POLICY } from '@/lib/query/query-cache-policy';
import {
  POLICY_POST_TYPE,
  toContentPostView,
  type ContentPostView,
} from '../model/content-post.mapper';

/** Số bài mỗi lượt tải cho trang danh sách tin tức; khớp lưới 3 cột x vài hàng. */
const NEWS_PAGE_SIZE = 12;

/**
 * Trang `/news` dùng "Xem thêm" thay vì tải hết một lần: contract phân trang (`page`/`limit`)
 * nên client gom dần theo trang, dừng khi `meta.hasMore` là false.
 */
export function usePaginatedContentPosts(): {
  posts: ContentPostView[];
  isPending: boolean;
  isError: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
} {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<ContentPostView[]>([]);

  const query = useListPublishedPosts(
    { page, limit: NEWS_PAGE_SIZE },
    { query: { enabled: isMounted, ...CACHE_POLICY.LOOKUP } },
  );

  useEffect(() => {
    if (!query.data) return;
    const mapped = query.data.items
      .filter((post) => post.postType !== POLICY_POST_TYPE)
      .map(toContentPostView);
    setAccumulated((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
  }, [query.data, page]);

  const hasMore = query.data?.meta.hasMore ?? false;

  const posts = useMemo(() => accumulated, [accumulated]);

  return {
    posts,
    isPending: query.isPending,
    isError: query.isError,
    hasMore,
    isLoadingMore: query.isFetching && page > 1,
    loadMore: () => setPage((current) => current + 1),
  };
}
