'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap } from 'lucide-react';
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
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white transition-shadow duration-200 hover:border-neutral-300 hover:shadow-md motion-reduce:transition-none">
      <div className="flex w-full flex-1 flex-col">
        {/* Thumbnail Link */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 300px"
            priority={priority}
            className="object-contain p-2"
          />

          {/* Chỉ gắn nhãn Combo: tên danh mục đã có ở dòng "thương hiệu · danh mục" bên dưới, lặp lại trên ảnh
              chỉ che sản phẩm. */}
          {product.productType === 'BUNDLE' && (
            <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-neutral-900 px-2 py-0.5 text-2xs font-bold text-white sm:left-3 sm:top-3">
              Combo trọn bộ
            </span>
          )}
        </Link>

        {/* Content details: giá trên, nút mua full-width dưới để lưới 2 cột 360px vẫn đủ chỗ. */}
        <div className="flex flex-1 flex-col p-3">
          <p className="truncate text-xs text-neutral-500">
            {[product.brand ?? 'Chính hãng', product.category].filter(Boolean).join(' · ')}
          </p>

          {/* Product Title: link chính của thẻ (text link cho SEO/screen reader). */}
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-5 text-neutral-900">
            <Link
              href={`/products/${product.slug}`}
              className="rounded-sm hover:underline focus-ring"
            >
              {product.name}
            </Link>
          </h3>

          {/* Price, stock & CTA */}
          <div className="mt-auto pt-2">
            <strong
              className={`block truncate text-base font-bold ${product.hasPrice ? 'text-brand-600' : 'text-neutral-700'}`}
            >
              {product.displayPrice}
            </strong>
            <div className="mt-0.5 h-5">
              {product.inStock === false ? (
                <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-3xs font-bold text-amber-800">
                  Tạm hết hàng
                </span>
              ) : product.inStock === true ? (
                <span className="inline-flex items-center gap-1 text-2xs font-semibold text-success-700">
                  <span aria-hidden className="size-1.5 rounded-full bg-success-600" />
                  Còn hàng
                </span>
              ) : null}
            </div>

            {onBuyNow && (
              <Button
                variant="outline"
                fullWidth
                onClick={(e) => onBuyNow(product, e)}
                disabled={!product.hasPrice || product.inStock === false}
                className="relative z-10 mt-2 gap-1.5 px-3 text-xs hover:translate-y-0 sm:text-sm disabled:border-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:shadow-none"
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
                <Zap aria-hidden className="size-3.5" />
                <span>{product.inStock === false ? 'Tạm hết hàng' : 'Mua ngay'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
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
