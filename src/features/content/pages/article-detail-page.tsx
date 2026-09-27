import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Clock, Share2 } from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { Breadcrumb } from '@/foundation/components/navigation';
import type { ArticleDetailView, ContentPostView } from '../model/content-post.mapper';
import { ArticleReadingProgress } from '../components/article-reading-progress';
import { ArticleTableOfContents, extractTocHeadings } from '../components/article-table-of-contents';
import { ArticleConsultationCta } from '../components/article-consultation-cta';
import { ArticleRelatedPosts } from '../components/article-related-posts';

export function ArticleDetailPage({
  article,
  related,
}: {
  article: ArticleDetailView;
  related: ContentPostView[];
}) {
  const tocHeadings = extractTocHeadings(article.blocks);

  return (
    <StorefrontLayout>
      {/* Scroll Reading Progress Bar */}
      <ArticleReadingProgress />

      <div className="bg-slate-50/70 pb-20 pt-8">
        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Cẩm nang & Tin tức', href: '/news' },
              { label: article.title },
            ]}
          />

          <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-10 lg:p-12">
            {/* Meta Tags & Category Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-600/20">
                  {article.categoryLabel}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <CalendarDays className="size-3.5 text-slate-400" />
                  {article.publishedLabel}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="size-3.5 text-slate-400" />
                  {article.readTimeLabel}
                </span>
              </div>
            </div>

            {/* Main Editorial Title */}
            <h1 className="mt-6 text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight text-slate-900">
              {article.title}
            </h1>

            {/* Lead Excerpt Callout */}
            {article.excerpt && (
              <div className="mt-6 rounded-2xl border-l-4 border-emerald-500 bg-emerald-50/50 p-4 sm:p-5 text-base sm:text-lg leading-relaxed font-medium text-slate-700">
                {article.excerpt}
              </div>
            )}

            {/* Cover Image */}
            {article.hasCover && (
              <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 shadow-xs">
                <Image
                  src={article.coverUrl}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 860px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Table of Contents */}
            <ArticleTableOfContents headings={tocHeadings} />

            {/* Article Body Blocks */}
            <div className="mt-8 text-base leading-8 text-slate-700">
              {article.blocks.map((block, index) => {
                if (block.kind === 'heading') {
                  const headingId = `heading-${index}-${encodeURIComponent(
                    block.text.slice(0, 24).replace(/\s+/g, '-').toLowerCase(),
                  )}`;

                  return block.level === 2 ? (
                    <h2
                      key={index}
                      id={headingId}
                      className="mt-10 scroll-mt-28 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-2"
                    >
                      {block.text}
                    </h2>
                  ) : (
                    <h3
                      key={index}
                      id={headingId}
                      className="mt-8 scroll-mt-28 text-lg sm:text-xl font-bold text-slate-900"
                    >
                      {block.text}
                    </h3>
                  );
                }

                if (block.kind === 'bullet') {
                  return (
                    <p key={index} className="mt-2.5 flex items-start gap-2.5 pl-1 leading-relaxed">
                      <span
                        aria-hidden
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-emerald-600"
                      />
                      <span>{block.text}</span>
                    </p>
                  );
                }

                return (
                  <p key={index} className="mt-4 leading-relaxed text-slate-700">
                    {block.text}
                  </p>
                );
              })}
            </div>

            {/* Consultation CTA Banner */}
            <ArticleConsultationCta />

            {/* Bottom Actions */}
            <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <ArrowLeft className="size-4" />
                <span>Xem tất cả bài viết</span>
              </Link>
            </div>
          </article>

          {/* Related Articles Carousel / Grid */}
          <ArticleRelatedPosts related={related} />
        </main>
      </div>
    </StorefrontLayout>
  );
}
