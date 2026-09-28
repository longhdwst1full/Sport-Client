'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCategoryTabs } from '../hooks/use-category-tabs';
import { useProductShowcase } from '../hooks/use-product-showcase';
import type { ProductListResponseDto } from '@/generated/api/catalog/catalog.schemas';
import { useCartActions } from '@/features/cart';
import { ProductCard } from './product-card';

export function ProductShowcase({
  categorySlug,
  searchQuery,
  initialPage,
  initialPageFetchedAt,
}: {
  categorySlug?: string;
  searchQuery?: string;
  /** Trang 1 server đã lấy (chỉ dùng cho lưới "Tất cả" ở trang chủ) để SSR có sẵn sản phẩm. */
  initialPage?: ProductListResponseDto;
  initialPageFetchedAt?: number;
} = {}) {
  const router = useRouter();
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
    refetch,
  } = useProductShowcase(effectiveCategory, searchQuery, { initialPage, initialPageFetchedAt });
  const { addItem } = useCartActions();

  // Lọc danh mục chạy ở Backend (gồm cả nhánh con), nên ở đây không lọc lại. Bản trước
  // so `product.category` (tên danh mục thật) với id tab tự đặt như 'gym' — hai vế không
  // bao giờ bằng nhau nên bấm tab nào cũng ra rỗng.
  const displayedProducts = products;

  const handleBuyNow = (product: (typeof products)[number], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.isSellable || !product.defaultVariantId || !product.defaultVariantSku) {
      router.push(`/products/${product.slug}`);
      return;
    }

    addItem({
        productId: product.id,
        variantId: product.defaultVariantId,
        sku: product.defaultVariantSku,
        productType: product.productType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        price: product.numericPrice,
        quantity: 1,
      });

    router.push(`/checkout?buyNow=${product.defaultVariantId}`);
  };

  if (isPending)
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Đang tải sản phẩm">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-[28px] bg-white">
            <div className="aspect-[4/3] animate-pulse bg-stone-200" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-24 animate-pulse rounded bg-stone-200" />
              <div className="h-6 animate-pulse rounded bg-stone-200" />
              <div className="h-10 animate-pulse rounded bg-stone-100" />
            </div>
          </div>
        ))}
      </div>
    );
  if (isError)
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-800" role="alert">
        <p className="font-bold">Không thể tải sản phẩm lúc này.</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-800 px-5 py-2.5 text-sm font-bold text-white"
        >
          <RefreshCw className="size-4" /> Thử lại
        </button>
      </div>
    );
  if (!displayedProducts.length)
    return (
      <div className="rounded-3xl bg-white p-10 text-center text-stone-500">
        Chưa có sản phẩm phù hợp.
      </div>
    );

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
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {displayedProducts.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuyNow={handleBuyNow}
            priority={idx < 4}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore
              ? 'Đang tải…'
              : isLoadMoreError
                ? 'Tải thêm chưa được — thử lại'
                : 'Xem thêm'}
          </button>
        </div>
      )}

      {/* Catalog View All Banner */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:px-8">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Danh mục chính hãng</span>
          <p className="text-sm font-bold text-slate-800">
            {total > 0
              ? `${total} mẫu thiết bị thể dục thể thao đang bán`
              : 'Thiết bị thể dục thể thao cho phòng tập và gia đình'}
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <span>Khám phá toàn bộ danh mục</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
