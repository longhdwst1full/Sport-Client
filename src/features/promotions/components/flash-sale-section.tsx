'use client';

import Link from 'next/link';
import { ArrowRight, Flame, Zap } from 'lucide-react';
import type { PublicFlashSaleListDto } from '@/generated/api/promotions/promotions.schemas';
import { FlashSaleDealCard } from './flash-sale-deal-card';
import { useFlashSale } from '../hooks/use-flash-sale';
import { useFlashSaleCart } from '../hooks/use-flash-sale-cart';

/** Số thẻ đầu được `priority` khi khối nằm ở màn hình đầu (2 cột mobile → hàng đầu). */
const PRIORITY_CARD_COUNT = 2;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function FlashSaleSection({
  initialData,
  aboveTheFold = false,
}: {
  /** Danh sách server lấy sẵn để HTML SSR có khối ngay (trang chủ). */
  initialData?: PublicFlashSaleListDto;
  /** Khối thay hero ở đầu trang: ảnh hàng đầu tải ưu tiên (LCP). */
  aboveTheFold?: boolean;
}) {
  const { campaign, countdown } = useFlashSale({ initialData });
  const { addToCart, buyNow } = useFlashSaleCart();

  // Không giữ chỗ bằng skeleton: phần lớn thời gian KHÔNG có chiến dịch, khi đó một skeleton ~1000px
  // rồi biến mất là cú dịch layout lớn nhất trang. Chỉ hiện khi đã có chiến dịch đang chạy.
  if (!campaign || campaign.deals.length === 0) return null;

  return (
    <section className="bg-brand-50/60 py-6 sm:py-10" aria-labelledby="flash-sale-heading">
      <div className="page-container">
        <div className="overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-sm">
          {/* Dải tiêu đề đỏ nhận diện flash sale + đồng hồ đếm ngược theo giờ server. */}
          <div className="flex flex-col gap-3 bg-brand-600 px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-eyebrow text-amber-300">
                <Zap className="size-4 fill-amber-300" aria-hidden="true" />
                Flash sale
                <span className="relative ml-1 flex size-2" aria-hidden="true">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-300 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-amber-300" />
                </span>
                Đang diễn ra
              </p>
              <h2 id="flash-sale-heading" className="mt-1 flex items-center gap-2 text-xl font-bold leading-tight sm:text-2xl">
                <Flame className="size-6 shrink-0 animate-bounce text-amber-300" aria-hidden="true" />
                <span className="truncate">{campaign.name}</span>
              </h2>
              {campaign.description ? (
                <p className="mt-1 line-clamp-1 text-sm text-white/85">{campaign.description}</p>
              ) : null}
            </div>

            {countdown.finished ? null : (
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs font-semibold text-white/85">Kết thúc sau</span>
                <div
                  className="flex items-center gap-1 font-mono text-base font-bold sm:text-lg"
                  role="timer"
                  aria-label={`Còn ${countdown.hours} giờ ${countdown.minutes} phút`}
                >
                  {[countdown.hours, countdown.minutes, countdown.seconds].map((value, index) => (
                    <span key={index} className="contents">
                      {index > 0 ? <span className="text-white/70" aria-hidden="true">:</span> : null}
                      <span className="grid h-9 min-w-9 place-items-center rounded-lg bg-white px-1 text-brand-700 shadow-sm sm:h-10 sm:min-w-10">
                        {pad(value)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 sm:gap-4 sm:p-5 lg:grid-cols-4">
            {campaign.deals.map((deal, index) => (
              <FlashSaleDealCard
                key={deal.id}
                deal={deal}
                onAddToCart={addToCart}
                onBuyNow={buyNow}
                priority={aboveTheFold && index < PRIORITY_CARD_COUNT}
              />
            ))}
          </div>

          <div className="border-t border-brand-100 px-4 py-3 text-center">
            <Link
              href="/flash-sale"
              className="focus-ring inline-flex items-center gap-1.5 rounded text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              Xem tất cả suất flash sale <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
