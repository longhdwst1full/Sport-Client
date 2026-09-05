'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Eye,
  ShoppingBag,
  Check,
  Star,
  X,
  Sparkles,
  RotateCcw,
  BadgePercent,
  CheckCircle2,
} from 'lucide-react';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { useProductShowcase, FALLBACK_PRODUCTS } from '../hooks/use-product-showcase';
import { vndMoney } from '@/shared/format/money';

const CATEGORY_TABS = [
  { id: 'all', label: 'Tất cả sản phẩm' },
  { id: 'gym', label: 'Gym & Sức mạnh' },
  { id: 'treadmill', label: 'Máy chạy bộ & Cardio' },
  { id: 'bike', label: 'Xe đạp tập' },
  { id: 'yoga', label: 'Yoga & Phục hồi' },
  { id: 'combo', label: 'Combo Home Gym' },
];

const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under-2m', label: 'Dưới 2 triệu', max: 2000000 },
  { id: '2m-10m', label: '2 - 10 triệu', min: 2000000, max: 10000000 },
  { id: 'over-10m', label: 'Trên 10 triệu', min: 10000000 },
];

export function ProductsCatalogView() {
  const dispatch = useAppDispatch();
  const { products } = useProductShowcase();

  const [activeCategory, setActiveCategory] = useState('all');
  const [activePriceRange, setActivePriceRange] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    // 2. Category Tab
    if (activeCategory !== 'all') {
      list = list.filter((p) => {
        const cat = p.category.toLowerCase();
        const slug = p.slug.toLowerCase();
        if (activeCategory === 'gym') return cat.includes('gym') || cat.includes('sức mạnh') || slug.includes('ta-');
        if (activeCategory === 'treadmill') return cat.includes('chạy bộ') || slug.includes('chay-bo');
        if (activeCategory === 'bike') return cat.includes('xe đạp') || slug.includes('bike');
        if (activeCategory === 'yoga') return cat.includes('yoga') || cat.includes('phục hồi') || slug.includes('yoga') || slug.includes('massage');
        if (activeCategory === 'combo') return cat.includes('combo') || slug.includes('smith');
        return true;
      });
    }

    // 3. Price Range
    if (activePriceRange !== 'all') {
      const selected = PRICE_RANGES.find((r) => r.id === activePriceRange);
      if (selected) {
        list = list.filter((p) => {
          if (selected.min && selected.max) return p.numericPrice >= selected.min && p.numericPrice <= selected.max;
          if (selected.min) return p.numericPrice >= selected.min;
          if (selected.max) return p.numericPrice <= selected.max;
          return true;
        });
      }
    }

    // 4. Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.numericPrice - b.numericPrice);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.numericPrice - a.numericPrice);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, activeCategory, activePriceRange, sortBy, searchQuery]);

  const handleQuickAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addCartItem({
        productId: product.id,
        variantId: `${product.id}-default`,
        sku: product.slug.toUpperCase(),
        productType: product.productType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.numericPrice,
        quantity: 1,
      })
    );

    setToastMessage(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const hasActiveFilters = activeCategory !== 'all' || activePriceRange !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setActiveCategory('all');
    setActivePriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-slate-950/95 px-5 py-3.5 text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <span className="grid size-7 place-items-center rounded-full bg-emerald-500 text-slate-950 font-black">
            <Check className="size-4 stroke-[3]" />
          </span>
          <p className="text-xs font-bold sm:text-sm">{toastMessage}</p>
          <Link
            href="/cart"
            className="ml-2 rounded-lg bg-emerald-500 px-3 py-1 text-xs font-extrabold text-slate-950 transition hover:bg-emerald-400"
          >
            Xem giỏ
          </Link>
        </div>
      )}

      {/* Interactive Controls Bar */}
      <div className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Real-time search box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
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

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-bold text-slate-400">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
            >
              <option value="featured">Bán chạy nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="name">Tên sản phẩm: A - Z</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category Filters Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-100'
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

          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-500">
              Hiển thị <strong className="text-slate-900 font-extrabold">{filteredProducts.length}</strong> sản phẩm
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
        {filteredProducts.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Search className="size-8" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="mt-1 text-sm text-slate-500">
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc mức giá / môn tập hiện tại.
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
            {filteredProducts.map((product) => {
              const hasDiscount = product.originalPrice && product.originalPrice > product.numericPrice;
              const discountPercent = hasDiscount
                ? Math.round(((product.originalPrice! - product.numericPrice) / product.originalPrice!) * 100)
                : 0;

              return (
                <article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-xl"
                >
                  <Link href={`/products/${product.slug}`} className="flex w-full flex-1 flex-col">
                    {/* Image Box */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* Top Badges */}
                      <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-1.5">
                        <span className="rounded-full border border-slate-100 bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur">
                          {product.productType === 'BUNDLE' ? 'Combo trọn bộ' : product.badge}
                        </span>
                        {hasDiscount && discountPercent > 0 && (
                          <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[11px] font-black text-white shadow-md">
                            -{discountPercent}%
                          </span>
                        )}
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
                        {product.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-0.5 font-bold text-amber-500">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" /> 4.9
                        </span>
                        <span className="text-[11px] text-slate-400">(120+ đã mua)</span>
                        <span className="ml-auto rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          Trả góp 0%
                        </span>
                      </div>

                      {/* Pricing & Add To Cart Button */}
                      <div className="mt-auto flex items-end justify-between gap-2 border-t border-slate-100 pt-4">
                        <div>
                          <span className="block text-[10px] font-semibold text-slate-400">Giá niêm yết</span>
                          <div className="flex items-baseline gap-1.5">
                            <strong className="text-base font-black text-emerald-700 sm:text-lg">
                              {product.displayPrice}
                            </strong>
                            {hasDiscount && product.displayOriginalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                {product.displayOriginalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAddToCart(e, product)}
                          className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-900 text-white shadow-md transition duration-300 hover:bg-emerald-600 hover:scale-105 active:scale-95"
                          title="Thêm nhanh vào giỏ hàng"
                          aria-label={`Thêm ${product.name} vào giỏ`}
                        >
                          <ShoppingBag className="size-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
