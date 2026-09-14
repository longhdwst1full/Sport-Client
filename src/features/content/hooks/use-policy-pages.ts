'use client';

import { useMemo } from 'react';
import { useListPublishedPosts } from '@/generated/api/content/content';
import { toContentPostView, type ContentPostView } from '../model/content-post.mapper';

/** Trang chính sách (bảo hành, đổi trả, vận chuyển…) lấy riêng bằng bộ lọc của API. */
export function usePolicyPages(): {
  policies: ContentPostView[];
  isPending: boolean;
  isError: boolean;
} {
  const query = useListPublishedPosts({ postType: 'POLICY' });
  const policies = useMemo(
    () => (query.data?.items ?? []).map(toContentPostView),
    [query.data?.items],
  );

  return { policies, isPending: query.isPending, isError: query.isError };
}
