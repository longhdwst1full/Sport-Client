'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SkeletonText } from '@/foundation/components/feedback';
import { preloadOnIdle } from '@/shared/hooks';
import type { PolicyArticleRef } from './policy-articles-body';

// SDK content, mapper và thân bài chỉ tải khi trình duyệt rảnh (hoặc khi mở modal), không nằm trong
// bundle đầu trang checkout.
const loadBody = () => import('./policy-articles-body');
const PolicyArticlesBody = dynamic(() => loadBody().then((mod) => mod.PolicyArticlesBody), {
  ssr: false,
  loading: () => (
    <div aria-busy="true">
      <SkeletonText lines={8} />
    </div>
  ),
});

/**
 * Nội dung các bài chính sách để route ghép vào modal của feature khác (vd. modal đồng ý điều khoản ở
 * checkout — `checkout` không import `content`).
 */
export function PolicyArticles({ policies }: { policies: readonly PolicyArticleRef[] }) {
  useEffect(() => preloadOnIdle(loadBody), []);
  return <PolicyArticlesBody policies={policies} />;
}

export type { PolicyArticleRef };
