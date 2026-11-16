'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Reveal } from '@/foundation/components/motion';
import type { ProductShowcaseItem } from '../model/product.mapper';
import { activeFlashPrice, useLiveVariantFlashPrices } from '../hooks/use-variant-flash-prices';
import { PRODUCT_CARD_SHELL, PRODUCT_CARD_STAGE } from './product-card.styles';

export interface ProductCardProps {
  product: ProductShowcaseItem;
  onBuyNow?: (product: ProductShowcaseItem, e: React.MouseEvent) => void;
  /** Có thì hiện nút giỏ dạng icon cạnh "Mua ngay". */
  onAddToCart?: (product: ProductShowcaseItem, e: React.MouseEvent) => void;
  priority?: boolean;
}

/** Nhãn tooltip/aria của nút mua — tách khỏi JSX để thứ tự ưu tiên trạng thái dễ đọc. */
function buyTitle(product: ProductShowcaseItem): string {
  if (product.inStock === false) return 'Sản phẩm tạm hết hàng';
  if (!product.hasPrice) return 'Sản phẩm chưa có giá';
  return product.isSellable ? 'Mua ngay' : 'Mở chi tiết để chọn phiên bản';
}

/**
 * Thẻ sản phẩm (giữ phong cách Pro Tour): thẻ nổi bo góc, bục ảnh studio gradient nhẹ, nhãn
 * Flash Sale/Combo góc trái, hover nâng thẻ + phóng ảnh.
 * Dùng design system: nút qua `Button` (primary = Mua ngay, secondary icon = thêm giỏ), giá thường
 * `neutral-950`, chỉ giá flash sale dùng `brand-*` (RULE-DS-01), chữ ≥ `text-2xs`, không `font-black`.
 */
export const ProductCard = memo(function ProductCard({
  product,
  onBuyNow,
  onAddToCart,
  priority = false,
}: ProductCardProps) {
  const unavailable = !product.hasPrice || product.inStock === false;
  const href = `/products/${product.slug}`;

  // Giá flash của biến thể mặc định (biến thể mà nút giỏ/Mua ngay đưa vào giỏ).
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
    onBuyNow?.(product, e);
  };

  return (
    <Reveal
      as="article"
      variant="zoom-in"
      stagger
      rootMargin="-50px"
      className={`group relative flex flex-col ${PRODUCT_CARD_SHELL} transition-all duration-300 hover:-translate-y-1.5 hover:border-neutral-200 hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.12)]`}
    >
      {/* Bục ảnh studio */}
      <div className={`${PRODUCT_CARD_STAGE} bg-gradient-to-b from-neutral-100/80 via-neutral-50 to-neutral-100/70 p-2 sm:p-3`}>
        <Link href={href} className="relative block size-full focus-ring" tabIndex={-1} aria-hidden="true">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 320px"
            priority={priority}
            className="object-contain p-2 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-110"
          />
        </Link>

        {(flash || product.productType === 'BUNDLE') && (
          <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex flex-wrap items-center gap-1.5">
            {flash ? (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-600 px-2.5 py-0.5 text-3xs font-bold text-white shadow-xs">
                <Zap aria-hidden className="size-2.5 fill-amber-300 text-amber-300" />
                {flash.discountPercent !== null ? `-${flash.discountPercent}%` : 'FLASH SALE'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-3xs font-bold text-neutral-950 shadow-xs">
                <Sparkles aria-hidden className="size-2.5" />
                COMBO PRO
              </span>
            )}
          </div>
        )}
      </div>

      {/* Thông tin */}
      <div className="flex flex-1 flex-col pt-3">
        <p className="eyebrow line-clamp-1 text-neutral-600">
          {[product.brand ?? 'Chính hãng', product.category].filter(Boolean).join(' · ')}
        </p>

        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-snug text-neutral-950 transition-colors group-hover:text-brand-600 sm:text-base">
          <Link href={href} className="focus-ring">
            {product.name}
          </Link>
        </h3>

        {product.shortDescription && (
          <p className="mt-1.5 line-clamp-1 text-2xs font-medium text-neutral-600" title={product.shortDescription}>
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto pt-3.5">
          <div className="flex min-w-0 items-baseline gap-1.5">
            {flash ? (
              <>
                <strong className="text-lg font-bold tracking-tight text-brand-600 sm:text-xl">{flash.priceLabel}</strong>
                <span className="truncate text-xs font-semibold text-neutral-600 line-through">
                  {flash.originalPriceLabel ?? product.displayPrice}
                </span>
              </>
            ) : (
              <strong
                className={`text-lg font-bold tracking-tight sm:text-xl ${product.hasPrice ? 'text-neutral-950' : 'text-neutral-600'}`}
              >
                {product.displayPrice}
              </strong>
            )}
          </div>

          <div className="mt-1 h-5">
            {product.inStock === false ? (
              <span className="inline-flex items-center rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-3xs font-semibold text-amber-800">
                Tạm hết hàng
              </span>
            ) : product.inStock === true ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success-200/80 bg-success-50 px-2.5 py-0.5 text-2xs font-semibold text-success-700">
                <span aria-hidden className="size-1.5 rounded-full bg-success-500" />
                Còn hàng
              </span>
            ) : null}
          </div>
        </div>

        {onBuyNow && (
          <div className="relative z-10 mt-2.5 flex items-center gap-1.5 sm:gap-2">
            {onAddToCart && (
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => onAddToCart(product, e)}
                disabled={unavailable}
                title={product.isSellable ? 'Thêm vào giỏ hàng' : 'Mở chi tiết để chọn phiên bản'}
                aria-label={`Thêm ${product.name} vào giỏ hàng`}
              >
                <ShoppingCart aria-hidden />
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleBuy}
              disabled={unavailable}
              className="min-w-0 flex-1 px-2 text-xs uppercase tracking-wider sm:px-3"
              title={buyTitle(product)}
              aria-label={`Mua ngay ${product.name}`}
            >
              <Zap aria-hidden className="hidden fill-amber-300 text-amber-300 sm:inline" />
              <span className="truncate">{product.inStock === false ? 'Hết' : 'Mua ngay'}</span>
            </Button>
          </div>
        )}
      </div>
    </Reveal>
  );
});

export { ProductCardSkeleton } from './product-card-skeleton';
