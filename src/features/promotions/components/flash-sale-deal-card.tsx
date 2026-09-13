'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, ShoppingBag } from 'lucide-react';
import { vndMoney } from '@/shared/format/money';
import type { FlashSaleDealView } from '../model/flash-sale.mapper';

export function FlashSaleDealCard({
  deal,
  onQuickAdd,
}: {
  deal: FlashSaleDealView;
  onQuickAdd: (deal: FlashSaleDealView, event: React.MouseEvent) => void;
}) {
  const soldOut = deal.availableQuantity <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-[26px] border border-slate-800 bg-slate-900/90 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10">
      <Link href={`/products/${deal.slug}`} className="relative aspect-[4/3] overflow-hidden bg-slate-800">
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt={deal.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs font-bold text-slate-600">
            Chưa có ảnh
          </div>
        )}
        <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
          <span className="rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-400 backdrop-blur-md">
            {soldOut ? 'Hết suất' : `Còn ${deal.availableQuantity} suất`}
          </span>
          {deal.discountPercent !== null ? (
            <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-black text-white shadow-md">
              -{deal.discountPercent}%
            </span>
          ) : null}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20">
          <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:opacity-100">
            <Eye className="size-3.5" /> Xem chi tiết
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[44px] text-sm font-bold text-white transition group-hover:text-rose-400">
          <Link href={`/products/${deal.slug}`}>{deal.name}</Link>
        </h3>

        <div className="mt-4 flex items-baseline gap-2">
          <strong className="text-lg font-black text-rose-400 sm:text-xl">
            {vndMoney.format(deal.price)}
          </strong>
          {deal.originalPrice !== null ? (
            <span className="text-xs text-slate-500 line-through">
              {vndMoney.format(deal.originalPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-400">
              Đã bán {deal.soldQuantity}/{deal.soldQuantity + deal.availableQuantity}
            </span>
            <span className="text-rose-400">{deal.soldPercent}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
              style={{ width: `${deal.soldPercent}%` }}
            />
          </div>
        </div>

        {deal.perCustomerLimit !== null ? (
          <p className="mt-2 text-[11px] font-semibold text-slate-500">
            Tối đa {deal.perCustomerLimit} sản phẩm mỗi khách
          </p>
        ) : null}

        <button
          type="button"
          disabled={soldOut}
          onClick={(event) => onQuickAdd(deal, event)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-800/50 disabled:text-slate-500 disabled:hover:bg-slate-800/50"
        >
          <ShoppingBag className="size-3.5" />
          {soldOut ? 'Hết suất' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  );
}
