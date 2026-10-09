'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/foundation/components/buttons';
import { Skeleton } from '@/foundation/components/feedback';
import type { ProductShowcaseItem } from '../model/product.mapper';

export interface ProductCardProps {
  product: ProductShowcaseItem;
  onBuyNow?: (product: ProductShowcaseItem, e: React.MouseEvent) => void;
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
  priority = false,
}: ProductCardProps) {
  const handleBuy = (e: React.MouseEvent) => {
    // Confetti burst for instant celebratory feedback!
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'],
    });

    if (onBuyNow) {
      onBuyNow(product, e);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:border-red-500/80 hover:shadow-2xl hover:shadow-red-600/15 overflow-hidden"
    >
      <div className="flex w-full flex-1 flex-col">
        {/* Thumbnail Link */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900 animate-shine"
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
            <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-3 py-0.5 text-2xs font-black text-white shadow-md shadow-red-600/30">
              <Sparkles className="size-3 text-amber-300 animate-spin" />
              Combo trọn bộ
            </span>
          )}
        </Link>

        {/* Content details */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="truncate text-xs font-bold text-slate-400 uppercase tracking-wider">
            {[product.brand ?? 'Chính hãng', product.category].filter(Boolean).join(' · ')}
          </p>

          {/* Product Title */}
          <h3 className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-sm font-black leading-snug text-slate-900 group-hover:text-red-600 transition-colors">
            <Link
              href={`/products/${product.slug}`}
              className="focus-ring"
            >
              {product.name}
            </Link>
          </h3>

          {/* Price, stock & CTA */}
          <div className="mt-auto pt-3">
            <div className="flex items-baseline justify-between gap-1">
              <strong
                className={`block truncate text-lg sm:text-xl font-black tracking-tight ${product.hasPrice ? 'text-red-600' : 'text-slate-400'}`}
              >
                {product.displayPrice}
              </strong>
            </div>

            <div className="mt-1 h-5">
              {product.inStock === false ? (
                <span className="inline-block rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-3xs font-extrabold text-amber-800">
                  Tạm hết hàng
                </span>
              ) : product.inStock === true ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-2xs font-extrabold text-emerald-700 shadow-2xs">
                  <span aria-hidden className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sẵn hàng tại showroom
                </span>
              ) : null}
            </div>

            {onBuyNow && (
              <Button
                variant="cta"
                fullWidth
                onClick={handleBuy}
                disabled={!product.hasPrice || product.inStock === false}
                className="relative z-10 mt-3.5 gap-1.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 px-4 py-3 text-xs font-black text-white shadow-lg shadow-red-600/25 border border-red-500/30 transition-all duration-300 hover:from-red-700 hover:to-rose-700 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 active:scale-95 sm:text-sm disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none animate-shine"
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
                <Zap aria-hidden className="size-4 fill-amber-300 text-amber-300 drop-shadow-xs shrink-0 animate-bounce" />
                <span>{product.inStock === false ? 'Tạm hết hàng' : 'Mua ngay'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
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
