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
      className="bg-white py-12 sm:py-16"
      aria-labelledby="flash-sale-heading"
    >
      <div className="page-container">
        {/* Header with Flame & Live Countdown */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-neutral-200 pb-6">
          <div>
            <div className="eyebrow inline-flex items-center gap-1.5 text-brand-600">
              <Flame className="size-4" aria-hidden="true" />
              Flash sale
            </div>
            <h2 id="flash-sale-heading" className="heading-page mt-2">
              {campaign?.name ?? 'Flash Sale Thiết Bị Hôm Nay'}
            </h2>
            <p className="mt-1.5 text-sm text-neutral-600">
              {campaign?.description ?? 'Số lượng ưu đãi có hạn theo từng suất bán.'}
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
              <Clock className="size-4" aria-hidden="true" />
              Kết thúc trong:
            </span>
            <div
              className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold"
              role="timer"
              aria-label={`Còn ${countdown.hours} giờ ${countdown.minutes} phút`}
            >
              <span className="grid size-9 sm:size-10 place-items-center rounded-lg bg-neutral-950 text-white">
                {format2Digits(countdown.hours)}
              </span>
              <span className="text-neutral-400 font-bold" aria-hidden="true">:</span>
              <span className="grid size-9 sm:size-10 place-items-center rounded-lg bg-neutral-950 text-white">
                {format2Digits(countdown.minutes)}
              </span>
              <span className="text-neutral-400 font-bold" aria-hidden="true">:</span>
              <span className="grid size-9 sm:size-10 place-items-center rounded-lg bg-neutral-950 text-white">
                {format2Digits(countdown.seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {campaign.deals.map((deal) => (
            <FlashSaleDealCard key={deal.id} deal={deal} onQuickAdd={handleQuickAdd} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/flash-sale" className="focus-ring inline-flex items-center gap-1.5 rounded text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline">
            Xem tất cả suất flash sale <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Cùng khung với section thật (header + lưới 4 thẻ) để giữ chỗ trong lúc tải lần đầu. */
