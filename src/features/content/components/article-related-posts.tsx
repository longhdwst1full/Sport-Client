'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock } from 'lucide-react';
import type { ContentPostView } from '../model/content-post.mapper';

export function ArticleRelatedPosts({ related }: { related: ContentPostView[] }) {
  if (!related || related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-slate-200/80 pt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
            Khám phá thêm
          </span>
          <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
            Bài viết cùng chủ đề
          </h2>
        </div>
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.slice(0, 3).map((item) => (
          <article
            key={item.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg"
          >
            <Link
              href={`/news/${item.slug}`}
              className="relative aspect-[16/10] overflow-hidden bg-slate-100 block"
            >
              {item.coverUrl ? (
                <Image
                  src={item.coverUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 380px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="grid size-full place-items-center bg-slate-100 text-slate-400 text-xs">
                  Bảo An Sport
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-800 shadow-2xs backdrop-blur-xs">
                {item.categoryLabel}
              </span>
            </Link>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  {item.publishedLabel}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {item.readTimeLabel}
                </span>
              </div>

              <h3 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-2 leading-snug">
                <Link href={`/news/${item.slug}`}>{item.title}</Link>
              </h3>

              <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {item.excerpt}
              </p>

              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Đọc bài viết</span>
                <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
