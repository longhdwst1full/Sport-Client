'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import type { ProductShowcaseItem } from '../model/product.mapper';
import { activeFlashPrice, useLiveVariantFlashPrices } from '../hooks/use-variant-flash-prices';

export interface ProductListItemProps {
  product: ProductShowcaseItem;
  onBuyNow?: (product: ProductShowcaseItem, e: React.MouseEvent) => void;
  onAddToCart?: (product: ProductShowcaseItem, e: React.MouseEvent) => void;
  priority?: boolean;
}

/**
 * Thẻ ngang cho chế độ danh sách: ảnh vuông cố định bên trái, hãng · danh mục, tên (link chính),
 * mô tả ngắn, giá (flash nếu có), tồn kho và nút mua. Chỉ dùng trường có thật của `ProductShowcaseItem`
 * (không đánh giá/đã bán/thông số). Link ảnh `aria-hidden` để không trùng link tên.
 */
export const ProductListItem = memo(function ProductListItem({
  product,
  onBuyNow,
  onAddToCart,
  priority = false,
}: ProductListItemProps) {
  const unavailable = !product.hasPrice || product.inStock === false;
  const flashPrices = useLiveVariantFlashPrices();
  const flash = product.isSellable ? activeFlashPrice(flashPrices, product.defaultVariantId) : undefined;
  const href = `/products/${product.slug}`;

  return (
    <article className="flex gap-3 rounded-2xl border border-neutral-200/90 bg-white p-3 shadow-xs transition-shadow hover:shadow-md sm:gap-4 sm:p-4">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-neutral-50/80 via-white to-neutral-50/50 sm:w-40"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 639px) 112px, 160px"
          priority={priority}
          className="object-contain p-2"
        />
        {flash && (
          <span className="pointer-events-none absolute right-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-brand-600 px-2 py-0.5 text-2xs font-bold text-white shadow-sm">
            <Zap aria-hidden className="size-3 fill-amber-300 text-amber-300" />
            {flash.discountPercent !== null ? `-${flash.discountPercent}%` : 'Flash sale'}
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-xs font-bold uppercase tracking-wider text-neutral-600">
          {[product.brand ?? 'Chính hãng', product.category].filter(Boolean).join(' · ')}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-neutral-900 sm:text-base">
          <Link href={href} className="focus-ring">
            {product.name}
          </Link>
        </h3>
        {product.shortDescription && (
          <p className="mt-1 line-clamp-2 hidden text-xs text-neutral-600 sm:block">{product.shortDescription}</p>
        )}

        <div className="mt-auto pt-3">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            {flash ? (
              <>
                <strong className="text-lg font-bold tracking-tight text-brand-600">{flash.priceLabel}</strong>
                <span className="text-xs text-neutral-600 line-through">
                  {flash.originalPriceLabel ?? product.displayPrice}
                </span>
              </>
            ) : (
              <strong
                className={`text-lg font-bold tracking-tight ${product.hasPrice ? 'text-neutral-950' : 'text-neutral-600'}`}
              >
                {product.displayPrice}
              </strong>
            )}
            {product.inStock === false ? (
              <span className="rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-3xs font-semibold text-amber-800">
                Tạm hết hàng
              </span>
            ) : product.inStock === true ? (
              <span className="inline-flex items-center gap-1.5 text-2xs font-semibold text-success-700">
                <span aria-hidden className="size-1.5 rounded-full bg-success-500" />
                Còn hàng
              </span>
            ) : null}
          </div>

          {onBuyNow && (
            <div className="mt-2.5 flex max-w-xs items-center gap-2">
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
                onClick={(e) => onBuyNow(product, e)}
                disabled={unavailable}
                className="h-11 min-w-0 flex-1 gap-1 px-2 text-xs font-bold sm:text-sm"
                aria-label={`Mua ngay ${product.name}`}
              >
                <Zap aria-hidden className="hidden size-4 shrink-0 sm:block" />
                <span className="truncate">{product.inStock === false ? 'Tạm hết hàng' : 'Mua ngay'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
});
