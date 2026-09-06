'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Eye, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react';
import { useProductShowcase } from '../hooks/use-product-showcase';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { useToast } from '@/shared/components/global-toast';

const SHOWCASE_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'cardio', label: 'Máy chạy bộ & Xe đạp' },
  { id: 'gym', label: 'Gym & Thể hình' },
  { id: 'racket', label: 'Bóng bàn & Bóng rổ' },
  { id: 'combat-yoga', label: 'Võ thuật & Yoga' },
  { id: 'combo', label: 'Combo Home Gym' },
] as const;

export function ProductShowcase({ categorySlug }: { categorySlug?: string } = {}) {
  const { products, isPending, isError, refetch } = useProductShowcase();
  const [activeTab, setActiveTab] = useState<string>('all');
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const displayedProducts = useMemo(() => {
    // If a parent prop categorySlug was provided, prioritize it
    const activeCategory = categorySlug || (activeTab === 'all' ? undefined : activeTab);
    if (!activeCategory) return products;

    const cat = activeCategory.toLowerCase();
    const filtered = products.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pSlug = (p.slug || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();

      if (cat === 'gym' || cat.includes('gym') || cat.includes('fitness')) {
        return (
          pCat.includes('gym') ||
          pCat.includes('sức mạnh') ||
          pSlug.includes('ta-') ||
          pSlug.includes('smith') ||
          pSlug.includes('ghe-') ||
          pSlug.includes('kettlebell') ||
          pName.includes('tạ')
        );
      }
      if (cat === 'cardio' || cat.includes('chay-bo') || cat.includes('cardio') || cat.includes('xe-dap')) {
        return (
          pCat.includes('chạy bộ') ||
          pCat.includes('xe đạp') ||
          pSlug.includes('chay-bo') ||
          pSlug.includes('bike') ||
          pName.includes('chạy bộ') ||
          pName.includes('xe đạp')
        );
      }
      if (cat === 'racket' || cat.includes('bong-ban') || cat.includes('bong-ro')) {
        return (
          pCat.includes('bóng bàn') ||
          pCat.includes('bóng rổ') ||
          pSlug.includes('stiga') ||
          pSlug.includes('double-fish') ||
          pSlug.includes('s206') ||
          pSlug.includes('bong-')
        );
      }
      if (cat === 'combat-yoga' || cat.includes('vo-thuat') || cat.includes('yoga') || cat.includes('phuc-hoi')) {
        return (
          pCat.includes('võ thuật') ||
          pCat.includes('yoga') ||
          pCat.includes('phục hồi') ||
          pSlug.includes('fairtex') ||
          pSlug.includes('yoga') ||
          pSlug.includes('massage') ||
          pSlug.includes('boxing')
        );
      }
      if (cat === 'combo') {
        return p.productType === 'BUNDLE' || pSlug.includes('combo') || pCat.includes('combo');
      }

      return pCat.includes(cat) || pSlug.includes(cat) || pName.includes(cat);
    });

    return filtered.length > 0 ? filtered : products;
  }, [products, categorySlug, activeTab]);

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
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

    toast({
      type: 'success',
      title: 'Đã thêm vào giỏ hàng!',
      message: `${product.name} đã được thêm vào giỏ thành công.`,
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
          {SHOWCASE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
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
        {displayedProducts.map((product: any) => {
          // Calculate discount percentage if original price exists
          const hasDiscount = product.originalPrice && product.originalPrice > product.numericPrice;
          const discountPercent = hasDiscount
            ? Math.round(((product.originalPrice! - product.numericPrice) / product.originalPrice!) * 100)
            : 0;

          return (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl"
            >
              <Link href={`/products/${product.slug}`} className="flex w-full flex-1 flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
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
                    {hasDiscount && discountPercent > 0 && (
                      <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-black text-white shadow-sm">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/15">
                    <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-900 opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100">
                      <Eye className="size-3.5" />
                      Xem nhanh
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em]">
                    <span className="text-emerald-700">{product.brand}</span>
                    <span className="truncate text-slate-400">{product.category}</span>
                  </div>

                  <h3 className="mt-2 min-h-[44px] text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-amber-500 font-bold">★ 4.9</span>
                    <span className="text-slate-400 text-[11px]">(120+ đã mua)</span>
                    <span className="ml-auto rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      Trả góp 0%
                    </span>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-2 pt-4 border-t border-slate-100">
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400">Giá niêm yết</span>
                      <div className="flex items-baseline gap-1.5">
                        <strong className="text-base sm:text-lg font-black text-emerald-700">
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
                      onClick={(e) => handleQuickAdd(product, e)}
                      title="Thêm vào giỏ hàng"
                      aria-label={`Thêm ${product.name} vào giỏ`}
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-900 text-white transition duration-300 hover:bg-emerald-600 hover:scale-110 shadow-sm"
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

      {/* Catalog View All Banner */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:px-8">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Danh mục chính hãng</span>
          <p className="text-sm font-bold text-slate-800">
            Còn hơn 120+ mẫu thiết bị thể dục thể thao chuyên nghiệp và gia đình sẵn sàng giao ngay
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <span>Khám phá toàn bộ danh mục</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
