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
import { Skeleton } from '@/foundation/components/feedback';
import { CONTENT_POST_TYPE_LABELS, type ContentPostView } from '../model/content-post.mapper';

const ALL_CATEGORY = 'ALL';

/** Số bài hiện sẵn ở trang chủ. Hai cột nên 4 bài vừa đúng hai hàng. */
const FEATURED_COUNT = 4;

export function ContentStories({ initialPosts = [] }: { initialPosts?: ContentPostView[] }) {
  // Server (trang chủ, cùng chu kỳ ISR) đã gửi sẵn bài viết thì dùng luôn; chỉ tự tải khi không có.
  const { stories: fetchedArticles, isPending } = useContentStories({ enabled: initialPosts.length === 0 });
  const allArticles = fetchedArticles.length > 0 ? fetchedArticles : initialPosts;
  const [activeCat, setActiveCat] = useState<string>(ALL_CATEGORY);
  const [expanded, setExpanded] = useState(false);

  // Bộ lọc dựng từ loại bài thật đang có, không phải danh sách cố định.
  const categories = useMemo(
    () => [ALL_CATEGORY, ...new Set(allArticles.map((article) => article.postType))],
    [allArticles],
  );

  const displayedArticles = useMemo(() => {
    if (activeCat === ALL_CATEGORY) return allArticles;
    return allArticles.filter((article) => article.postType === activeCat);
  }, [allArticles, activeCat]);

  // Trang chủ chỉ giới thiệu vài bài; đọc hết thì sang trang tin tức.
  const visibleArticles = expanded
    ? displayedArticles
    : displayedArticles.slice(0, FEATURED_COUNT);
  const hiddenCount = displayedArticles.length - visibleArticles.length;

  if (isPending && allArticles.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="grid overflow-hidden rounded-[28px] border border-slate-200/90 bg-white md:grid-cols-[1fr_1.2fr]">
            <Skeleton className="aspect-[16/9] bg-slate-100 md:aspect-auto md:min-h-[220px]" />
            <div className="space-y-3 p-5 sm:p-6">
              <Skeleton className="h-4 w-24 bg-slate-100" />
              <Skeleton className="h-6 w-3/4 bg-slate-100" />
              <Skeleton className="h-12 w-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Không có bài viết thì ẩn hẳn khối, không hiển thị thanh lọc rỗng hay nhãn (0)
  if (allArticles.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCat === cat ? 'primary' : 'outline'}
              onClick={() => setActiveCat(cat)}
              aria-pressed={activeCat === cat}
              className={`text-xs font-bold ${
                activeCat === cat
                  ? 'bg-slate-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {cat === ALL_CATEGORY ? 'Tất cả' : (CONTENT_POST_TYPE_LABELS[cat] ?? cat)}
            </Button>
          ))}
        </div>

        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <span>Xem tất cả bài viết</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Grid of Articles */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {visibleArticles.map((post) => (
          <article
            key={post.id}
            className="group grid overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-900/40 hover:shadow-xl md:grid-cols-[1fr_1.2fr]"
          >
            {/* Image Thumbnail */}
            {/* Ảnh mobile theo tỷ lệ 16:9 (không còn khối 220px cao); ảnh thiếu/lỗi do `CoverImage` thay bằng placeholder. */}
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-50 md:aspect-auto md:min-h-[220px]">
              <CoverImage
                src={post.coverUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-300 backdrop-blur-md">
                {post.categoryLabel}
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-col justify-between p-5 sm:p-6">
              <div>
                {/* Meta info: date, reading time */}
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" aria-hidden="true" />
                    {post.publishedLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" aria-hidden="true" />
                    {post.readTimeLabel}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-2.5 text-base font-black leading-snug text-slate-900 transition line-clamp-2 group-hover:text-slate-900 sm:text-lg">
                  <Link href={`/news/${post.slug}`} className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2">
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Bỏ dòng tác giả lặp "Bảo An Sport / Ban chuyên môn" ở mọi thẻ: API không có tác giả thật. */}
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/news/${post.slug}`}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                  aria-label={`Đọc chi tiết: ${post.title}`}
                >
                  <span>Chi tiết</span>
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => setExpanded(true)} className="rounded-full px-6">
            <span>Xem thêm</span>
            <ChevronDown className="size-4" aria-hidden="true" />
          </Button>
        </div>
      )}

      {expanded && displayedArticles.length > FEATURED_COUNT && (
        <div className="mt-6 flex justify-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            <span>Đọc toàn bộ chuyên mục tin tức</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
