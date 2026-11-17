'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Breadcrumb } from '@/foundation/components/navigation';
import { Search } from 'lucide-react';
import { Skeleton } from '@/foundation/components/feedback';
import { ProductShowcase } from '../components/product-showcase';
import { ProductCardSkeleton } from '../components/product-card';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="page-shell">
      <main className="page-container">
        <Breadcrumb
          className="mb-6"
          items={[{ label: 'Trang chủ', href: '/' }, { label: 'Kết quả tìm kiếm' }]}
        />

        {/* Tìm lại bằng ô tìm kiếm trên header (desktop + nút tìm trên mobile); không lặp thêm ô thứ hai ở đây. */}
        <div className="surface-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center">
            <div className="flex items-center gap-3.5">
              <span className="grid size-12 place-items-center rounded-2xl bg-neutral-100 text-neutral-700">
                <Search aria-hidden className="size-6 text-red-600" />
              </span>
              <div>
                <span className="eyebrow text-neutral-500">
                  Tìm kiếm sản phẩm Bảo An Sport
                </span>
                <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                  {query ? (
                    <>
                      Kết quả cho: <span className="text-neutral-950">"{query}"</span>
                    </>
                  ) : (
                    'Tất cả sản phẩm thể thao'
                  )}
                </h1>
              </div>
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

/** Khung chờ trùng bố cục SearchContent */
function SearchPageSkeleton() {
  return (
    <div className="page-shell" role="status" aria-label="Đang tải kết quả tìm kiếm">
      <div className="page-container">
        <Skeleton className="mb-6 h-4 w-48 rounded" />
        <Skeleton className="h-24 rounded-3xl sm:h-28" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }, (_, i) => (
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
