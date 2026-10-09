import React from 'react';
import { CoverImage } from './cover-image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock } from 'lucide-react';
import type { ContentPostView } from '../model/content-post.mapper';

export function ArticleRelatedPosts({ related }: { related: ContentPostView[] }) {
  if (!related || related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-neutral-200/80 pt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
            Khám phá thêm
          </span>
          <h2 className="mt-1 text-xl sm:text-2xl font-black text-neutral-900">
            Bài viết cùng chủ đề
          </h2>
        </div>
        <Link
          href="/news"
          className="inline-flex min-h-11 items-center gap-1.5 rounded text-xs font-bold text-neutral-600 hover:text-neutral-900 transition focus-ring"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.slice(0, 3).map((item) => (
          <article
            key={item.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900/40 hover:shadow-lg"
          >
            <Link
              href={`/news/${item.slug}`}
              className="relative aspect-[16/10] overflow-hidden bg-neutral-100 block"
              // Trùng đích với link tiêu đề bên dưới: bỏ khỏi thứ tự Tab và cây trợ năng.
              tabIndex={-1}
              aria-hidden="true"
            >
              {item.coverUrl ? (
                <CoverImage
                  src={item.coverUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 380px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="grid size-full place-items-center bg-neutral-100 text-neutral-300 text-xs">
                  <span className="font-bold tracking-widest uppercase text-2xs">Bảo An Sport</span>
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-black uppercase text-neutral-950 shadow-2xs backdrop-blur-xs">
                {item.categoryLabel}
              </span>
            </Link>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3" aria-hidden="true" />
                  {item.publishedLabel}
                </span>
                {item.readTimeLabel && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" aria-hidden="true" />
                      {item.readTimeLabel}
                    </span>
                  </>
                )}
              </div>

              <h3 className="mt-2 text-sm font-bold text-neutral-900 group-hover:text-neutral-900 transition line-clamp-2 leading-snug">
                <Link href={`/news/${item.slug}`} className="rounded focus-ring">
                  {item.title}
                </Link>
              </h3>

              <p className="mt-2 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                {item.excerpt}
              </p>

              <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center gap-1 text-xs font-bold text-neutral-900">
                <span>Đọc bài viết</span>
                <ArrowRight className="size-3.5 transition group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
