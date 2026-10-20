'use client';

import { Reveal } from '@/foundation/components/motion';
import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Skeleton } from '@/foundation/components/feedback';
import type { ProductShowcaseItem } from '../model/product.mapper';
import { activeFlashPrice, useLiveVariantFlashPrices } from '../hooks/use-variant-flash-prices';

export interface ProductCardProps {
  product: ProductShowcaseItem;
  onBuyNow?: (product: ProductShowcaseItem, e: React.MouseEvent) => void;
  /** Có thì hiện nút giỏ dạng icon cạnh "Mua ngay". */
  onAddToCart?: (product: ProductShowcaseItem, e: React.MouseEvent) => void;
  priority?: boolean;
}

/**
 * Thẻ sản phẩm gọn cho lưới 2 cột mobile: ảnh vuông `object-contain` nền trắng (ảnh thiết bị
 * thường có nền trắng, cắt `cover` làm mất máy), một dòng hãng/danh mục, giá đỏ thương hiệu.
 * Link ảnh `aria-hidden` + `tabIndex=-1`; link tiêu đề là link chính, không lồng phần tử tương tác.
 */
export const ProductCard = memo(function ProductCard({
  product,
  onBuyNow,
  onAddToCart,
  priority = false,
}: ProductCardProps) {
  const unavailable = !product.hasPrice || product.inStock === false;
  // Giá flash của biến thể mặc định (biến thể mà nút giỏ/Mua ngay đưa vào giỏ). Chỉ có sau khi query
  // flash sale client về, nên SSR và lần hydrate đầu luôn là giá niêm yết.
  const flashPrices = useLiveVariantFlashPrices();
  const flash = product.isSellable ? activeFlashPrice(flashPrices, product.defaultVariantId) : undefined;
  const handleBuy = (e: React.MouseEvent) => {
    // Confetti chỉ tải khi khách bấm mua (dynamic import), không nằm trong JS tải trang.
    void import('canvas-confetti').then(({ default: confetti }) =>
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'],
      }),
    );

    if (onBuyNow) {
      onBuyNow(product, e);
    }
  };

  return (
    <Reveal
      as="article"
      variant="zoom-in"
      stagger
      rootMargin="-50px"
      className="group hover:-translate-y-1.5 hover:scale-[1.01] relative flex flex-col rounded-3xl border border-neutral-200/90 bg-white shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/10 overflow-hidden"
    >
      <div className="flex w-full flex-1 flex-col">
        {/* Thumbnail Link */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-gradient-to-b from-neutral-50/80 via-white to-neutral-50/50 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900 animate-shine"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 300px"
            priority={priority}
            className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-110"
          />

          {/* Combo Badge */}
          {product.productType === 'BUNDLE' && (
            <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-800 px-3 py-0.5 text-2xs font-bold text-white shadow-md shadow-neutral-900/20">
              <Sparkles className="size-3 text-amber-300 animate-spin" />
              Combo trọn bộ
            </span>
          )}

          {flash && (
            <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-0.5 rounded-full bg-brand-600 px-2 py-0.5 text-2xs font-bold text-white shadow-sm">
              <Zap aria-hidden className="size-3 fill-amber-300 text-amber-300" />
              {flash.discountPercent !== null ? `-${flash.discountPercent}%` : 'Flash sale'}
            </span>
          )}
        </Link>

        {/* Content details */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="truncate text-xs font-bold text-neutral-400 uppercase tracking-wider">
            {[product.brand ?? 'Chính hãng', product.category].filter(Boolean).join(' · ')}
          </p>

          {/* Product Title */}
          <h3 className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-sm font-bold leading-snug text-neutral-900">
            <Link
              href={`/products/${product.slug}`}
              className="focus-ring"
            >
              {product.name}
            </Link>
          </h3>

          {/* Price, stock & CTA */}
          <div className="mt-auto pt-3">
            <div className="flex min-w-0 items-baseline gap-1.5">
              {flash ? (
                <>
                  <strong className="block truncate text-lg font-bold tracking-tight text-brand-600 sm:text-xl">
                    {flash.priceLabel}
                  </strong>
                  <span className="truncate text-xs text-neutral-400 line-through">
                    {flash.originalPriceLabel ?? product.displayPrice}
                  </span>
                </>
              ) : (
                <strong
                  className={`block truncate text-lg sm:text-xl font-bold tracking-tight ${product.hasPrice ? 'text-neutral-950' : 'text-neutral-400'}`}
                >
                  {product.displayPrice}
                </strong>
              )}
            </div>

            <div className="mt-1 h-5">
              {product.inStock === false ? (
                <span className="inline-block rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-3xs font-semibold text-amber-800">
                  Tạm hết hàng
                </span>
              ) : product.inStock === true ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 border border-success-200/80 px-2.5 py-0.5 text-2xs font-semibold text-success-700 shadow-2xs">
                  <span aria-hidden className="size-1.5 rounded-full bg-success-500" />
                  Còn hàng
                </span>
              ) : null}
            </div>

            {onBuyNow && (
              <div className="relative z-10 mt-3.5 flex items-center gap-2">
                {onAddToCart && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => onAddToCart(product, e)}
                    disabled={unavailable}
                    className="shrink-0"
                    title={product.isSellable ? 'Thêm vào giỏ' : 'Mở chi tiết để chọn phiên bản'}
                    aria-label={`Thêm ${product.name} vào giỏ`}
                  >
                    <ShoppingCart aria-hidden className="size-4" />
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={handleBuy}
                  disabled={unavailable}
                  className="h-11 min-w-0 flex-1 gap-1 px-2 text-xs font-bold sm:text-sm"
                  title={
                    product.inStock === false
                      ? 'Sản phẩm tạm hết hàng'
                      : !product.hasPrice
                        ? 'Sản phẩm chưa có giá'
                        : product.isSellable
                          ? 'Mua ngay'
                          : 'Mở chi tiết để chọn phiên bản'
                  }
                  aria-label={`Mua ngay ${product.name}`}
                >
                  <Zap aria-hidden className="hidden size-4 shrink-0 sm:block" />
                  <span className="truncate">{product.inStock === false ? 'Tạm hết hàng' : 'Mua ngay'}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
});

/**
 * Khung chờ cùng kích thước với `ProductCard` (ảnh vuông, dòng hãng `text-xs`, tiêu đề 2 dòng
 * `min-h-[2.5rem]`, giá + nút) để lưới không nhảy khi dữ liệu về (RULE-SKEL-03).
 */
export function ProductCardSkeleton({ withAction = true }: { withAction?: boolean } = {}) {
  return (
    <div
      aria-hidden
      className="flex flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white"
    >
      <Skeleton className="aspect-square rounded-none" />
      <div className="flex flex-1 flex-col p-3">
        <Skeleton className="h-4 w-24 rounded" />
        <div className="mt-1 min-h-[2.5rem] space-y-1">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
        <div className="mt-auto pt-2">
          <Skeleton className="h-6 w-28 rounded" />
          <div className="mt-0.5 h-5" />
          {withAction && <Skeleton className="mt-2 h-11 w-full rounded-xl" />}
        </div>
      </div>
    </div>
  );
}
