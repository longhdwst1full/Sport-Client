'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Flame, RefreshCw } from 'lucide-react';
import { Breadcrumb } from '@/foundation/components/navigation';
import { useCartActions } from '@/features/cart';
import { FlashSaleDealCard, FlashSaleDealCardSkeleton } from '../components/flash-sale-deal-card';
import { useFlashSale } from '../hooks/use-flash-sale';
import type { FlashSaleDealView } from '../model/flash-sale.mapper';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function FlashSalePage() {
  const { addItem } = useCartActions();
  const { campaigns, countdown, isPending, isError, retry } = useFlashSale();

  const handleQuickAdd = (deal: FlashSaleDealView, event: React.MouseEvent) => {
    event.preventDefault();
    addItem({
        variantId: deal.variantId,
        productId: deal.variantId,
        name: deal.name,
        sku: deal.sku,
        productType: 'STANDARD',
        price: deal.price,
        quantity: 1,
        imageUrl: deal.imageUrl ?? undefined,
        slug: deal.slug,
      });
  };

  return (
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-20 pt-10 text-white">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            tone="inverted"
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Flash Sale' }]}
          />

          <div className="flex flex-col gap-6 border-b border-slate-800/80 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-amber-300">
                <Flame className="size-4 text-amber-400" aria-hidden="true" />
                Ưu đãi chớp nhoáng
              </div>
              <h1 className="mt-3 text-3xl font-black sm:text-5xl">Flash Sale đang diễn ra</h1>
              <p className="mt-3 text-sm text-slate-400 sm:text-base">
                Mỗi suất bán có số lượng giới hạn. Suất được giữ khi bạn thanh toán, không phải khi thêm vào giỏ.
              </p>
            </div>

            {countdown.finished ? null : (
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Clock className="size-4 text-amber-400" aria-hidden="true" />
                  Kết thúc trong:
                </span>
                <div
                  className="flex items-center gap-1.5 font-mono text-sm font-black sm:text-base"
                  role="timer"
                  aria-label={`Còn ${countdown.hours} giờ ${countdown.minutes} phút`}
                >
                  {[countdown.hours, countdown.minutes, countdown.seconds].map((value, index) => (
                    <span key={index} className="contents">
                      {index > 0 ? <span className="font-bold text-slate-500" aria-hidden="true">:</span> : null}
                      <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20 sm:size-10">
                        {pad(value)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isPending ? (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4" aria-busy="true" aria-label="Đang tải suất flash sale">
              {Array.from({ length: 8 }, (_, index) => (
                <FlashSaleDealCardSkeleton key={index} />
              ))}
            </div>
          ) : isError && campaigns.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-brand-900/40 bg-brand-950/20 p-10 text-center" role="alert">
              <h2 className="text-lg font-black">Không tải được chương trình flash sale</h2>
              <p className="mt-2 text-sm text-slate-400">
                Vui lòng thử lại sau ít phút hoặc xem toàn bộ sản phẩm đang bán.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => void retry()}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Thử lại
                </button>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Xem tất cả sản phẩm
                </Link>
              </div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
              <h2 className="text-lg font-black">Hiện chưa có chương trình nào đang chạy</h2>
              <p className="mt-2 text-sm text-slate-400">
                Các khung giờ vàng sẽ được thông báo trước khi mở bán.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Xem tất cả sản phẩm
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <section key={campaign.code} className="mt-12">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black sm:text-2xl">{campaign.name}</h2>
                    {campaign.description ? (
                      <p className="mt-1 text-sm text-slate-400">{campaign.description}</p>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-xs font-bold text-slate-500">
                    {campaign.deals.length} suất bán
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                  {campaign.deals.map((deal) => (
                    <FlashSaleDealCard key={deal.id} deal={deal} onQuickAdd={handleQuickAdd} />
                  ))}
                </div>
              </section>
            ))
          )}
        </main>
      </div>
  );
}
