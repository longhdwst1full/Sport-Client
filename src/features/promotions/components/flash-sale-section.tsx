'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Flame } from 'lucide-react';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { FlashSaleDealCard } from './flash-sale-deal-card';
import { useFlashSale } from '../hooks/use-flash-sale';
import type { FlashSaleDealView } from '../model/flash-sale.mapper';

export function FlashSaleSection() {
  const dispatch = useAppDispatch();
  const { campaign, countdown } = useFlashSale();

  const handleQuickAdd = (item: FlashSaleDealView, e: React.MouseEvent) => {
    e.preventDefault();
    // SKU và variantId lấy từ suất flash thật; giá phải trả cuối cùng vẫn do
    // checkout xác thực lại với server (`07-state-tools-performance.md`).
    dispatch(
      addCartItem({
        variantId: item.variantId,
        productId: item.variantId,
        name: item.name,
        sku: item.sku,
        productType: 'STANDARD',
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl ?? undefined,
      })
    );
  };

  const format2Digits = (num: number) => String(num).padStart(2, '0');

  // Không có chiến dịch đang chạy (hoặc đang tải lần đầu) thì ẩn hẳn section,
  // không dựng đếm ngược giả hay nháy skeleton rồi biến mất gây giật layout trên trang chủ.
  if (!campaign || campaign.deals.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Flame & Live Countdown */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-800/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-rose-400">
              <Flame className="size-4 animate-bounce text-rose-500" />
              Ưu đãi chớp nhoáng — Giờ vàng thể thao
            </div>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              {campaign?.name ?? 'Flash Sale Thiết Bị Hôm Nay'}
            </h2>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              {campaign?.description ?? 'Số lượng ưu đãi có hạn theo từng suất bán.'}
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Clock className="size-4 text-rose-400" />
              Kết thúc trong:
            </span>
            <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-black">
              <span className="grid size-9 sm:size-10 place-items-center rounded-xl bg-rose-600/90 text-white shadow-md shadow-rose-600/20">
                {format2Digits(countdown.hours)}
              </span>
              <span className="text-slate-500 font-bold">:</span>
              <span className="grid size-9 sm:size-10 place-items-center rounded-xl bg-rose-600/90 text-white shadow-md shadow-rose-600/20">
                {format2Digits(countdown.minutes)}
              </span>
              <span className="text-slate-500 font-bold">:</span>
              <span className="grid size-9 sm:size-10 place-items-center rounded-xl bg-rose-600/90 text-white shadow-md shadow-rose-600/20">
                {format2Digits(countdown.seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {campaign.deals.map((deal) => (
            <FlashSaleDealCard key={deal.id} deal={deal} onQuickAdd={handleQuickAdd} />
          ))}
        </div>

        {/* Bottom Banner with All Deals CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-rose-900/40 bg-gradient-to-r from-rose-950/40 via-slate-900/70 to-slate-900/90 p-6 sm:flex-row sm:px-8">
          <div className="text-center sm:text-left">
            <strong className="block text-base font-black text-white">
              Xem toàn bộ suất flash sale đang mở trong hôm nay
            </strong>
            <span className="text-xs text-slate-400">
              Khám phá toàn bộ 5 ca giờ vàng Flash Sale và săn voucher giảm thêm độc quyền từ Bảo An Sport.
            </span>
          </div>
          <Link
            href="/flash-sale"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-xs font-black text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-500"
          >
            <span>Xem tất cả Deal Flash Sale</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
