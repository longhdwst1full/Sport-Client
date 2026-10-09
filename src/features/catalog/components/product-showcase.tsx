'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { useCategoryTabs } from '../hooks/use-category-tabs';
import { useProductShowcase } from '../hooks/use-product-showcase';
import type { ProductListResponseDto } from '@/generated/api/catalog/catalog.schemas';
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
  const { total, ...list } = useProductShowcase(effectiveCategory, searchQuery, {
    initialPage,
    initialPageFetchedAt,
    // Trang 1 server lấy luôn theo đúng phạm vi của khối (danh mục của trang, không tab/từ khoá).
    initialPageFilters: { category: categorySlug },
    keepPreviousResults: true,
  });

  return (
    <div className="space-y-8">
      {/* Interactive Category Filter Pills (chỉ hiển thị ở trang chủ khi không có categorySlug và không có searchQuery) */}
      {!categorySlug && !searchQuery && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {tabs.map((tab) => {
            const isActive = activeTabSlug === tab.slug;
            return (
              <button
                key={tab.slug ?? 'all'}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveTabSlug(tab.slug)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 focus-ring ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-600 text-white shadow-md shadow-red-500/20'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      <CatalogProductGrid
        gridClassName={GRID_CLASS}
        errorTitle="Không thể tải sản phẩm lúc này."
        emptyState={
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-8 sm:p-12 text-center text-neutral-600">
            <p className="text-base font-bold text-neutral-900">
              {searchQuery ? `Không tìm thấy sản phẩm nào khớp với từ khóa "${searchQuery}"` : 'Chưa có sản phẩm phù hợp.'}
            </p>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
              {searchQuery
                ? 'Vui lòng kiểm tra lại chính tả hoặc khám phá các danh mục thiết bị thể thao phổ biến dưới đây.'
                : 'Vui lòng chọn danh mục khác hoặc quay lại sau.'}
            </p>
            {searchQuery && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Link href="/products" className={buttonVariants({ variant: 'primary', size: 'sm', className: 'rounded-full font-bold shadow-sm' })}>
                  Xem tất cả sản phẩm
                </Link>
                <Link href="/category/may-chay-bo" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'rounded-full font-bold' })}>
                  Máy chạy bộ
                </Link>
                <Link href="/category/xe-dap-tap" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'rounded-full font-bold' })}>
                  Xe đạp tập
                </Link>
                <Link href="/category/ghe-tap-ta" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'rounded-full font-bold' })}>
                  Ghế tập tạ
                </Link>
              </div>
            )}
          </div>
        }
        {...list}
      />

      {/* Catalog View All Banner */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:flex-row sm:px-8">
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">Danh mục chính hãng</span>
          <p className="text-sm font-bold text-neutral-800">
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
