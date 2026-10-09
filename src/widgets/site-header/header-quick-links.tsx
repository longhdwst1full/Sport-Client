import Link from 'next/link';

interface HeaderQuickLinksProps {
  hasFlashSaleCampaign: boolean;
  flashSaleMaxDiscountPercent: number | null | undefined;
}

const QUICK_LINK =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-100 hover:text-neutral-950 focus-ring-tight xl:px-3 xl:py-1.5 xl:text-sm';

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
          className="mr-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-3 py-1 text-xs font-bold text-white shadow-xs transition hover:from-brand-700 hover:to-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 xl:px-3.5 xl:py-1.5 xl:text-sm"
        >
          <span>⚡ Flash Sale</span>
          {flashSaleMaxDiscountPercent ? (
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-3xs font-bold uppercase text-white">
              -{flashSaleMaxDiscountPercent}%
            </span>
          ) : null}
        </Link>
      )}

      {/* Chưa có danh mục/bộ lọc combo trong API: nhãn "Combo Home Gym" cũ dẫn tới toàn bộ sản phẩm. */}
      <Link href="/products" className={QUICK_LINK}>
        <span>Tất cả sản phẩm</span>
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
