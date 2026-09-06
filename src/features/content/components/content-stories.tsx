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
import { STORE_CONFIG } from '@/constants';
import { MOCK_CURATED_STORIES as CURATED_STORIES, StoryArticle } from '@/shared/data/mocks';

export function ContentStories() {
  const { stories } = useContentStories();
  const [activeCat, setActiveCat] = useState<string>('Tất cả');

  // Merge API stories with rich curated fallback
  const allArticles: StoryArticle[] = useMemo(() => {
    if (stories && stories.length > 0) {
      return stories.map((s, idx) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        category: s.typeLabel || 'Kiến thức thể thao',
        coverUrl: s.coverUrl || CURATED_STORIES[idx % CURATED_STORIES.length].coverUrl,
        date: '05/09/2026',
        readTime: '6 phút',
        author: 'Ban Chuyên Môn Bảo An Sport',
        authorRole: 'Chuyên gia thiết bị',
        views: 1200 + idx * 150,
      }));
    }
    return CURATED_STORIES;
  }, [stories]);

  const categories = ['Tất cả', 'Tư vấn thiết bị', 'Hướng dẫn tập luyện', 'Không gian Home Gym'];

  const displayedArticles = useMemo(() => {
    if (activeCat === 'Tất cả') return allArticles;
    return allArticles.filter((a) => a.category.toLowerCase().includes(activeCat.toLowerCase()));
  }, [allArticles, activeCat]);

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
              {cat}
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
        {displayedArticles.map((post) => (
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
                {post.category}
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                {/* Meta info: date, reading time */}
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {post.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {post.readTime}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="size-3" />
                    {post.views} lượt xem
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
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">{post.author}</span>
                    <span className="block text-[10px] text-slate-400">{post.authorRole}</span>
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
    </div>
  );
}
