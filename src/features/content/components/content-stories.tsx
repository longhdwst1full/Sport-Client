'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useContentStories } from '../hooks/use-content-stories';

export function ContentStories() {
  const { stories, isPending, isError } = useContentStories();
  if (isPending) return <div className="h-72 animate-pulse rounded-[32px] bg-white" />;
  if (isError)
    return <div className="rounded-[32px] bg-red-50 p-8 text-red-700">Không thể tải bài viết.</div>;
  if (!stories.length) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {stories.map((post) => (
        <article
          key={post.id}
          className="group grid overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl md:grid-cols-[.9fr_1.1fr]"
        >
          <div className="relative min-h-64 overflow-hidden bg-slate-900">
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-between p-6 sm:p-7">
            <div>
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.18em] text-emerald-700">
                {post.typeLabel}
              </span>
              <h3 className="mt-3 text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                {post.title}
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-3">
                {post.excerpt}
              </p>
            </div>
            <Link
              href={`/news/${post.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              Đọc bài viết <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
