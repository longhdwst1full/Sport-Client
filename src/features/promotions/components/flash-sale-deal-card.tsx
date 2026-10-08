'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Skeleton } from '@/foundation/components/feedback';
import { formatVnd } from '@/shared/format/money';
import { PriceText } from '@/shared/components/price-text';
import type { FlashSaleDealView } from '../model/flash-sale.mapper';

/** Vòng focus cho nền tối của trang flash sale (dùng chung cho thẻ và trang). */
export const FLASH_SALE_FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

export function FlashSaleDealCard({
  deal,
  onQuickAdd,
}: {
  deal: FlashSaleDealView;
  onQuickAdd: (deal: FlashSaleDealView, event: React.MouseEvent) => void;
}) {
  const soldOut = deal.availableQuantity <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl sm:rounded-[26px] border border-slate-800 bg-slate-900/90 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-600/10">
      <Link href={`/products/${deal.slug}`} className={`relative aspect-[4/3] overflow-hidden bg-slate-800 ${FLASH_SALE_FOCUS_RING}`} aria-label={`Xem chi tiết ${deal.name}`}>
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt={deal.name}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs font-bold text-slate-600">
            Chưa có ảnh
          </div>
        )}
        <div className="absolute inset-x-2 top-2 flex flex-wrap items-center justify-between gap-1 sm:inset-x-3 sm:top-3">
          <span className="rounded-full bg-slate-950/80 px-2 py-0.5 text-xs font-black uppercase text-amber-300 sm:px-2.5 sm:tracking-wider backdrop-blur-md">
            {soldOut ? 'Hết suất' : `Còn ${deal.availableQuantity} suất`}
          </span>
          {deal.discountPercent !== null ? (
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-black text-white shadow-md">
              -{deal.discountPercent}%
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="line-clamp-2 min-h-[44px] text-sm font-bold text-white transition group-hover:text-brand-300">
          <Link href={`/products/${deal.slug}`} className={`rounded ${FLASH_SALE_FOCUS_RING}`}>{deal.name}</Link>
        </h3>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 sm:mt-4">
          <PriceText
            label={formatVnd(deal.price)}
            className="text-base font-black text-brand-400 sm:text-xl"
            strikeLabel={deal.originalPrice !== null ? formatVnd(deal.originalPrice) : null}
            strikeClassName="text-xs text-slate-500 line-through"
          />
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">
              Đã bán {deal.soldQuantity}/{deal.soldQuantity + deal.availableQuantity}
            </span>
            <span className="text-amber-300">{deal.soldPercent}%</span>
          </div>
          <div
            className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={deal.soldPercent}
            aria-label={`Đã bán ${deal.soldPercent}% suất`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-brand-600 transition-all duration-500"
              style={{ width: `${deal.soldPercent}%` }}
            />
          </div>
        </div>

        {deal.perCustomerLimit !== null ? (
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Tối đa {deal.perCustomerLimit} sản phẩm mỗi khách
          </p>
        ) : null}

        <Button
          variant="secondary"
          fullWidth
          disabled={soldOut}
          onClick={(event) => onQuickAdd(deal, event)}
          className={`mt-4 h-auto min-h-11 bg-slate-800 px-2 text-xs font-bold hover:bg-slate-900 disabled:bg-slate-800/50 disabled:text-slate-500 disabled:opacity-100 disabled:hover:bg-slate-800/50 sm:mt-5 ${FLASH_SALE_FOCUS_RING}`}
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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 sm:rounded-[26px]" aria-hidden>
      <Skeleton className="aspect-[4/3] w-full rounded-none bg-slate-800" />
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <Skeleton className="h-[44px] w-full bg-slate-800" />
        <Skeleton className="mt-3 h-6 w-2/3 bg-slate-800 sm:mt-4 sm:h-7" />
        <Skeleton className="mt-4 h-3 w-full bg-slate-800" />
        <Skeleton className="mt-1.5 h-2 w-full rounded-full bg-slate-800" />
        <Skeleton className="mt-4 h-11 w-full bg-slate-800 sm:mt-5" />
      </div>
    </div>
  );
}
