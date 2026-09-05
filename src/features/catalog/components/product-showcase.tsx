'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Eye, RefreshCw } from 'lucide-react';
import { useProductShowcase } from '../hooks/use-product-showcase';

export function ProductShowcase() {
  const { products, isPending, isError, refetch } = useProductShowcase();
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
  if (!products.length)
    return (
      <div className="rounded-3xl bg-white p-10 text-center text-stone-500">
        Chưa có sản phẩm phù hợp.
      </div>
    );

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => {
        // Calculate discount percentage if original price exists
        const hasDiscount = product.originalPrice && product.originalPrice > product.numericPrice;
        const discountPercent = hasDiscount
          ? Math.round(((product.originalPrice! - product.numericPrice) / product.originalPrice!) * 100)
          : 0;

        return (
          <article
            key={product.id}
            className="group flex overflow-hidden rounded-[28px] border border-ink/5 bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
          >
            <Link href={`/products/${product.slug}`} className="flex w-full flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Badge row */}
                <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur">
                    {product.productType === 'BUNDLE' ? 'Combo trọn bộ' : product.badge}
                  </span>
                  {hasDiscount && discountPercent > 0 && (
                    <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-ink opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100">
                    <Eye className="size-3.5" />
                    Xem nhanh
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.16em]">
                  <span className="text-brand-600">{product.brand}</span>
                  <span className="truncate text-stone-400">{product.category}</span>
                </div>
                <h3 className="mt-2 min-h-14 text-lg font-extrabold leading-6">{product.name}</h3>
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-stone-500">
                  <BadgeCheck className="size-4 text-brand-600" /> Giá hiển thị đã gồm VAT
                </p>
                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                  <div>
                    <span className="block text-[11px] font-semibold text-stone-400">Giá từ</span>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-lg">{product.displayPrice}</strong>
                      {hasDiscount && product.displayOriginalPrice && (
                        <span className="text-sm text-stone-400 line-through">
                          {product.displayOriginalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white transition group-hover:bg-brand-600"
                  >
                    <ArrowRight className="size-5" />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
