'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Flame } from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { Breadcrumb } from '@/foundation/components/navigation';
import { Skeleton } from '@/foundation/components/feedback';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { FlashSaleDealCard } from '../components/flash-sale-deal-card';
import { useFlashSale } from '../hooks/use-flash-sale';
import type { FlashSaleDealView } from '../model/flash-sale.mapper';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function FlashSalePage() {
  const dispatch = useAppDispatch();
  const { campaigns, countdown, isPending, isError } = useFlashSale();

  const handleQuickAdd = (deal: FlashSaleDealView, event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(
      addCartItem({
        variantId: deal.variantId,
        productId: deal.variantId,
        name: deal.name,
        sku: deal.sku,
        productType: 'STANDARD',
        price: deal.price,
        quantity: 1,
        imageUrl: deal.imageUrl ?? undefined,
      }),
    );
  };

  return (
    <StorefrontLayout>
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-20 pt-10 text-white">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            tone="inverted"
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Flash Sale' }]}
          />

          <div className="flex flex-col gap-6 border-b border-slate-800/80 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-rose-400">
                <Flame className="size-4 text-rose-500" />
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
                  <Clock className="size-4 text-rose-400" />
                  Kết thúc trong:
                </span>
                <div className="flex items-center gap-1.5 font-mono text-sm font-black sm:text-base">
                  {[countdown.hours, countdown.minutes, countdown.seconds].map((value, index) => (
                    <span key={index} className="contents">
                      {index > 0 ? <span className="font-bold text-slate-500">:</span> : null}
                      <span className="grid size-9 place-items-center rounded-xl bg-rose-600/90 text-white shadow-md shadow-rose-600/20 sm:size-10">
                        {pad(value)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isPending ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} className="h-[420px] rounded-[26px] bg-slate-800/70" />
              ))}
            </div>
          ) : isError ? (
            <div className="mt-10 rounded-3xl border border-rose-900/40 bg-rose-950/20 p-10 text-center">
              <h2 className="text-lg font-black">Không tải được chương trình flash sale</h2>
              <p className="mt-2 text-sm text-slate-400">
                Vui lòng thử lại sau ít phút hoặc xem toàn bộ sản phẩm đang bán.
              </p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
              <h2 className="text-lg font-black">Hiện chưa có chương trình nào đang chạy</h2>
              <p className="mt-2 text-sm text-slate-400">
                Các khung giờ vàng sẽ được thông báo trước khi mở bán.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-500"
              >
                Xem tất cả sản phẩm
                <ArrowRight className="size-4" />
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
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {campaign.deals.map((deal) => (
                    <FlashSaleDealCard key={deal.id} deal={deal} onQuickAdd={handleQuickAdd} />
                  ))}
                </div>
              </section>
            ))
          )}
        </main>
      </div>
    </StorefrontLayout>
  );
}
