'use client';

import { useState, useMemo } from 'react';
import { CoverImage } from './cover-image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { useContentStories } from '../hooks/use-content-stories';
import { Button } from '@/foundation/components/buttons';
import { ToggleChip } from '@/foundation/components/tabs-chips';
import { ContentStoriesSkeleton } from './content-stories-skeleton';
import { Reveal } from '@/foundation/components/motion';
import { CONTENT_POST_TYPE_LABELS, type ContentPostView, EDITORIAL_POST_TYPES } from '../model/content-post.mapper';

const ALL_CATEGORY = 'ALL';

/** Số bài hiện sẵn ở trang chủ. Hai cột nên 4 bài vừa đúng hai hàng. */
const FEATURED_COUNT = 4;

export function ContentStories({ initialPosts = [] }: { initialPosts?: ContentPostView[] }) {
  // Server (trang chủ, cùng chu kỳ ISR) đã gửi sẵn bài viết thì dùng luôn; chỉ tự tải khi không có.
  const { stories: fetchedArticles, isPending } = useContentStories({ enabled: initialPosts.length === 0 });
  const allArticles = fetchedArticles.length > 0 ? fetchedArticles : initialPosts;
  const [activeCat, setActiveCat] = useState<string>(ALL_CATEGORY);
  const [expanded, setExpanded] = useState(false);

  const categories: string[] = [ALL_CATEGORY, ...EDITORIAL_POST_TYPES];

  const displayedArticles = useMemo(() => {
    if (activeCat === ALL_CATEGORY) return allArticles;
    return allArticles.filter((article) => article.postType === activeCat);
  }, [allArticles, activeCat]);

  // Trang chủ chỉ giới thiệu vài bài; đọc hết thì sang trang tin tức.
  const visibleArticles = expanded
    ? displayedArticles
    : displayedArticles.slice(0, FEATURED_COUNT);
  const hiddenCount = displayedArticles.length - visibleArticles.length;

  if (isPending && allArticles.length === 0) return <ContentStoriesSkeleton />;

  // Không có bài viết thì ẩn hẳn khối, không hiển thị thanh lọc rỗng hay nhãn (0)
  if (allArticles.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <ToggleChip key={cat} selected={activeCat === cat} onClick={() => setActiveCat(cat)}>
              {cat === ALL_CATEGORY ? 'Tất cả' : (CONTENT_POST_TYPE_LABELS[cat] ?? cat)}
            </ToggleChip>
          ))}
        </div>

        <Link
          href="/news"
          className="text-xs font-semibold text-neutral-800 transition-colors hover:text-brand-600 hover:underline rounded focus-ring"
        >
          <span>Xem tất cả</span>
        </Link>
      </div>

      {/* Grid of Articles */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {visibleArticles.map((post, index) => (
          <Reveal
            as="article"
            key={post.id}
            variant={index % 2 === 0 ? 'slide-right' : 'slide-left'}
            durationMs={700}
            stagger={120}
            rootMargin="-60px"
            className="group grid overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-card md:grid-cols-[1fr_1.2fr]"
          >
            {/* Image Thumbnail */}
            <Link
              href={`/news/${post.slug}`}
              className="reveal-media relative aspect-[16/9] overflow-hidden bg-neutral-50 block md:aspect-auto md:min-h-[200px]"
              tabIndex={-1}
              aria-hidden="true"
            >
              <CoverImage
                src={post.coverUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3 rounded-full bg-neutral-900/85 px-2.5 py-1 text-2xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {post.categoryLabel}
              </div>
            </Link>

            {/* Content Details */}
            <div className="flex flex-col justify-between p-5 sm:p-6">
              <div>
                {/* Meta info: date */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Calendar className="size-3.5 text-neutral-400" aria-hidden="true" />
                  <span>{post.publishedLabel}</span>
                </div>

                {/* Title */}
                <h3 className="mt-2 text-base font-bold leading-snug text-neutral-900 transition line-clamp-2 group-hover:text-brand-600 sm:text-lg">
                  <Link href={`/news/${post.slug}`} className="rounded focus-ring">
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="mt-2 text-xs leading-relaxed text-neutral-500 line-clamp-2 sm:line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Action link */}
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/news/${post.slug}`}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-neutral-900 transition hover:text-brand-600 focus-ring"
                  aria-label={`Đọc chi tiết: ${post.title}`}
                >
                  <span>Chi tiết</span>
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="mt-8 flex justify-center">
          <Button variant="secondary" onClick={() => setExpanded(true)} className="rounded-full px-6">
            <span>Xem thêm</span>
            <ChevronDown className="size-4" aria-hidden="true" />
          </Button>
        </div>
      )}

      {expanded && displayedArticles.length > FEATURED_COUNT && (
        <div className="mt-6 flex justify-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:underline rounded focus-ring"
          >
            <span>Đọc toàn bộ chuyên mục tin tức</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
