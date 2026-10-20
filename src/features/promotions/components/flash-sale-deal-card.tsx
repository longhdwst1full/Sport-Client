'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Flame, ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Skeleton } from '@/foundation/components/feedback';
import { formatVnd } from '@/shared/format/money';
import { PriceText } from '@/shared/components/price-text';
import type { FlashSaleDealView } from '../model/flash-sale.mapper';

/** Vòng focus chuẩn cho thẻ và trang flash sale (giữ tên để không đổi nơi gọi). */
export const FLASH_SALE_FOCUS_RING =
  'focus-ring';

/** Đã bán từ mức này thì gắn nhãn "Hot" / "Sắp hết". */
const HOT_SOLD_PERCENT = 50;

export function FlashSaleDealCard({
  deal,
  onAddToCart,
  onBuyNow,
  priority = false,
}: {
  deal: FlashSaleDealView;
  onAddToCart: (deal: FlashSaleDealView) => void;
  onBuyNow: (deal: FlashSaleDealView) => void;
  /** Ảnh nằm trong màn hình đầu (khối flash sale thay hero trang chủ). */
  priority?: boolean;
}) {
  const soldOut = deal.availableQuantity <= 0;
  const almostGone = !soldOut && deal.soldPercent >= HOT_SOLD_PERCENT;

  return (
    <div className="group card-interactive flex flex-col border-brand-100 hover:border-brand-300">
      {/* Bấm ảnh luôn sang trang chi tiết; nút mua nằm ngoài link. */}
      <Link
        href={`/products/${deal.slug}`}
        className={`relative aspect-square overflow-hidden bg-neutral-50 ${FLASH_SALE_FOCUS_RING}`}
        aria-label={`Xem chi tiết ${deal.name}`}
      >
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt={deal.name}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 50vw, 25vw"
            className={`object-contain p-2 transition-transform duration-500 group-hover:scale-105 ${soldOut ? 'opacity-50 grayscale' : ''}`}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs font-semibold text-neutral-400">
            Chưa có ảnh
          </div>
        )}
        {deal.discountPercent !== null ? (
          <span className="absolute left-0 top-2 inline-flex items-center gap-0.5 rounded-r-full bg-brand-600 py-1 pl-2 pr-2.5 text-xs font-bold text-white shadow-sm sm:top-3 sm:text-sm">
            <Zap className="size-3.5 fill-amber-300 text-amber-300" aria-hidden="true" />-{deal.discountPercent}%
          </span>
        ) : null}
        {almostGone ? (
          <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-amber-400 px-2 py-0.5 text-2xs font-bold uppercase text-neutral-950 sm:right-3 sm:top-3">
            <Flame className="size-3" aria-hidden="true" />
            Hot
          </span>
        ) : null}
        {soldOut ? (
          <span className="absolute inset-x-0 bottom-0 bg-neutral-950/75 py-1.5 text-center text-xs font-bold uppercase text-white">
            Đã hết suất
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-neutral-950">
          <Link href={`/products/${deal.slug}`} className={`rounded hover:text-brand-700 ${FLASH_SALE_FOCUS_RING}`}>
            {deal.name}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <PriceText
            label={formatVnd(deal.price)}
            className="text-lg font-bold text-brand-600 sm:text-xl"
            strikeLabel={deal.originalPrice !== null ? formatVnd(deal.originalPrice) : null}
            strikeClassName="text-xs text-neutral-400 line-through"
          />
        </div>

        {/* Thanh suất kiểu "đang cháy hàng": nhãn nằm trong thanh. */}
        <div
          className="relative mt-3 h-5 w-full overflow-hidden rounded-full bg-brand-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={deal.soldPercent}
          aria-label={`Đã bán ${deal.soldPercent}% suất`}
        >
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${Math.max(deal.soldPercent, soldOut ? 100 : 8)}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center gap-1 text-2xs font-bold text-neutral-950">
            {almostGone ? <Flame className="size-3 text-brand-700" aria-hidden="true" /> : null}
            {soldOut ? 'Hết suất' : almostGone ? `Sắp hết · còn ${deal.availableQuantity}` : `Đã bán ${deal.soldQuantity}`}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <Button
            variant="secondary"
            size="icon"
            disabled={soldOut}
            onClick={() => onAddToCart(deal)}
            aria-label={`Thêm ${deal.name} vào giỏ`}
            title="Thêm vào giỏ"
            className="shrink-0"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="primary"
            disabled={soldOut}
            onClick={() => onBuyNow(deal)}
            className="h-11 min-w-0 flex-1 gap-1 px-2 text-xs font-bold sm:text-sm"
          >
            <Zap className="hidden size-4 shrink-0 sm:block" aria-hidden="true" />
            <span className="truncate">{soldOut ? 'Hết suất' : 'Mua ngay'}</span>
            <span className="sr-only">: {deal.name}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Khung chờ cùng kích thước thẻ suất bán (ảnh vuông + thân thẻ) để lưới không nhảy khi dữ liệu về. */
export function FlashSaleDealCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden card-interactive" aria-hidden>
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="mt-2 h-7 w-2/3" />
        <Skeleton className="mt-3 h-5 w-full rounded-full" />
        <div className="mt-auto flex gap-2 pt-3">
          <Skeleton className="size-11 shrink-0" />
          <Skeleton className="h-11 flex-1" />
        </div>
      </div>
    </div>
  );
}
