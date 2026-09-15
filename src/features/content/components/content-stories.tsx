'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Calendar,
  Sparkles,
  BookOpen,
  ChevronRight,
  User,
  Eye,
} from 'lucide-react';
import { useContentStories } from '../hooks/use-content-stories';
import { STORE_CONFIG } from '@/shared/constants';
import { Skeleton, SkeletonText } from '@/foundation/components/feedback';
import { CONTENT_POST_TYPE_LABELS } from '../model/content-post.mapper';

const ALL_CATEGORY = 'ALL';

/** Số bài hiện sẵn ở trang chủ. Hai cột nên 4 bài vừa đúng hai hàng. */
const FEATURED_COUNT = 4;

export function ContentStories() {
  const { stories: allArticles, isPending } = useContentStories();
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

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCat(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeCat === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat === ALL_CATEGORY ? 'Tất cả' : (CONTENT_POST_TYPE_LABELS[cat] ?? cat)}
            </button>
          ))}
        </div>

        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:underline"
        >
          <span>Xem tất cả bài viết ({allArticles.length})</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Grid of Articles */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {visibleArticles.map((post) => (
          <article
            key={post.id}
            className="group grid overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl md:grid-cols-[1fr_1.2fr]"
          >
            {/* Image Thumbnail */}
            <div className="relative min-h-[220px] overflow-hidden bg-slate-100 sm:min-h-[240px]">
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3 rounded-full bg-slate-900/85 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                {post.categoryLabel}
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                {/* Meta info: date, reading time */}
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {post.publishedLabel}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {post.readTimeLabel}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-2.5 text-base font-black leading-snug text-slate-900 transition line-clamp-2 group-hover:text-emerald-700 sm:text-lg">
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </h3>

                {/* Excerpt */}
                <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Author & Read More Link */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                    B
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Bảo An Sport</span>
                    <span className="block text-[10px] text-slate-400">Ban chuyên môn</span>
                  </div>
                </div>

                <Link
                  href={`/news/${post.slug}`}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
                >
                  <span>Chi tiết</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            <span>Xem thêm {hiddenCount} bài</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}

      {expanded && displayedArticles.length > FEATURED_COUNT && (
        <div className="mt-6 flex justify-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:underline"
          >
            <span>Đọc toàn bộ chuyên mục tin tức</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
