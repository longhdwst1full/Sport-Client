import Link from 'next/link';
import { isNavHrefActive } from './nav-active';

interface HeaderQuickLinksProps {
  pathname: string | null;
  hasFlashSaleCampaign: boolean;
  flashSaleMaxDiscountPercent: number | null | undefined;
}

const QUICK_LINK_BASE =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all focus-ring-tight xl:px-3 xl:py-1.5 xl:text-sm';
const QUICK_LINK = `${QUICK_LINK_BASE} text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950`;
/** Cùng kiểu "trang đang xem" với `DesktopMegaMenu` (nền brand-50, chữ brand-700, vạch đỏ dưới). */
const QUICK_LINK_CURRENT = `${QUICK_LINK_BASE} relative bg-brand-50 font-bold text-brand-700 after:pointer-events-none after:absolute after:inset-x-3 after:-bottom-[7px] after:h-0.5 after:rounded-full after:bg-brand-600`;

function quickLinkClass(pathname: string | null, href: string): string {
  return isNavHrefActive(pathname, href) ? QUICK_LINK_CURRENT : QUICK_LINK;
}

export function HeaderQuickLinks({
  pathname,
  hasFlashSaleCampaign,
  flashSaleMaxDiscountPercent,
}: HeaderQuickLinksProps) {
  return (
    <div className="flex shrink-0 items-center gap-1 text-sm font-semibold xl:gap-1.5">
      {/* Chỉ mời khách vào Flash Sale khi thật sự có chương trình đang chạy */}
      {hasFlashSaleCampaign && (
        <Link
          href="/flash-sale"
          aria-current={isNavHrefActive(pathname, '/flash-sale') ? 'page' : undefined}
          className={`mr-1 inline-flex ${
            isNavHrefActive(pathname, '/flash-sale') ? 'ring-2 ring-brand-300 ring-offset-2' : ''
          } items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-3 py-1 text-xs font-bold text-white shadow-xs transition hover:from-brand-700 hover:to-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 xl:px-3.5 xl:py-1.5 xl:text-sm`}
        >
          <span>⚡ Flash Sale</span>
          {flashSaleMaxDiscountPercent ? (
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-3xs font-bold uppercase text-white">
              -{flashSaleMaxDiscountPercent}%
            </span>
          ) : null}
        </Link>
      )}

      {/* Chưa có danh mục/bộ lọc combo trong API: nhãn "Combo Home Gym" cũ dẫn tới toàn bộ sản phẩm.
          Không tô "đang xem": mục "Sản phẩm" bên trái đã tô cho /products, tô cả hai là thừa. */}
      <Link href="/products" className={QUICK_LINK}>
        <span>Tất cả sản phẩm</span>
      </Link>

      <Link
        href="/news"
        aria-current={isNavHrefActive(pathname, '/news') ? 'page' : undefined}
        className={`hidden xl:inline-flex ${quickLinkClass(pathname, '/news')}`}
      >
        <span className="hidden 2xl:inline">Cẩm nang tập luyện</span>
        <span className="2xl:hidden">Cẩm nang</span>
      </Link>

      <Link
        href="/contact"
        aria-current={isNavHrefActive(pathname, '/contact') ? 'page' : undefined}
        className={`hidden 2xl:inline-flex ${quickLinkClass(pathname, '/contact')}`}
      >
        Liên hệ
      </Link>
    </div>
  );
}
