'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ProductShowcase } from '@/features/catalog/components/product-showcase';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="bg-stone-50/60 pb-20 pt-8">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-xs font-semibold text-stone-500">
          <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="font-bold text-ink">Kết quả tìm kiếm</span>
        </nav>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Search className="size-6" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Tìm kiếm sản phẩm
              </span>
              <h1 className="text-2xl font-black text-ink sm:text-3xl">
                {query ? (
                  <>
                    Kết quả cho từ khóa: <span className="text-emerald-700">"{query}"</span>
                  </>
                ) : (
                  'Tất cả sản phẩm thể thao'
                )}
              </h1>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <ProductShowcase />
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <StorefrontLayout>
      <Suspense fallback={<div className="min-h-screen bg-stone-50 p-20 text-center">Đang tải kết quả tìm kiếm…</div>}>
        <SearchContent />
      </Suspense>
    </StorefrontLayout>
  );
}
