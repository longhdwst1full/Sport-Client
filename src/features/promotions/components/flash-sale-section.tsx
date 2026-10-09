'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Flame } from 'lucide-react';
import { useCartActions } from '@/features/cart';
import { Skeleton } from '@/foundation/components/feedback';
import { FlashSaleDealCard } from './flash-sale-deal-card';
import { useFlashSale } from '../hooks/use-flash-sale';
import type { FlashSaleDealView } from '../model/flash-sale.mapper';

export function FlashSaleSection() {
  const { addItem } = useCartActions();
  const { campaign, countdown } = useFlashSale();

  const handleQuickAdd = (item: FlashSaleDealView, e: React.MouseEvent) => {
    e.preventDefault();
    // SKU và variantId lấy từ suất flash thật; giá phải trả cuối cùng vẫn do
    // checkout xác thực lại với server (`07-state-tools-performance.md`).
    addItem({
        variantId: item.variantId,
        productId: item.variantId,
        name: item.name,
        sku: item.sku,
        productType: 'STANDARD',
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl ?? undefined,
        slug: item.slug,
      });
  };

  const format2Digits = (num: number) => String(num).padStart(2, '0');

  // Không giữ chỗ bằng skeleton: phần lớn thời gian KHÔNG có chiến dịch, khi đó một skeleton ~1000px
  // rồi biến mất là cú dịch layout lớn nhất trang. Chỉ hiện khi đã có chiến dịch đang chạy.
  if (!campaign || campaign.deals.length === 0) return null;

  return (
    <section
      className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 py-16 text-white sm:py-20"
      aria-labelledby="flash-sale-heading"
    >
      <div className="page-container">
        {/* Header with Flame & Live Countdown */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-neutral-800/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-amber-300">
              <Flame className="size-4 text-amber-400 motion-safe:animate-bounce" aria-hidden="true" />
              Ưu đãi chớp nhoáng — Giờ vàng thể thao
            </div>
            <h2 id="flash-sale-heading" className="mt-3 text-3xl font-black text-white sm:text-4xl">
              {campaign?.name ?? 'Flash Sale Thiết Bị Hôm Nay'}
            </h2>
            <p className="mt-2 text-sm text-neutral-400 sm:text-base">
              {campaign?.description ?? 'Số lượng ưu đãi có hạn theo từng suất bán.'}
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Clock className="size-4 text-amber-400" aria-hidden="true" />
              Kết thúc trong:
            </span>
            <div
              className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-black"
              role="timer"
              aria-label={`Còn ${countdown.hours} giờ ${countdown.minutes} phút`}
            >
              <span className="grid size-9 sm:size-10 place-items-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
                {format2Digits(countdown.hours)}
              </span>
              <span className="text-neutral-500 font-bold" aria-hidden="true">:</span>
              <span className="grid size-9 sm:size-10 place-items-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
                {format2Digits(countdown.minutes)}
              </span>
              <span className="text-neutral-500 font-bold" aria-hidden="true">:</span>
              <span className="grid size-9 sm:size-10 place-items-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
                {format2Digits(countdown.seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {campaign.deals.map((deal) => (
            <FlashSaleDealCard key={deal.id} deal={deal} onQuickAdd={handleQuickAdd} />
          ))}
        </div>

        {/* Bottom Banner with All Deals CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-brand-900/40 bg-gradient-to-r from-neutral-950/50 via-neutral-900/70 to-neutral-900/90 p-6 sm:flex-row sm:px-8">
          <div className="text-center sm:text-left">
            <strong className="block text-base font-black text-white">
              Xem toàn bộ suất flash sale đang mở trong hôm nay
            </strong>
            <span className="text-xs text-neutral-400">
              Khám phá toàn bộ 5 ca giờ vàng Flash Sale và săn voucher giảm thêm độc quyền từ Bảo An Sport.
            </span>
          </div>
          <Link
            href="/flash-sale"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black text-neutral-900 shadow-md transition hover:bg-neutral-100 hover:scale-105 active:scale-95 focus-ring-inverse focus-visible:ring-offset-neutral-900"
          >
            <span>Xem tất cả Deal Flash Sale</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Cùng khung với section thật (header + lưới 4 thẻ) để giữ chỗ trong lúc tải lần đầu. */
