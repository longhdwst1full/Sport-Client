'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { useCategoryTabs } from '../hooks/use-category-tabs';
import { useProductShowcase } from '../hooks/use-product-showcase';
import type { ProductListResponseDto } from '@/generated/api/catalog/catalog.schemas';
import { useCardBuyNow } from '../hooks/use-card-buy-now';
import { CatalogProductGrid } from './catalog/catalog-product-grid';

const GRID_CLASS = 'grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4';

export function ProductShowcase({
  categorySlug,
  searchQuery,
  initialPage,
  initialPageFetchedAt,
}: {
  categorySlug?: string;
  searchQuery?: string;
  /** Trang 1 server đã lấy cho đúng `categorySlug` (trang chủ: không lọc) để HTML SSR có sẵn sản phẩm. */
  initialPage?: ProductListResponseDto;
  initialPageFetchedAt?: number;
} = {}) {
  // Tab lấy từ danh mục thật; `null` là "Tất cả".
  const { tabs } = useCategoryTabs();
  const [activeTabSlug, setActiveTabSlug] = useState<string | null>(null);
  // Trang danh mục và trang tìm kiếm đã có phạm vi riêng, tab chỉ dùng ở lưới trưng bày.
  const effectiveCategory = categorySlug ?? activeTabSlug ?? undefined;
  const {
    products,
    total,
    hasMore,
    loadMore,
    isPending,
    isLoadingMore,
    isLoadMoreError,
    isError,
    isShowingPreviousResults,
    refetch,
  } = useProductShowcase(effectiveCategory, searchQuery, {
    initialPage,
    initialPageFetchedAt,
    // Trang 1 server lấy luôn theo đúng phạm vi của khối (danh mục của trang, không tab/từ khoá).
    initialPageFilters: { category: categorySlug },
    keepPreviousResults: true,
  });
  const handleBuyNow = useCardBuyNow();

  return (
    <div className="space-y-8">
      {/* Interactive Category Filter Pills (Only show on homepage when not constrained by categorySlug prop) */}
      {!categorySlug && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {tabs.map((tab) => {
            const isActive = activeTabSlug === tab.slug;
            return (
              <button
                key={tab.slug ?? 'all'}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveTabSlug(tab.slug)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid: tab pills luôn render để đổi tab không mất focus/nhảy layout. */}
      <CatalogProductGrid
        gridClassName={GRID_CLASS}
        errorTitle="Không thể tải sản phẩm lúc này."
        emptyState={
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            Chưa có sản phẩm phù hợp.
          </div>
        }
        isPending={isPending}
        isError={isError}
        isShowingPreviousResults={isShowingPreviousResults}
        refetch={() => void refetch()}
        displayedProducts={products}
        onBuyNow={handleBuyNow}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        isLoadMoreError={isLoadMoreError}
        onLoadMore={loadMore}
      />

      {/* Catalog View All Banner */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:px-8">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900">Danh mục chính hãng</span>
          <p className="text-sm font-bold text-slate-800">
            {total > 0
              ? `${total} mẫu thiết bị thể dục thể thao đang bán`
              : 'Thiết bị thể dục thể thao cho phòng tập và gia đình'}
          </p>
        </div>
        <Link
          href="/products"
          className={buttonVariants({ className: 'shrink-0 rounded-full px-6 text-xs font-bold shadow-sm' })}
        >
          <span>Khám phá toàn bộ danh mục</span>
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
