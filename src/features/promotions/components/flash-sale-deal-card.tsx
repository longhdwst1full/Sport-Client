'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Skeleton } from '@/foundation/components/feedback';
import { formatVnd } from '@/shared/format/money';
import { PriceText } from '@/shared/components/price-text';
import type { FlashSaleDealView } from '../model/flash-sale.mapper';

/** Vòng focus chuẩn cho thẻ và trang flash sale (giữ tên để không đổi nơi gọi). */
export const FLASH_SALE_FOCUS_RING =
  'focus-ring';

export function FlashSaleDealCard({
  deal,
  onQuickAdd,
}: {
  deal: FlashSaleDealView;
  onQuickAdd: (deal: FlashSaleDealView, event: React.MouseEvent) => void;
}) {
  const soldOut = deal.availableQuantity <= 0;

  return (
    <div className="group card-interactive flex flex-col">
      <Link href={`/products/${deal.slug}`} className={`relative aspect-[4/3] overflow-hidden bg-neutral-50 ${FLASH_SALE_FOCUS_RING}`} aria-label={`Xem chi tiết ${deal.name}`}>
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt={deal.name}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs font-semibold text-neutral-400">
            Chưa có ảnh
          </div>
        )}
        <div className="absolute inset-x-2 top-2 flex flex-wrap items-center justify-between gap-1 sm:inset-x-3 sm:top-3">
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-neutral-900 sm:px-2.5">
            {soldOut ? 'Hết suất' : `Còn ${deal.availableQuantity} suất`}
          </span>
          {deal.discountPercent !== null ? (
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
              -{deal.discountPercent}%
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="line-clamp-2 min-h-[44px] text-sm font-semibold text-neutral-950">
          <Link href={`/products/${deal.slug}`} className={`rounded ${FLASH_SALE_FOCUS_RING}`}>{deal.name}</Link>
        </h3>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 sm:mt-4">
          <PriceText
            label={formatVnd(deal.price)}
            className="text-base font-bold text-brand-600 sm:text-xl"
            strikeLabel={deal.originalPrice !== null ? formatVnd(deal.originalPrice) : null}
            strikeClassName="text-xs text-neutral-400 line-through"
          />
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-neutral-500">
              Đã bán {deal.soldQuantity}/{deal.soldQuantity + deal.availableQuantity}
            </span>
            <span className="text-brand-600">{deal.soldPercent}%</span>
          </div>
          <div
            className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={deal.soldPercent}
            aria-label={`Đã bán ${deal.soldPercent}% suất`}
          >
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-500"
              style={{ width: `${deal.soldPercent}%` }}
            />
          </div>
        </div>

        {deal.perCustomerLimit !== null ? (
          <p className="mt-2 text-xs font-semibold text-neutral-500">
            Tối đa {deal.perCustomerLimit} sản phẩm mỗi khách
          </p>
        ) : null}

        <Button
          variant="outline"
          fullWidth
          disabled={soldOut}
          onClick={(event) => onQuickAdd(deal, event)}
          className="mt-4 h-auto min-h-11 px-2 text-xs sm:mt-5"
        >
          <ShoppingBag className="size-3.5" aria-hidden="true" />
          {soldOut ? 'Hết suất' : 'Thêm vào giỏ'}
          <span className="sr-only">: {deal.name}</span>
        </Button>
      </div>
    </div>
  );
}

/** Khung chờ cùng kích thước thẻ suất bán (ảnh 4/3 + thân thẻ) để lưới không nhảy khi dữ liệu về. */
export function FlashSaleDealCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden card-interactive" aria-hidden>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <Skeleton className="h-[44px] w-full" />
        <Skeleton className="mt-3 h-6 w-2/3 sm:mt-4 sm:h-7" />
        <Skeleton className="mt-4 h-3 w-full" />
        <Skeleton className="mt-1.5 h-2 w-full rounded-full" />
        <Skeleton className="mt-4 h-11 w-full sm:mt-5" />
      </div>
    </div>
  );
}
