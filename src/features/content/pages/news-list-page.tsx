'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { Breadcrumb } from '@/foundation/components/navigation';
import { Skeleton, SkeletonText } from '@/foundation/components/feedback';
import { useContentStories } from '../hooks/use-content-stories';
import { CONTENT_POST_TYPE_LABELS } from '../model/content-post.mapper';

const ALL_CATEGORY = 'ALL';

export function NewsListPage() {
  const [selectedCat, setSelectedCat] = useState(ALL_CATEGORY);
  const { stories: articles, isPending, isError } = useContentStories();

  // Bộ lọc dựng từ đúng những loại bài đang có, không phải danh sách cố định.
  const categories = [ALL_CATEGORY, ...new Set(articles.map((article) => article.postType))];

  const filtered =
    selectedCat === ALL_CATEGORY
      ? articles
      : articles.filter((article) => article.postType === selectedCat);

  const featured = articles[0];

  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Kiến thức luyện tập & Tin tức' },
            ]}
          />

          {/* Heading */}
          <div className="max-w-2xl">
            <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              Bảo An Sport Journal
            </span>
            <h1 className="mt-3 text-3xl font-black text-ink sm:text-5xl">
              Kiến thức tập luyện & Tin tức thể thao
            </h1>
            <p className="mt-3 text-base text-stone-600 sm:text-lg">
              Tổng hợp bài viết phân tích kỹ thuật, cẩm nang chọn thiết bị tập gym, xe đạp tập, bàn bóng bàn và kinh nghiệm bảo dưỡng từ chuyên gia Bảo An Sport.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  selectedCat === cat
                    ? 'bg-ink text-white shadow-sm'
                    : 'border border-stone-200 bg-white text-stone-600 hover:border-emerald-400 hover:text-emerald-700'
                }`}
              >
                {cat === ALL_CATEGORY ? 'Tất cả' : (CONTENT_POST_TYPE_LABELS[cat] ?? cat)}
              </button>
            ))}
          </div>

          {/* Featured Hero Article */}
          {featured && selectedCat === ALL_CATEGORY && (
            <div className="mt-10 overflow-hidden rounded-[36px] border border-stone-200/80 bg-white shadow-sm transition hover:shadow-lg lg:grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-[320px] lg:min-h-[420px]">
                <Image
                  src={featured.coverUrl}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-8 sm:p-12">
                <div>
                  <div className="flex items-center gap-3 text-xs font-bold text-emerald-700">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 uppercase tracking-wider">
                      {featured.categoryLabel}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-stone-400">
                      <Clock className="size-3.5" /> {featured.readTimeLabel}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black leading-tight text-ink sm:text-3xl">
                    <Link href={`/news/${featured.slug}`} className="hover:text-emerald-700">
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-6">
                  <span className="text-xs font-bold text-stone-500">{featured.publishedLabel}</span>
                  <Link
                    href={`/news/${featured.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-black text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Đọc toàn bộ bài viết</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Articles */}
          {isPending && articles.length === 0 ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="overflow-hidden rounded-[28px] border border-stone-200/80 bg-white shadow-sm">
                  <Skeleton className="aspect-[16/10] rounded-none" />
                  <div className="p-6">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="mt-3 h-5 w-4/5" />
                    <SkeletonText lines={2} className="mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="mt-12 rounded-[28px] border border-dashed border-stone-300 bg-white p-12 text-center">
              <h2 className="text-lg font-black text-ink">Không tải được bài viết</h2>
              <p className="mt-2 text-sm text-stone-500">Vui lòng thử lại sau ít phút.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-12 rounded-[28px] border border-dashed border-stone-300 bg-white p-12 text-center">
              <h2 className="text-lg font-black text-ink">Chưa có bài viết trong mục này</h2>
              <p className="mt-2 text-sm text-stone-500">Nội dung đang được cập nhật.</p>
            </div>
          ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-[28px] border border-stone-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <Image
                    src={item.coverUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur">
                    {item.categoryLabel}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <Calendar className="size-3.5" />
                    <span>{item.publishedLabel}</span>
                    <span>·</span>
                    <Clock className="size-3.5" />
                    <span>{item.readTimeLabel}</span>
                  </div>

                  <h3 className="mt-3 text-lg font-black leading-snug text-ink transition group-hover:text-emerald-700">
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h3>

                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-stone-500">
                    {item.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
                    <span className="text-xs font-bold text-stone-500">Bảo An Sport</span>
                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700"
                    >
                      Chi tiết <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </main>
      </div>
    </StorefrontLayout>
  );
}
