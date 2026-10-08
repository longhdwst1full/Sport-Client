'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, ChevronRight, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { EmptyState, Skeleton, SkeletonText } from '@/foundation/components/feedback';
import { CoverImage } from './cover-image';
import { usePaginatedContentPosts } from '../hooks/use-paginated-content-posts';
import { CONTENT_POST_TYPE_LABELS, type ContentPostView } from '../model/content-post.mapper';

const ALL_CATEGORY = 'ALL';
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2';

/**
 * Island client của `/news`: bộ lọc loại bài + "Xem thêm". Trang 1 do server render và truyền vào
 * (`initialPosts`), nên HTML SSR đã có đủ bài viết cho SEO; client chỉ tải từ trang 2.
 */
export function NewsListFeed({
  initialPosts,
  initialHasMore,
}: {
  initialPosts?: ContentPostView[];
  initialHasMore?: boolean;
}) {
  const [selectedCat, setSelectedCat] = useState(ALL_CATEGORY);
  const { posts: articles, isPending, isError, hasMore, isLoadingMore, loadMore, retry } =
    usePaginatedContentPosts({ initialPosts, initialHasMore });

  // Bộ lọc dựng từ đúng những loại bài đang có, không phải danh sách cố định.
  const categories = [ALL_CATEGORY, ...new Set(articles.map((article) => article.postType))];

  const filtered =
    selectedCat === ALL_CATEGORY
      ? articles
      : articles.filter((article) => article.postType === selectedCat);

  const featured = selectedCat === ALL_CATEGORY ? articles[0] : undefined;
  // Bài nổi bật đã hiện to ở trên thì lưới không lặp lại nó.
  const gridItems = featured ? filtered.slice(1) : filtered;

  return (
    <>
      {/* Category Filter Pills */}
      {categories.length > 2 && (
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Lọc theo loại bài viết">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCat === cat ? 'secondary' : 'outline'}
              onClick={() => setSelectedCat(cat)}
              aria-pressed={selectedCat === cat}
              className={`rounded-full px-5 text-xs font-bold ${FOCUS_RING} ${
                selectedCat === cat ? 'bg-slate-900 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {cat === ALL_CATEGORY ? 'Tất cả' : (CONTENT_POST_TYPE_LABELS[cat] ?? cat)}
            </Button>
          ))}
        </div>
      )}

      {/* Featured Hero Article */}
      {featured && (
        <article className="mt-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-lg lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:rounded-[36px]">
          <div className="relative aspect-[16/10] bg-slate-100 lg:aspect-auto lg:min-h-[420px]">
            <CoverImage
              src={featured.coverUrl}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-900">
                <span className="rounded-full bg-slate-50 px-2.5 py-0.5 uppercase tracking-wider">
                  {featured.categoryLabel}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="size-3.5" aria-hidden="true" /> {featured.readTimeLabel}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black leading-tight text-ink sm:text-3xl">
                <Link href={`/news/${featured.slug}`} className={`rounded hover:text-slate-900 ${FOCUS_RING}`}>
                  {featured.title}
                </Link>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                {featured.excerpt}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
              <span className="text-xs font-bold text-slate-500">{featured.publishedLabel}</span>
              <Link
                href={`/news/${featured.slug}`}
                className={`inline-flex min-h-11 items-center gap-2 rounded text-sm font-black text-slate-900 hover:text-slate-950 ${FOCUS_RING}`}
              >
                <span>Đọc toàn bộ bài viết</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Grid of Articles */}
      <h2 className="sr-only">Danh sách bài viết</h2>
      {isPending && articles.length === 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
              <Skeleton className="aspect-[16/10] rounded-none" />
              <div className="p-6">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="mt-3 h-5 w-4/5" />
                <SkeletonText lines={2} className="mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : isError && articles.length === 0 ? (
        <div role="alert" className="mt-12 rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
          <h3 className="text-lg font-black text-ink">Không tải được bài viết</h3>
          <p className="mt-2 text-sm text-slate-500">Vui lòng thử lại sau ít phút.</p>
          <Button variant="primary" onClick={retry} className={`mt-6 rounded-full px-6 font-bold ${FOCUS_RING}`}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Thử lại
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          className="mt-12 rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12"
          titleAs="h3"
          titleClassName="text-lg font-black text-ink"
          title="Chưa có bài viết trong mục này"
          descriptionClassName="mt-2 text-sm text-slate-500"
          description="Nội dung đang được cập nhật."
        />
      ) : gridItems.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {gridItems.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <CoverImage
                  src={item.coverUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
                  {item.categoryLabel}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="size-3.5" aria-hidden="true" />
                  <span>{item.publishedLabel}</span>
                  <span aria-hidden="true">·</span>
                  <Clock className="size-3.5" aria-hidden="true" />
                  <span>{item.readTimeLabel}</span>
                </div>

                <h3 className="mt-3 text-lg font-black leading-snug text-ink transition group-hover:text-slate-900">
                  <Link href={`/news/${item.slug}`} className={`rounded ${FOCUS_RING}`}>
                    {item.title}
                  </Link>
                </h3>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
                  {item.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs font-bold text-slate-500">Bảo An Sport</span>
                  <Link
                    href={`/news/${item.slug}`}
                    aria-label={`Chi tiết: ${item.title}`}
                    className={`inline-flex min-h-11 items-center gap-1 rounded px-1 text-xs font-bold text-slate-900 ${FOCUS_RING}`}
                  >
                    Chi tiết <ChevronRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {/* Lỗi khi tải thêm: giữ các bài đã có, cho thử lại đúng trang đó. */}
      {isError && articles.length > 0 && (
        <p role="alert" className="mt-8 text-center text-sm text-slate-600">
          Không tải được thêm bài viết.{' '}
          <Button variant="link" onClick={retry} className={`min-h-11 rounded font-bold underline ${FOCUS_RING}`}>
            Thử lại
          </Button>
        </p>
      )}

      {/* Xem thêm: chỉ áp dụng khi xem "Tất cả" vì phân trang lấy theo trang từ API,
          không lọc theo loại bài — lọc theo danh mục vẫn chạy trên các bài đã tải. */}
      {!isPending && !isError && selectedCat === ALL_CATEGORY && hasMore && (
        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoadingMore}
            className={`rounded-full border-slate-200 px-8 font-bold text-slate-700 shadow-sm hover:border-slate-400 disabled:opacity-60 ${FOCUS_RING}`}
          >
            {isLoadingMore ? 'Đang tải…' : 'Xem thêm'}
          </Button>
        </div>
      )}
    </>
  );
}
