'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Clock, ArrowRight, Gift, ShoppingBag, Eye } from 'lucide-react';
import { vndMoney } from '@/shared/format/money';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';

import { MOCK_HOMEPAGE_FLASH_DEALS as FLASH_DEALS } from '@/shared/data/mocks';

export function FlashSaleSection() {
  const dispatch = useAppDispatch();
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = (item: typeof FLASH_DEALS[0], e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(
      addCartItem({
        variantId: item.id,
        productId: item.id,
        name: item.name,
        sku: `FS-${item.id}`,
        productType: 'STANDARD',
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl,
      })
    );
  };

  const format2Digits = (num: number) => String(num).padStart(2, '0');

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
              Flash Sale Thiết Bị Hôm Nay
            </h2>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Số lượng ưu đãi có hạn. Áp dụng đồng thời quà tặng kèm chính hãng và miễn phí lắp ráp tận nhà.
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
                {format2Digits(timeLeft.hours)}
              </span>
              <span className="text-slate-500 font-bold">:</span>
              <span className="grid size-9 sm:size-10 place-items-center rounded-xl bg-rose-600/90 text-white shadow-md shadow-rose-600/20">
                {format2Digits(timeLeft.minutes)}
              </span>
              <span className="text-slate-500 font-bold">:</span>
              <span className="grid size-9 sm:size-10 place-items-center rounded-xl bg-rose-600/90 text-white shadow-md shadow-rose-600/20">
                {format2Digits(timeLeft.seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FLASH_DEALS.map((deal) => {
            const percentSold = Math.round((deal.sold / deal.total) * 100);

            return (
              <div
                key={deal.id}
                className="group flex flex-col overflow-hidden rounded-[26px] border border-slate-800 bg-slate-900/90 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10"
              >
                {/* Image & Discount Badge */}
                <Link href={`/products/${deal.slug}`} className="relative aspect-[4/3] overflow-hidden bg-slate-800">
                  <Image
                    src={deal.imageUrl}
                    alt={deal.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Top Badges */}
                  <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
                    <span className="rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-400 backdrop-blur-md">
                      {deal.badge}
                    </span>
                    <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-black text-white shadow-md">
                      -{deal.discount}%
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20">
                    <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:opacity-100">
                      <Eye className="size-3.5" /> Xem chi tiết
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 min-h-[44px] text-sm font-bold text-white group-hover:text-rose-400 transition">
                    <Link href={`/products/${deal.slug}`}>{deal.name}</Link>
                  </h3>

                  {/* Gift Tag */}
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-emerald-950/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                    <Gift className="size-3.5 shrink-0" />
                    <span className="truncate">{deal.gift}</span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <strong className="text-lg font-black text-rose-400 sm:text-xl">
                      {vndMoney.format(deal.price)}
                    </strong>
                    <span className="text-xs text-slate-500 line-through">
                      {vndMoney.format(deal.originalPrice)}
                    </span>
                  </div>

                  {/* Inventory Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-400">Đã bán {deal.sold}/{deal.total}</span>
                      <span className="text-rose-400">{percentSold}%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>
                  </div>

                  {/* Action CTA */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(deal, e)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white transition hover:bg-rose-600"
                  >
                    <ShoppingBag className="size-3.5" />
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner with All Deals CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-rose-900/40 bg-gradient-to-r from-rose-950/40 via-slate-900/70 to-slate-900/90 p-6 sm:flex-row sm:px-8">
          <div className="text-center sm:text-left">
            <strong className="block text-base font-black text-white">
              Còn hơn 45+ sản phẩm đang giảm giá tới 40% trong các khung giờ hôm nay!
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
