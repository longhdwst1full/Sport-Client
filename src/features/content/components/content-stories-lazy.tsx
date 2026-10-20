'use client';

import dynamic from 'next/dynamic';
import { ContentStoriesSkeleton } from './content-stories-skeleton';

/**
 * Khối bài viết cuối trang chủ tách chunk riêng (không tính vào First Load JS của `/`). Vẫn SSR với
 * `initialPosts` nên HTML đầu có bài viết; lúc hydrate React giữ HTML server tới khi chunk về.
 */
export const ContentStoriesLazy = dynamic(
  () => import('./content-stories').then((module) => module.ContentStories),
  { loading: ContentStoriesSkeleton },
);
