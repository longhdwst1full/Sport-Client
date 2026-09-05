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
import { useContentStories } from '@/features/content/hooks/use-content-stories';

const CATEGORIES = [
  'Tất cả',
  'Hướng dẫn tập luyện',
  'Tư vấn thiết bị',
  'Dinh dưỡng & Phục hồi',
  'Không gian Home Gym',
];

const FALLBACK_ARTICLES = [
  {
    id: '1',
    slug: 'huong-dan-chon-ta-tay-home-gym',
    title: 'Cách chọn bộ tạ tay đa năng tối ưu cho diện tích nhà phố',
    excerpt: 'Phân tích chi tiết ưu nhược điểm giữa tạ điều chỉnh thông minh Quick-Lock và tạ đĩa truyền thống khi tập tại nhà.',
    category: 'Tư vấn thiết bị',
    coverUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
    date: '04/09/2026',
    readTime: '6 phút đọc',
    author: 'HLV Minh Tuấn',
  },
  {
    id: '2',
    slug: '5-sai-lam-khi-chay-bo-tren-may',
    title: '5 sai lầm phổ biến khi tập máy chạy bộ khiến bạn nhanh đau khớp',
    excerpt: 'Tư thế tiếp đất, độ dốc thảm chạy và nhịp tim hi-intensity: Hướng dẫn kỹ thuật chuẩn phòng ngừa chấn thương gối.',
    category: 'Hướng dẫn tập luyện',
    coverUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=85',
    date: '01/09/2026',
    readTime: '8 phút đọc',
    author: 'Bs. Thể thao Hoàng Nam',
  },
  {
    id: '3',
    slug: 'setup-goc-tap-15m2-hoan-hao',
    title: 'Bản vẽ mẫu setup góc tập thể hình 15m² chuẩn Olympic',
    excerpt: 'Tối ưu hóa không gian phòng ngủ hoặc ban công kín: Cách bố trí rack gánh tạ, ghế tập và thảm sàn cao su giảm chấn.',
    category: 'Không gian Home Gym',
    coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
    date: '28/08/2026',
    readTime: '5 phút đọc',
    author: 'KTS. Thể thao DCTD',
  },
  {
    id: '4',
    slug: 'phuc-hoi-co-bap-sau-buoi-tap-nang',
    title: 'Bí quyết phục hồi cơ bắp cấp tốc sau các buổi tập tạ nặng',
    excerpt: 'Tận dụng con lăn bọt Foam Roller, súng massage cơ và dinh dưỡng Protein: Lịch trình 48h vàng hồi phục thể lực.',
    category: 'Dinh dưỡng & Phục hồi',
    coverUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85',
    date: '25/08/2026',
    readTime: '7 phút đọc',
    author: 'HLV Thu Trang',
  },
];

export default function NewsPage() {
  const [selectedCat, setSelectedCat] = useState('Tất cả');
  const { stories } = useContentStories();

  const articles =
    stories && stories.length > 0
      ? stories.map((s, idx) => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          excerpt: s.excerpt,
          category: s.typeLabel,
          coverUrl: s.coverUrl || FALLBACK_ARTICLES[idx % FALLBACK_ARTICLES.length].coverUrl,
          date: '05/09/2026',
          readTime: '5 phút đọc',
          author: 'Ban chuyên môn DCTD',
        }))
      : FALLBACK_ARTICLES;

  const filtered =
    selectedCat === 'Tất cả'
      ? articles
      : articles.filter((a) => a.category.toLowerCase().includes(selectedCat.toLowerCase()));

  const featured = articles[0];

  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs font-semibold text-stone-500">
            <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="font-bold text-ink">Kiến thức luyện tập & Tin tức</span>
          </nav>

          {/* Heading */}
          <div className="max-w-2xl">
            <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              DCTD Training Journal
            </span>
            <h1 className="mt-3 text-3xl font-black text-ink sm:text-5xl">
              Kiến thức tập luyện chuẩn khoa học
            </h1>
            <p className="mt-3 text-base text-stone-600 sm:text-lg">
              Tổng hợp bài viết phân tích kỹ thuật, giáo án xây dựng không gian tập và kinh nghiệm bảo dưỡng thiết bị từ chuyên gia.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
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
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Hero Article */}
          {featured && selectedCat === 'Tất cả' && (
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
                      {featured.category}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-stone-400">
                      <Clock className="size-3.5" /> {featured.readTime}
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
                  <span className="text-xs font-bold text-stone-500">{featured.author}</span>
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
                    {item.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <Calendar className="size-3.5" />
                    <span>{item.date}</span>
                    <span>·</span>
                    <Clock className="size-3.5" />
                    <span>{item.readTime}</span>
                  </div>

                  <h3 className="mt-3 text-lg font-black leading-snug text-ink transition group-hover:text-emerald-700">
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h3>

                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-stone-500">
                    {item.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
                    <span className="text-xs font-bold text-stone-500">{item.author}</span>
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
        </main>
      </div>
    </StorefrontLayout>
  );
}
