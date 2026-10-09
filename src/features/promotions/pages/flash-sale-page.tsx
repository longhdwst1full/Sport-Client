'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Flame, RefreshCw } from 'lucide-react';
import { Button, buttonVariants } from '@/foundation/components/buttons';
import { EmptyState } from '@/foundation/components/feedback';
import { Breadcrumb } from '@/foundation/components/navigation';
import { useCartActions } from '@/features/cart';
import { FLASH_SALE_FOCUS_RING, FlashSaleDealCard, FlashSaleDealCardSkeleton } from '../components/flash-sale-deal-card';
import { useFlashSale } from '../hooks/use-flash-sale';
import type { FlashSaleDealView } from '../model/flash-sale.mapper';

const PILL = `rounded-full px-5 ${FLASH_SALE_FOCUS_RING}`;
const PRODUCTS_HREF = '/products';
const PRODUCTS_LABEL = 'Xem tất cả sản phẩm';

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
      <div className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 pb-20 pt-10 text-white">
        <main className="page-container">
          <Breadcrumb
            className="mb-6"
            tone="inverted"
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Flash Sale' }]}
          />

          <div className="flex flex-col gap-6 border-b border-neutral-800/80 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-amber-300">
                <Flame className="size-4 text-amber-400" aria-hidden="true" />
                Ưu đãi chớp nhoáng
              </div>
              <h1 className="mt-3 text-3xl font-black sm:text-5xl">Flash Sale đang diễn ra</h1>
              <p className="mt-3 text-sm text-neutral-400 sm:text-base">
                Mỗi suất bán có số lượng giới hạn. Suất được giữ khi bạn thanh toán, không phải khi thêm vào giỏ.
              </p>
            </div>

            {countdown.finished ? null : (
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
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
                      {index > 0 ? <span className="font-bold text-neutral-500" aria-hidden="true">:</span> : null}
                      <span className="grid size-9 place-items-center rounded-xl bg-neutral-900 text-white shadow-md shadow-neutral-900/20 sm:size-10">
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
              <p className="mt-2 text-sm text-neutral-400">
                Vui lòng thử lại sau ít phút hoặc xem toàn bộ sản phẩm đang bán.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button variant="primary" onClick={() => void retry()} className={PILL}>
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Thử lại
                </Button>
                <Link
                  href={PRODUCTS_HREF}
                  className={buttonVariants({
                    variant: 'secondary',
                    className: `border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 ${PILL}`,
                  })}
                >
                  {PRODUCTS_LABEL}
                </Link>
              </div>
            </div>
          ) : campaigns.length === 0 ? (
            <EmptyState
              className="mt-10 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-12 text-center"
              titleClassName="text-lg font-black"
              title="Hiện chưa có chương trình nào đang chạy"
              descriptionClassName="mt-2 text-sm text-neutral-400"
              description="Các khung giờ vàng sẽ được thông báo trước khi mở bán."
              actions={
                <Link href={PRODUCTS_HREF} className={buttonVariants({ variant: 'primary', className: `mt-6 ${PILL}` })}>
                  {PRODUCTS_LABEL}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
          ) : (
            campaigns.map((campaign) => (
              <section key={campaign.code} className="mt-12">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black sm:text-2xl">{campaign.name}</h2>
                    {campaign.description ? (
                      <p className="mt-1 text-sm text-neutral-400">{campaign.description}</p>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-xs font-bold text-neutral-500">
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
