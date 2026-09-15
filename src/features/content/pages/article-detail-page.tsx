import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { Breadcrumb } from '@/foundation/components/navigation';
import type { ArticleDetailView, ContentPostView } from '../model/content-post.mapper';

export function ArticleDetailPage({
  article,
  related,
}: {
  article: ArticleDetailView;
  related: ContentPostView[];
}) {
  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Tin tức', href: '/news' },
              { label: article.title },
            ]}
          />

          <article className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-10">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <span className="rounded-full bg-emerald-100 px-3 py-1 uppercase tracking-wider text-emerald-800">
                {article.categoryLabel}
              </span>
              <span className="flex items-center gap-1 text-stone-400">
                <CalendarDays className="size-3.5" /> {article.publishedLabel}
              </span>
              <span className="flex items-center gap-1 text-stone-400">
                <Clock className="size-3.5" /> {article.readTimeLabel}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight text-ink sm:text-4xl">
              {article.title}
            </h1>

            <p className="mt-5 border-l-4 border-emerald-500 pl-4 text-lg leading-relaxed text-stone-600">
              {article.excerpt}
            </p>

            {article.hasCover && (
              <div className="relative my-9 aspect-[16/9] overflow-hidden rounded-2xl bg-stone-100">
                <Image
                  src={article.coverUrl}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="mt-8 text-base leading-8 text-stone-700">
              {article.blocks.map((block, index) => {
                if (block.kind === 'heading') {
                  return block.level === 2 ? (
                    <h2 key={index} className="mt-8 text-2xl font-bold text-ink">
                      {block.text}
                    </h2>
                  ) : (
                    <h3 key={index} className="mt-6 text-xl font-bold text-ink">
                      {block.text}
                    </h3>
                  );
                }
                if (block.kind === 'bullet') {
                  return (
                    <p key={index} className="mt-2 flex gap-2 pl-1">
                      <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                      <span>{block.text}</span>
                    </p>
                  );
                }
                return (
                  <p key={index} className="mt-4">
                    {block.text}
                  </p>
                );
              })}
            </div>

            <div className="mt-12 border-t border-stone-100 pt-6">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-5 py-2.5 text-xs font-bold text-ink transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <ArrowLeft className="size-4" /> Xem bài viết khác
              </Link>
            </div>
          </article>

          {related.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                Bài viết liên quan
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="flex h-full flex-col gap-1 rounded-xl border border-stone-200/80 bg-white px-4 py-3 transition hover:border-emerald-300"
                    >
                      <span className="text-xs font-bold text-emerald-700">
                        {item.categoryLabel}
                      </span>
                      <span className="text-sm font-semibold text-ink">{item.title}</span>
                      <span className="mt-auto flex items-center gap-1 pt-2 text-xs text-stone-400">
                        {item.publishedLabel} <ArrowRight className="size-3" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </StorefrontLayout>
  );
}
