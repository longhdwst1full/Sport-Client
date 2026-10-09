'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Breadcrumb } from '@/foundation/components/navigation';
import { Button } from '@/foundation/components/buttons';
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
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full overflow-hidden rounded-full border border-neutral-300 bg-neutral-50/80 hover:bg-white focus-within:border-neutral-800 focus-within:bg-white focus-within:ring-4 focus-within:ring-neutral-900/10 shadow-2xs"
    >
      <Search className="ml-4 size-4 shrink-0 text-neutral-400" aria-hidden="true" />
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Tìm thiết bị tập luyện khác..."
        className="w-full border-0 border-none bg-transparent px-3 py-2 text-sm font-medium text-neutral-800 outline-none ring-0 placeholder:text-neutral-500 focus:border-0 focus:outline-none focus:ring-0 sm:py-2.5"
        aria-label="Tìm kiếm sản phẩm"
      />
      {val && (
        <button
          type="button"
          onClick={() => setVal('')}
          className="mr-1 grid size-7 shrink-0 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-200/60 hover:text-neutral-700"
          aria-label="Xóa từ khóa"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
      <Button
        type="submit"
        variant="primary"
        size="sm"
        className="my-1 mr-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-bold tracking-tight shadow-md sm:px-5"
      >
        <span>Tìm</span>
      </Button>
    </form>
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
