import Link from 'next/link';

interface HeaderQuickLinksProps {
  hasFlashSaleCampaign: boolean;
  flashSaleMaxDiscountPercent: number | null | undefined;
}

export function HeaderQuickLinks({
  hasFlashSaleCampaign,
  flashSaleMaxDiscountPercent,
}: HeaderQuickLinksProps) {
  return (
    <div className="flex items-center gap-1 xl:gap-1.5 text-sm font-semibold shrink-0">
      {/* Chỉ mời khách vào Flash Sale khi thật sự có chương trình đang chạy */}
      {hasFlashSaleCampaign && (
        <Link
          href="/flash-sale"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 px-2.5 py-1.5 text-xs font-black text-rose-600 border border-rose-200/70 hover:border-rose-300 hover:shadow-xs transition-all xl:px-3 xl:py-2 xl:text-sm"
        >
          <span>⚡ Flash Sale</span>
          {flashSaleMaxDiscountPercent ? (
            <span className="rounded-full bg-rose-600 px-1.5 py-0.5 text-[9.5px] font-black uppercase text-white animate-pulse">
              -{flashSaleMaxDiscountPercent}%
            </span>
          ) : null}
        </Link>
      )}

      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-emerald-50/80 hover:text-emerald-700 xl:px-3 xl:py-2 xl:text-sm"
      >
        <span>Combo Home Gym</span>
        <span className="rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-white shadow-xs">
          Hot
        </span>
      </Link>

      <Link
        href="/news"
        className="hidden xl:inline-flex items-center whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-emerald-50/80 hover:text-emerald-700 xl:px-3 xl:py-2 xl:text-sm"
      >
        <span className="hidden 2xl:inline">Cẩm nang tập luyện</span>
        <span className="2xl:hidden">Cẩm nang</span>
      </Link>
    </div>
  );
}
