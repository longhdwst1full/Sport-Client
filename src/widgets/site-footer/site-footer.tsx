import Image from 'next/image';
import {
  CreditCard,
  Facebook,
  Mail,
  MessageCircle,
  ShieldCheck,
  Truck,
  Youtube,
} from 'lucide-react';
import { STORE_CONFIG, STORE_CONTACT, STORE_SHOWROOMS } from '@/shared/constants';
import { FooterLinkColumn, type FooterLinkItem } from './footer-link-column';
import { ShowroomCard, type ShowroomCardData } from './showroom-card';

const SOCIAL_LINKS = [
  { icon: Facebook, href: STORE_CONTACT.facebookUrl, label: 'Facebook' },
  { icon: Youtube, href: STORE_CONTACT.youtubeUrl, label: 'YouTube' },
  { icon: MessageCircle, href: STORE_CONTACT.zaloUrl, label: 'Zalo' },
];

/** Dự phòng khi layout không lấy được danh mục từ API. */
const FALLBACK_FEATURED_PRODUCT_LINKS: FooterLinkItem[] = [
  { label: 'Tạ tay - Tạ đơn', href: '/category/ta-tay' },
  { label: 'Xà đơn - Xà kép', href: '/category/xa-don-xa-kep' },
  { label: 'Ghế tập tạ đa năng', href: '/category/ghe-tap-ta' },
  { label: 'Giàn tạ đa năng', href: '/category/gian-ta-da-nang' },
  { label: 'Bàn bóng bàn thi đấu', href: '/category/dung-cu-bong-ban' },
  { label: 'Máy chạy bộ điện', href: '/category/may-chay-bo' },
  { label: 'Xe đạp tập thể dục', href: '/category/xe-dap-tap' },
];

const FEATURED_LINK_LIMIT = 7;

const POLICY_LINKS: FooterLinkItem[] = [
  { label: 'Giới thiệu Bảo An Sport', href: '/#about' },
  { label: 'Cam kết khách hàng', href: '/chinh-sach/cam-ket-khach-hang' },
  { label: 'Cẩm nang & Hướng dẫn tập luyện', href: '/news' },
  { label: 'Vận chuyển & giao hàng', href: '/chinh-sach/van-chuyen-giao-hang' },
  { label: 'Chính sách bảo hành', href: '/chinh-sach/chinh-sach-bao-hanh' },
  { label: 'Chính sách đổi trả', href: '/chinh-sach/chinh-sach-doi-tra' },
  { label: 'Bảo mật thông tin khách hàng', href: '/chinh-sach/bao-mat-thong-tin-khach-hang' },
  { label: 'Tất cả thông tin & chính sách', href: '/chinh-sach' },
];

// NAP lấy từ một nguồn (`STORE_SHOWROOMS`) để footer, menu di động và trang liên hệ không lệch nhau.
const SHOWROOMS: ShowroomCardData[] = STORE_SHOWROOMS.map((showroom) => ({
  name: `Showroom ${showroom.city}`,
  badge: showroom.isHeadquarter ? 'Trụ sở' : 'Chi nhánh',
  address: showroom.address,
  hotlineRaw: showroom.phoneRaw,
  hotlineDisplay: showroom.phone,
}));

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Hàng chính hãng 100%' },
  { icon: Truck, label: 'Giao hàng & lắp đặt toàn quốc' },
  { icon: CreditCard, label: 'Thanh toán an toàn 100%' },
];

// CONTRACT: chỉ liệt kê phương thức checkout thật sự nhận (BANK_TRANSFER/VietQR, COD, VNPAY).
// Bản trước ghi VISA/MASTER/MOMO/"Trả góp 0%" dù không có luồng nào xử lý.
const PAYMENT_METHODS = ['Chuyển khoản VietQR', 'COD', 'VNPay'];

/** Mục tối thiểu footer cần từ danh mục (khớp cấu trúc `MegaMenuEntry`, không phụ thuộc feature). */
export interface FooterCategoryLink {
  label: string;
  href: string;
}

export function SiteFooter({ categories }: { categories?: readonly FooterCategoryLink[] } = {}) {
  // Cùng nguồn danh mục với mega-menu (đã lọc nhánh rỗng) để link footer không trỏ tới slug không còn.
  const featuredLinks: FooterLinkItem[] =
    categories && categories.length > 0
      ? categories.slice(0, FEATURED_LINK_LIMIT).map(({ label, href }) => ({ label, href }))
      : FALLBACK_FEATURED_PRODUCT_LINKS;

  return (
    <footer
      id="about"
      className="border-t border-slate-800/80 bg-slate-950 px-4 py-10 sm:py-12 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr] [&>*]:min-w-0">
        <div className="space-y-4">
          <div className="inline-flex rounded-xl bg-white px-3 py-2 shadow-md">
            <div className="relative h-9 w-44">
              <Image
                src="/images/logo.png"
                alt="Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
                fill
                sizes="176px"
                className="object-contain"
              />
            </div>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            Bảo An Sport chuyên cung cấp dụng cụ thể thao, thiết bị Gym, máy tập thể hình và phụ kiện chính hãng. Mẫu mã đa dạng, giao hàng toàn quốc, tư vấn tận tâm.
          </p>

          <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-slate-200 text-xs sm:text-[13px]">Thông tin đăng ký doanh nghiệp:</div>
            <p className="text-xs sm:text-[12.5px] leading-relaxed text-slate-400">
              Giấy chứng nhận ĐKKD số <span className="font-bold text-brand-400">01M8027099</span> do phòng Tài chính - Kế hoạch quận Hoàng Mai, TP. Hà Nội cấp ngày 01/03/2021.
            </p>
          </div>

          <div className="pt-1">
            <a
              href="http://online.gov.vn/Home/WebDetails/79482?AspxAutoDetectCookieSupport=1"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-lg transition hover:opacity-90 focus-visible:outline-white"
              title="Website đã thông báo Bộ Công Thương"
            >
              <div className="relative h-12 w-36 overflow-hidden rounded-lg bg-white/10 p-1 border border-white/15">
                <Image
                  src="/images/bo-cong-thuong.png"
                  alt="Đã thông báo Bộ Công Thương"
                  fill
                  sizes="144px"
                  className="object-contain p-1"
                />
              </div>
              <div className="text-xs text-slate-300 leading-tight">
                <span className="block font-bold text-slate-200 group-hover:text-brand-400">
                  Bộ Công Thương
                </span>
                <span className="text-slate-400">Đã thông báo website TMĐT</span>
              </div>
            </a>
          </div>

          <div className="flex gap-2.5 pt-2">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (mở tab mới)`}
                className="grid size-11 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-brand-600 hover:bg-brand-600 hover:text-white focus-visible:outline-white"
              >
                <Icon aria-hidden className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterLinkColumn title="Sản phẩm nổi bật" links={featuredLinks} />
        <FooterLinkColumn title="Thông tin & Chính sách" links={POLICY_LINKS} />

        <section aria-labelledby="footer-showrooms">
          <h2 id="footer-showrooms" className="text-sm font-bold uppercase tracking-wider text-white">
            Hệ thống Showroom
          </h2>
          <div className="mt-4 space-y-3.5 text-sm text-slate-300">
            {SHOWROOMS.map((showroom) => (
              <ShowroomCard key={showroom.name} showroom={showroom} />
            ))}

            <div className="pt-1 space-y-1.5 text-sm text-slate-300">
              <a
                className="inline-flex min-h-11 items-center gap-2 break-all transition hover:text-brand-400"
                href={`mailto:${STORE_CONTACT.email}`}
              >
                <Mail aria-hidden className="size-4 shrink-0 text-brand-400" />
                Email: {STORE_CONTACT.email}
              </a>
              <p className="text-xs text-slate-400">Mở cửa: {STORE_CONTACT.openingHours}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-slate-800/80 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-300">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2">
                <Icon aria-hidden className="size-4.5 text-brand-400" />
                {label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-bold text-slate-300"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex flex-col justify-between gap-3 max-w-7xl border-t border-slate-800/80 pt-6 text-xs sm:text-sm text-slate-400 sm:flex-row sm:items-center">
        <div>
          © {new Date().getFullYear()} {STORE_CONFIG.legalName} ({STORE_CONFIG.name}). Chuyên cung cấp dụng cụ thể thao, thiết bị thể dục và thể hình chính hãng uy tín toàn quốc.
        </div>
        <div>
          Thời gian phục vụ: {STORE_CONTACT.openingHours}
        </div>
      </div>
    </footer>
  );
}
