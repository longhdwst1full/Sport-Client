'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Eye, X, RotateCcw, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { useProductShowcase } from '../hooks/use-product-showcase';
import { useCategoryTabs } from '../hooks/use-category-tabs';
import { useDebounce } from '@/shared/hooks';
import { CATALOG_PAGE_SIZE } from '../model/product.mapper';

const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under-2m', label: 'Dưới 2 triệu', max: 2000000 },
  { id: '2m-10m', label: '2 - 10 triệu', min: 2000000, max: 10000000 },
  { id: 'over-10m', label: 'Trên 10 triệu', min: 10000000 },
];

export function ProductsCatalogView() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Tab lấy từ danh mục thật (slug từ API), không viết cứng.
  // Bản trước dùng CATEGORY_TABS với id tự đặt ('gym', 'treadmill'...) rồi so sánh
  // với tên danh mục thật từ API — hai vế không bao giờ khớp nên tab nào cũng ra rỗng.
  const { tabs, isPending: isTabsPending } = useCategoryTabs();
  const [activeTabSlug, setActiveTabSlug] = useState<string | null>(null);

  const [activePriceRange, setActivePriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Mỗi phím gõ là một query key mới; hoãn 300ms để không bắn một request cho từng ký tự.
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Lọc danh mục chạy server-side (gồm cả nhánh con). Search cũng server-side.
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
  } = useProductShowcase(activeTabSlug ?? undefined, debouncedSearch, {
    pageSize: CATALOG_PAGE_SIZE.SCOPED,
  });

  // CONTRACT: `GET /catalog/products` hiện chưa có tham số sort hay minPrice/maxPrice. Sắp
  // xếp theo giá trên phần đã tải chỉ đúng cho vài chục sản phẩm đầu trong hàng trăm, nên đã
  // gỡ ô sắp xếp (kể cả nhãn "Bán chạy nhất" không có dữ liệu bán hàng nào đứng sau). Lọc
  // mức giá vẫn giữ nhưng chỉ xét sản phẩm đã có giá trong phần đã tải và ghi rõ điều đó
  // trên màn hình. Khi API có sort/price param thì chuyển cả hai sang server-side.
  const selectedPriceRange = PRICE_RANGES.find((range) => range.id === activePriceRange);
  const isPriceFiltered = Boolean(selectedPriceRange && activePriceRange !== 'all');
  const filteredProducts = useMemo(() => {
    if (!selectedPriceRange || activePriceRange === 'all') return products;
    const { min, max } = selectedPriceRange;
    // Sản phẩm chưa có giá không thuộc khoảng giá nào; giá 0 dự phòng không được xếp vào "Dưới 2 triệu".
    return products.filter(
      (p) =>
        p.hasPrice &&
        (min === undefined || p.numericPrice >= min) &&
        (max === undefined || p.numericPrice <= max),
    );
  }, [products, activePriceRange, selectedPriceRange]);

  const handleBuyNow = (e: React.MouseEvent, product: (typeof products)[number]) => {
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

  const hasActiveFilters = activeTabSlug !== null || activePriceRange !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setActiveTabSlug(null);
    setActivePriceRange('all');
    setSearchQuery('');
  };

  return (
    <section className="relative">

      {/* Interactive Controls Bar */}
      <div className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        {/* Row 1: Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Real-time search box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              aria-label="Tìm sản phẩm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên thiết bị, giàn tạ, máy chạy bộ, thảm yoga..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-10 text-xs font-semibold text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 sm:text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                aria-label="Xóa từ khóa"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Category Tabs từ API thật */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
          {isTabsPending
            ? Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-slate-200" />
              ))
            : tabs.map((tab) => {
                const isActive = activeTabSlug === tab.slug;
                return (
                  <button
                    key={tab.slug ?? 'all'}
                    type="button"
                    onClick={() => setActiveTabSlug(tab.slug)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
        </div>

        {/* Row 3: Price Range Chips & Active Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mức giá:</span>
            {PRICE_RANGES.map((range) => {
              const isSelected = activePriceRange === range.id;
              return (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setActivePriceRange(range.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-500" aria-live="polite">
              {isPriceFiltered ? (
                <>
                  <strong className="font-extrabold text-slate-900">{filteredProducts.length}</strong> sản phẩm
                  hợp mức giá trong {products.length}/{total} đã tải
                </>
              ) : (
                <>
                  Hiển thị <strong className="font-extrabold text-slate-900">{products.length}</strong>/
                  {total} sản phẩm
                </>
              )}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 font-bold text-rose-600 hover:text-rose-700 hover:underline"
              >
                <RotateCcw className="size-3" /> Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mt-8">
        {isPending ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Đang tải sản phẩm">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white">
                <div className="aspect-[4/3] animate-pulse bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center" role="alert">
            <p className="font-bold text-red-800">Không thể tải sản phẩm lúc này.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-800 px-5 py-2.5 text-sm font-bold text-white"
            >
              <RotateCcw className="size-4" /> Thử lại
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Search className="size-8" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="mt-1 text-sm text-slate-500">
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc mức giá / danh mục.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow transition hover:bg-emerald-600"
            >
              <RotateCcw className="size-3.5" /> Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-xl"
              >
                {/* Link phủ cả thẻ bằng pseudo-element: nút thêm vào giỏ không được nằm
                    trong thẻ <a>, vừa sai HTML vừa làm bàn phím kích hoạt nhầm. */}
                <div className="flex w-full flex-1 flex-col">
                  {/* Image Box */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Top Badge */}
                    <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-1.5">
                      <span className="rounded-full border border-slate-100 bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur">
                        {product.productType === 'BUNDLE' ? 'Combo trọn bộ' : product.badge}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-lg backdrop-blur transition hover:bg-emerald-600 hover:text-white">
                        <Eye className="size-3.5" /> Xem chi tiết
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em]">
                      <span className="text-emerald-700">{product.brand}</span>
                      <span className="truncate text-slate-400">{product.category}</span>
                    </div>

                    <h3 className="mt-2 min-h-[44px] text-sm font-bold leading-snug text-slate-900 line-clamp-2 transition group-hover:text-emerald-700">
                      <Link
                        href={`/products/${product.slug}`}
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {product.name}
                      </Link>
                    </h3>

                    {/* Pricing & Buy Now Action */}
                    <div className="mt-auto flex items-end justify-between gap-2 border-t border-slate-100 pt-3">
                      <div>
                        <span className="block text-[10px] font-semibold text-slate-400">Giá niêm yết</span>
                        <div className="flex items-baseline gap-1.5">
                          <strong className="text-base font-black text-emerald-700 sm:text-lg">
                            {product.displayPrice}
                          </strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
                        disabled={!product.hasPrice}
                        className="relative z-10 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
                        title={
                          !product.hasPrice
                            ? 'Sản phẩm chưa có giá — liên hệ để được tư vấn'
                            : product.isSellable
                              ? 'Mua ngay'
                              : 'Mở chi tiết để chọn phiên bản'
                        }
                        aria-label={`Mua ngay ${product.name}`}
                      >
                        <Zap className="size-3.5 fill-white" />
                        <span>Mua ngay</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Tải thêm theo trang: không có nút này thì chỉ 24 sản phẩm đầu là xem được. */}
        {!isPending && !isError && hasMore && (
          <div className="mt-8 flex flex-col items-center gap-2">
            {isLoadingMore && (
              <div className="grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="aspect-[4/5] animate-pulse rounded-[24px] bg-slate-200/70" />
                ))}
              </div>
            )}
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
      </div>
    </section>
  );
}
