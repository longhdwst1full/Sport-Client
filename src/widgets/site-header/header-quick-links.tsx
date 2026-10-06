import Link from 'next/link';

interface HeaderQuickLinksProps {
  hasFlashSaleCampaign: boolean;
  flashSaleMaxDiscountPercent: number | null | undefined;
}

const QUICK_LINK =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 xl:px-3 xl:py-1.5 xl:text-sm';

export function HeaderQuickLinks({
  hasFlashSaleCampaign,
  flashSaleMaxDiscountPercent,
}: HeaderQuickLinksProps) {
  return (
    <div className="flex shrink-0 items-center gap-1 text-sm font-semibold xl:gap-1.5">
      {/* Chỉ mời khách vào Flash Sale khi thật sự có chương trình đang chạy */}
      {hasFlashSaleCampaign && (
        <Link
          href="/flash-sale"
          className="mr-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-3 py-1 text-xs font-black text-white shadow-xs transition hover:from-brand-700 hover:to-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 xl:px-3.5 xl:py-1.5 xl:text-sm"
        >
          <span>⚡ Flash Sale</span>
          {flashSaleMaxDiscountPercent ? (
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
              -{flashSaleMaxDiscountPercent}%
            </span>
          ) : null}
        </Link>
      )}

      <Link href="/products" className={QUICK_LINK}>
        <span>Combo Home Gym</span>
        <span className="rounded-full bg-amber-100 border border-amber-300/60 px-1.5 py-0.5 text-[10px] font-black uppercase text-amber-800">
          Hot
        </span>
      </Link>

      <Link href="/news" className={`hidden xl:inline-flex ${QUICK_LINK}`}>
        <span className="hidden 2xl:inline">Cẩm nang tập luyện</span>
        <span className="2xl:hidden">Cẩm nang</span>
      </Link>

      <Link href="/contact" className={`hidden 2xl:inline-flex ${QUICK_LINK}`}>
        Liên hệ
      </Link>
    </div>
  );
}
