import { RotateCcw, Search } from 'lucide-react';
import type { ProductShowcaseItem } from '../../model/product.mapper';
import { ProductCard } from '../product-card';

interface CatalogProductGridProps {
  isPending: boolean;
  isError: boolean;
  refetch: () => unknown;
  displayedProducts: ProductShowcaseItem[];
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onBuyNow: (product: ProductShowcaseItem, e: React.MouseEvent) => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoadMoreError: boolean;
  onLoadMore: () => void;
}

export function CatalogProductGrid({
  isPending,
  isError,
  refetch,
  displayedProducts,
  hasActiveFilters,
  onResetFilters,
  onBuyNow,
  hasMore,
  isLoadingMore,
  isLoadMoreError,
  onLoadMore,
}: CatalogProductGridProps) {
  return (
    <>
      {/* LOADING STATE SKELETON */}
      {isPending && (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Đang tải danh sách sản phẩm"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[24px] border border-slate-100 bg-white p-4 shadow-xs"
            >
              <div className="aspect-[4/3] animate-pulse rounded-xl bg-slate-100" />
              <div className="mt-4 space-y-2.5">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR STATE */}
      {isError && (
        <div
          className="rounded-3xl border border-rose-200 bg-rose-50/70 p-8 text-center text-rose-800"
          role="alert"
        >
          <p className="font-bold">Không thể tải danh sách sản phẩm lúc này.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-rose-800"
          >
            <RotateCcw className="size-3.5" /> Thử lại
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isPending && !isError && displayedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 px-4 text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
            <Search className="size-6" />
          </div>
          <h3 className="text-base font-black text-slate-900">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Rất tiếc không có thiết bị nào đáp ứng các bộ lọc hiện tại. Bạn vui lòng thử xóa bớt bộ lọc hoặc tìm kiếm từ khóa khác.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <RotateCcw className="size-3.5" />
              <span>Xóa tất cả bộ lọc</span>
            </button>
          )}
        </div>
      )}

      {/* PRODUCT GRID */}
      {!isPending && !isError && displayedProducts.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuyNow={onBuyNow}
              priority={idx < 3}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!isPending && !isError && hasMore && (
        <div className="mt-10 flex flex-col items-center gap-2">
          {isLoadingMore && (
            <div
              className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3"
              aria-hidden="true"
            >
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-[24px] bg-slate-200/70"
                />
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-xs transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore
              ? 'Đang tải…'
              : isLoadMoreError
                ? 'Tải thêm chưa được — thử lại'
                : 'Xem thêm'}
          </button>
        </div>
      )}
    </>
  );
}
