'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Plus, RefreshCw, ShoppingBag, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCategoryTabs } from '../hooks/use-category-tabs';
import { useProductShowcase } from '../hooks/use-product-showcase';
import type { ProductListResponseDto } from '@/generated/api/catalog/catalog.schemas';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { useToast } from '@/shared/components/global-toast';

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
  const dispatch = useAppDispatch();
  const { toast } = useToast();

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

    dispatch(
      addCartItem({
        productId: product.id,
        variantId: product.defaultVariantId,
        sku: product.defaultVariantSku,
        productType: product.productType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.numericPrice,
        quantity: 1,
      })
    );

    router.push('/checkout');
  };

  const handleQuickAdd = (product: (typeof products)[number], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.isSellable || !product.defaultVariantId || !product.defaultVariantSku) {
      router.push(`/products/${product.slug}`);
      return;
    }

    dispatch(
      addCartItem({
        productId: product.id,
        variantId: product.defaultVariantId,
        sku: product.defaultVariantSku,
        productType: product.productType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.numericPrice,
        quantity: 1,
      })
    );

    toast({
      type: 'success',
      title: 'Đã thêm vào giỏ hàng',
      message: `${product.name} đã được thêm vào giỏ hàng.`,
    });
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
        {/* Không hiển thị giá gạch/phần trăm giảm: contract chưa có giá gốc hay khuyến mãi theo
            sản phẩm, dựng ra từ `minPrice` là bịa mức giảm giá. */}
        {displayedProducts.map((product) => {
          return (
            <article
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl"
            >
              {/* Link phủ cả thẻ bằng pseudo-element thay vì bọc quanh nội dung: nút thêm
                  vào giỏ không được nằm trong thẻ <a>, vừa sai HTML vừa làm bàn phím kích
                  hoạt nhầm sang trang chi tiết. */}
              <div className="flex w-full flex-1 flex-col">
                {/* Image Link */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
                  aria-label={`Xem chi tiết ${product.name}`}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Badge row */}
                  <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-1.5">
                    <span className="rounded-full border border-slate-100 bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur">
                      {product.productType === 'BUNDLE' ? 'Combo trọn bộ' : product.badge}
                    </span>
                  </div>

                  {/* Quick Add floating action button on image hover */}
                  {product.isSellable && product.inStock !== false && product.hasPrice && (
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product, e)}
                      title="Thêm nhanh vào giỏ hàng"
                      aria-label={`Thêm ${product.name} vào giỏ`}
                      className="absolute bottom-3 right-3 z-10 hidden size-9 place-items-center rounded-full bg-white/95 text-emerald-700 shadow-md backdrop-blur transition hover:scale-110 hover:bg-emerald-600 hover:text-white group-hover:grid"
                    >
                      <Plus className="size-4.5 stroke-[2.5]" />
                    </button>
                  )}
                </Link>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em]">
                    <span className="text-emerald-700">{product.brand}</span>
                    <span className="truncate text-slate-400">{product.category}</span>
                  </div>

                  <h3 className="mt-2 min-h-[44px] text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition">
                    <Link
                      href={`/products/${product.slug}`}
                      className="hover:underline"
                    >
                      {product.name}
                    </Link>
                  </h3>

                  <div className="mt-auto flex flex-col gap-2.5 pt-4 border-t border-slate-100">
                    <div className="flex items-baseline justify-between gap-1">
                      <div>
                        <span className="block text-[10px] font-semibold text-slate-400">Giá niêm yết</span>
                        <div className="flex items-baseline gap-1.5">
                          <strong className="text-base sm:text-lg font-black text-emerald-700">
                            {product.displayPrice}
                          </strong>
                        </div>
                      </div>
                      {product.inStock === false && (
                        <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          Tạm hết hàng
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product, e)}
                        disabled={!product.hasPrice || product.inStock === false}
                        title={
                          product.inStock === false
                            ? 'Sản phẩm tạm hết hàng'
                            : !product.hasPrice
                            ? 'Sản phẩm chưa có giá'
                            : 'Thêm vào giỏ'
                        }
                        aria-label={`Thêm vào giỏ ${product.name}`}
                        className="relative z-10 inline-flex items-center justify-center gap-1 rounded-xl border border-emerald-600/30 bg-emerald-50/80 px-2 py-2 text-xs font-extrabold text-emerald-700 shadow-2xs transition hover:bg-emerald-600 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <ShoppingBag className="size-3.5" />
                        <span>+ Giỏ</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(product, e)}
                        disabled={!product.hasPrice || product.inStock === false}
                        title={
                          product.inStock === false
                            ? 'Sản phẩm tạm hết hàng'
                            : !product.hasPrice
                            ? 'Sản phẩm chưa có giá — liên hệ để được tư vấn'
                            : product.isSellable
                              ? 'Mua ngay'
                              : 'Mở chi tiết để chọn phiên bản'
                        }
                        aria-label={`Mua ngay ${product.name}`}
                        className="relative z-10 inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-2 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        <Zap className="size-3.5 fill-white" />
                        <span>Mua ngay</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
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
                : `Xem thêm (${Math.max(total - products.length, 0)} sản phẩm)`}
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
