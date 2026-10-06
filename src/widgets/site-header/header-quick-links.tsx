import Link from 'next/link';

interface HeaderQuickLinksProps {
  hasFlashSaleCampaign: boolean;
  flashSaleMaxDiscountPercent: number | null | undefined;
}

/** Link phụ trên thanh điều hướng đỏ: chữ trắng; Flash Sale là "chip" trắng để nổi bật mà không thêm mảng đỏ. */
const QUICK_LINK =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-white xl:px-3 xl:py-2 xl:text-sm';

export function HeaderQuickLinks({
  hasFlashSaleCampaign,
  flashSaleMaxDiscountPercent,
}: HeaderQuickLinksProps) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 text-sm font-semibold xl:gap-1">
      {/* Chỉ mời khách vào Flash Sale khi thật sự có chương trình đang chạy */}
      {hasFlashSaleCampaign && (
        <Link
          href="/flash-sale"
          className="mr-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-brand-700 shadow-xs transition hover:bg-brand-50 focus-visible:outline-white xl:px-3 xl:py-2 xl:text-sm"
        >
          <span>⚡ Flash Sale</span>
          {flashSaleMaxDiscountPercent ? (
            <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
              -{flashSaleMaxDiscountPercent}%
            </span>
          ) : null}
        </Link>
      )}

      <Link href="/products" className={QUICK_LINK}>
        <span>Combo Home Gym</span>
        <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-black uppercase text-slate-950">
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
