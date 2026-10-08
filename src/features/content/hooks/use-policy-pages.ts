'use client';

import { useMemo } from 'react';
import { useIsMounted } from '@/shared/hooks';
import { useListPublishedPosts } from '@/generated/api/content/content';
import { toContentPostView, type ContentPostView } from '../model/content-post.mapper';
import { CACHE_POLICY } from '@/lib/query/query-cache-policy';

/** Trang chính sách (bảo hành, đổi trả, vận chuyển…) lấy riêng bằng bộ lọc của API. */
export function usePolicyPages(): {
  policies: ContentPostView[];
  isPending: boolean;
  isError: boolean;
} {
  const isMounted = useIsMounted();

  const query = useListPublishedPosts(
    { postType: 'POLICY' },
    // Trang chính sách gần như không đổi và nằm ở footer nên có mặt trên mọi trang.
    { query: { enabled: isMounted, ...CACHE_POLICY.LOOKUP } },
  );
  const policies = useMemo(
    () => (query.data?.items ?? []).map(toContentPostView),
    [query.data?.items],
  );

  return { policies, isPending: query.isPending, isError: query.isError };
}
