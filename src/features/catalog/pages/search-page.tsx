'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Breadcrumb } from '@/foundation/components/navigation';
import { Skeleton } from '@/foundation/components/feedback';
import { ProductShowcase } from '../components/product-showcase';
import { ProductCardSkeleton } from '../components/product-card';
import { AutocompleteSearch } from '@/widgets/site-header/autocomplete-search';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="bg-slate-50/60 pb-20 pt-8">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          className="mb-6"
          items={[{ label: 'Trang chủ', href: '/' }, { label: 'Kết quả tìm kiếm' }]}
        />

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                <Search aria-hidden className="size-6" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tìm kiếm sản phẩm Bảo An Sport
                </span>
                <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
                  {query ? (
                    <>
                      Kết quả cho từ khóa: <span className="text-brand-700">"{query}"</span>
                    </>
                  ) : (
                    'Tất cả sản phẩm thể thao'
                  )}
                </h1>
              </div>
            </div>

            {/* Quick in-page Search Refinement */}
            <div className="w-full md:max-w-md">
              <AutocompleteSearch placeholder="Tìm kiếm từ khóa khác..." />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <ProductShowcase searchQuery={query} />
        </div>
      </main>
    </div>
  );
}

/** Khung chờ trùng bố cục `SearchContent` (thẻ tiêu đề + lưới 4 cột của ProductShowcase). */
function SearchPageSkeleton() {
  return (
    <div className="bg-slate-50/60 pb-20 pt-8" role="status" aria-label="Đang tải kết quả tìm kiếm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-4 w-48 rounded" />
        <Skeleton className="h-32 rounded-3xl" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchPage() {
  return (
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchContent />
      </Suspense>
  );
}
