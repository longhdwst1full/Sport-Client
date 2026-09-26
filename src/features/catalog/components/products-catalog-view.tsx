'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, RotateCcw, Zap } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { useProductShowcase } from '../hooks/use-product-showcase';
import { useCategoryTabs } from '../hooks/use-category-tabs';
import { useDebounce } from '@/shared/hooks';
import { CATALOG_PAGE_SIZE } from '../model/product.mapper';
import { ProductListSort } from '@/generated/api/catalog/catalog.schemas';

// Khoảng giá gửi thẳng lên API (`minPrice`/`maxPrice`, VND) nên lọc trên toàn bộ catalog.
const PRICE_RANGES: Array<{ id: string; label: string; min?: string; max?: string }> = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under-2m', label: 'Dưới 2 triệu', max: '1999999' },
  { id: '2m-10m', label: '2 - 10 triệu', min: '2000000', max: '10000000' },
  { id: 'over-10m', label: 'Trên 10 triệu', min: '10000001' },
];

const SORT_OPTIONS: Array<{ value: ProductListSort; label: string }> = [
  { value: ProductListSort.NEWEST, label: 'Mới nhất' },
  { value: ProductListSort.PRICE_ASC, label: 'Giá: Thấp đến Cao' },
  { value: ProductListSort.PRICE_DESC, label: 'Giá: Cao đến Thấp' },
  { value: ProductListSort.NAME_ASC, label: 'Tên: A → Z' },
];

const isSort = (value: string | null): value is ProductListSort =>
  SORT_OPTIONS.some((option) => option.value === value);

export function ProductsCatalogView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Tab lấy từ danh mục thật (slug từ API), không viết cứng.
  // Bản trước dùng CATEGORY_TABS với id tự đặt ('gym', 'treadmill'...) rồi so sánh
  // với tên danh mục thật từ API — hai vế không bao giờ khớp nên tab nào cũng ra rỗng.
  const { tabs, isPending: isTabsPending } = useCategoryTabs();
  // RULE-LIST-02: bộ lọc nằm trong URL để reload/chia sẻ link giữ nguyên kết quả.
  const activeTabSlug = searchParams.get('category') || null;
  const priceParam = searchParams.get('price');
  const activePriceRange = PRICE_RANGES.some((range) => range.id === priceParam) ? priceParam! : 'all';
  const sortParam = searchParams.get('sort');
  const activeSort: ProductListSort = isSort(sortParam) ? sortParam : ProductListSort.NEWEST;
  const urlSearch = searchParams.get('q') ?? '';

  const updateQuery = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };
  const setActiveTabSlug = (slug: string | null) => updateQuery({ category: slug });
  const setActivePriceRange = (id: string) => updateQuery({ price: id === 'all' ? null : id });
  const setActiveSort = (sort: ProductListSort) =>
    updateQuery({ sort: sort === ProductListSort.NEWEST ? null : sort });

  // Ô tìm kiếm giữ state cục bộ để gõ mượt; chỉ đẩy lên URL sau khi ngừng gõ 300ms.
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchQuery, 300);
  useEffect(() => {
    if (debouncedSearch.trim() === urlSearch) return;
    updateQuery({ q: debouncedSearch.trim() || null });
    // updateQuery đọc searchParams hiện tại; chỉ chạy khi từ khoá đã hoãn thay đổi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  const selectedPriceRange = PRICE_RANGES.find((range) => range.id === activePriceRange);

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
  } = useProductShowcase(activeTabSlug ?? undefined, urlSearch, {
    pageSize: CATALOG_PAGE_SIZE.SCOPED,
    sort: activeSort === ProductListSort.NEWEST ? undefined : activeSort,
    minPrice: selectedPriceRange?.min,
    maxPrice: selectedPriceRange?.max,
  });

  // CONTRACT: sắp xếp và khoảng giá chạy ở API trên toàn bộ catalog; `total` là tổng sau lọc.
  const isPriceFiltered = activePriceRange !== 'all';

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

  const hasActiveFilters =
    activeTabSlug !== null ||
    activePriceRange !== 'all' ||
    activeSort !== ProductListSort.NEWEST ||
    urlSearch !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    router.replace(pathname, { scroll: false });
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
            <label className="flex items-center gap-1.5 font-semibold text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sắp xếp:</span>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as ProductListSort)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <span className="font-semibold text-slate-500" aria-live="polite">
              {isPriceFiltered ? (
                <>
                  <strong className="font-extrabold text-slate-900">{total}</strong> sản phẩm hợp mức giá
                  (đang hiển thị {products.length})
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
        ) : products.length === 0 ? (
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
            {products.map((product) => (
              <article
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-xl"
              >
                {/* Link phủ cả thẻ bằng pseudo-element: nút thêm vào giỏ không được nằm
                    trong thẻ <a>, vừa sai HTML vừa làm bàn phím kích hoạt nhầm. */}
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

                    {/* Top Badge */}
                    <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-1.5">
                      <span className="rounded-full border border-slate-100 bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur">
                        {product.productType === 'BUNDLE' ? 'Combo trọn bộ' : product.badge}
                      </span>
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em]">
                      <span className="text-emerald-700">{product.brand}</span>
                      <span className="truncate text-slate-400">{product.category}</span>
                    </div>

                    <h3 className="mt-2 min-h-[44px] text-sm font-bold leading-snug text-slate-900 line-clamp-2 transition group-hover:text-emerald-700">
                      <Link
                        href={`/products/${product.slug}`}
                        className="hover:underline"
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
                        {product.inStock === false && (
                          <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            Tạm hết hàng
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
                        disabled={!product.hasPrice || product.inStock === false}
                        className="relative z-10 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
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
