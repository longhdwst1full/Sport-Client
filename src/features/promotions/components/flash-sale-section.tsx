'use client';

import Link from 'next/link';
import { ArrowRight, Flame, Zap } from 'lucide-react';
import type { PublicFlashSaleListDto } from '@/generated/api/promotions/promotions.schemas';
import { FlashSaleCountdownTimer } from './flash-sale-countdown';
import { trimToFullRows } from '@/shared/grid/full-rows';
import { FlashSaleDealCard } from './flash-sale-deal-card';
import { useFlashSale } from '../hooks/use-flash-sale';
import { useFlashSaleCart } from '../hooks/use-flash-sale-cart';

/** Lưới 2/4 cột; số suất lẻ thì phần dư xem ở trang `/flash-sale` (link cuối khối). */
const FULL_ROW_MULTIPLE = 4;

/** Số thẻ đầu được `priority` khi khối nằm ở màn hình đầu (2 cột mobile → hàng đầu). */
const PRIORITY_CARD_COUNT = 2;

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
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-4 py-4 text-white sm:px-6 sm:py-5">
            {/* Vệt sáng trang trí, không bắt sự kiện. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                {/* Nhãn nền trắng chữ đỏ đậm: chữ vàng trên nền đỏ thương hiệu bị chìm (tương phản thấp). */}
                <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-2xs font-bold uppercase tracking-eyebrow text-brand-700 shadow-sm">
                  <Zap className="size-3.5 fill-brand-600 text-brand-600" aria-hidden="true" />
                  Flash sale
                  <span className="relative ml-0.5 flex size-2" aria-hidden="true">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-brand-600" />
                  </span>
                  <span className="text-neutral-700">Đang diễn ra</span>
                </p>
                <h2 id="flash-sale-heading" className="mt-2 flex items-center gap-2 text-xl font-bold leading-tight sm:text-2xl">
                  <Flame className="size-6 shrink-0 text-amber-300" aria-hidden="true" />
                  <span className="truncate">{campaign.name}</span>
                </h2>
                {campaign.description ? (
                  <p className="mt-1 line-clamp-1 text-sm text-white/85">{campaign.description}</p>
                ) : null}
              </div>

              {countdown.finished ? null : (
                <div className="flex shrink-0 items-center justify-between gap-3 rounded-xl bg-black/15 px-3 py-2.5 sm:justify-start">
                  <span className="whitespace-nowrap text-xs font-semibold text-white/90">Kết thúc sau</span>
                  <FlashSaleCountdownTimer countdown={countdown} tone="onBrand" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 sm:gap-4 sm:p-5 lg:grid-cols-4">
            {trimToFullRows(campaign.deals, FULL_ROW_MULTIPLE).map((deal, index) => (
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
