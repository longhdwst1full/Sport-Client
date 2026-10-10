'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Breadcrumb } from '@/foundation/components/navigation';
import { Search } from 'lucide-react';
import { SearchBox } from '@/foundation/components/field-system';
import { Skeleton } from '@/foundation/components/feedback';
import { ProductShowcase } from '../components/product-showcase';
import { ProductCardSkeleton } from '../components/product-card';

/** Form tìm kiếm nội bộ trang kết quả: đồng bộ với từ khoá hiện tại, bấm Tìm là đổi kết quả ngay. */
function InPageSearchForm({ currentQuery }: { currentQuery: string }) {
  const router = useRouter();
  const [val, setVal] = useState(currentQuery);

  useEffect(() => {
    setVal(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = val.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <SearchBox
      value={val}
      onValueChange={setVal}
      onSubmit={handleSubmit}
      placeholder="Tìm thiết bị tập luyện khác..."
      submitLabel="Tìm"
      submitIcon={false}
      className="w-full hover:border-neutral-300"
      iconClassName="group-focus-within:text-neutral-400"
    />
  );
}

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

        <div className="surface-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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

            {/* Quick in-page Search Refinement without duplicate popover collisions */}
            <div className="w-full md:max-w-md">
              <InPageSearchForm currentQuery={query} />
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
