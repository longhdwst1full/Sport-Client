import Image from 'next/image';
import {
  CreditCard,
  Mail,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { STORE_CONFIG, STORE_CONTACT, STORE_POLICY_PAGES, STORE_SHOWROOMS } from '@/shared/constants';
import { FOOTER_HEADING_CLASS, FooterLinkColumn, type FooterLinkItem } from './footer-link-column';
import { ShowroomCard, type ShowroomCardData } from './showroom-card';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.49 10.272v-.45h1.347v6.322h-.77a.576.576 0 0 1-.577-.573v.001a3.27 3.27 0 0 1-1.938.632a3.284 3.284 0 0 1-3.284-3.282a3.284 3.284 0 0 1 3.284-3.282a3.27 3.27 0 0 1 1.937.632zM6.919 7.79v.205c0 .382-.051.694-.3 1.06l-.03.034a8 8 0 0 0-.242.285L2.024 14.8h4.895v.768a.576.576 0 0 1-.577.576H0v-.362c0-.443.11-.641.25-.847L4.858 9.23H.192V7.79zm8.551 8.354a.48.48 0 0 1-.48-.48V7.79h1.441v8.354zM20.693 9.6a3.306 3.306 0 1 1 .002 6.612a3.306 3.306 0 0 1-.002-6.612m-10.14 5.253a1.932 1.932 0 1 0 0-3.863a1.932 1.932 0 0 0 0 3.863m10.14-.003a1.945 1.945 0 1 0 0-3.89a1.945 1.945 0 0 0 0 3.89" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    icon: FacebookIcon,
    href: STORE_CONTACT.facebookUrl,
    label: 'Facebook',
    className: 'hover:border-[#1877F2] hover:bg-[#1877F2] hover:shadow-[#1877F2]/25',
  },
  {
    icon: YoutubeIcon,
    href: STORE_CONTACT.youtubeUrl,
    label: 'YouTube',
    className: 'hover:border-[#FF0000] hover:bg-[#FF0000] hover:shadow-[#FF0000]/25',
  },
  {
    icon: ZaloIcon,
    href: STORE_CONTACT.zaloUrl,
    label: 'Zalo',
    className: 'hover:border-[#0068FF] hover:bg-[#0068FF] hover:shadow-[#0068FF]/25',
  },
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
  // CMS chưa có bài ABOUT; `/#about` cũ trỏ vào chính footer. Có bài giới thiệu thì đổi link về đó.
  { label: 'Liên hệ & showroom', href: '/contact' },
  { label: 'Cam kết khách hàng', href: '/chinh-sach/cam-ket-khach-hang' },
  { label: 'Cẩm nang & Hướng dẫn tập luyện', href: '/news' },
  { label: 'Vận chuyển & giao hàng', href: '/chinh-sach/van-chuyen-giao-hang' },
  { label: 'Chính sách bảo hành', href: '/chinh-sach/chinh-sach-bao-hanh' },
  { label: 'Chính sách đổi trả', href: '/chinh-sach/chinh-sach-doi-tra' },
  { label: 'Bảo mật thông tin khách hàng', href: STORE_POLICY_PAGES.PRIVACY.href },
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

// CONTRACT: chỉ liệt kê phương thức checkout Storefront thật sự nhận: COD và VNPAY (QR/ATM/thẻ); BANK_TRANSFER chỉ dùng ở POS.
// Bản trước ghi VISA/MASTER/MOMO/"Trả góp 0%" dù không có luồng nào xử lý.
const PAYMENT_METHODS = ['COD', 'VNPay (QR · ATM · Thẻ)'];

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
      className="relative bg-neutral-950 px-4 pb-8 pt-12 text-white sm:px-6 sm:pt-14 lg:px-10"
    >
      <div aria-hidden="true" className="brand-gradient-bar absolute inset-x-0 top-0 h-1" />

      {/* Mobile 2 cột: hai cột link đứng cạnh nhau; khối thương hiệu và showroom chiếm cả hàng. */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr] [&>*]:min-w-0">
        <div className="col-span-2 space-y-4 lg:col-span-1">
          <div className="inline-flex rounded-xl bg-white px-3 py-2">
            <Image
              src="/images/logo.png"
              alt="Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
              width={176}
              height={36}
              className="h-9 w-auto object-contain"
            />
          </div>

          <p className="max-w-md text-sm leading-relaxed text-neutral-400">
            Dụng cụ thể thao, thiết bị gym và phụ kiện chính hãng. Giao hàng toàn quốc, tư vấn tận tâm.
          </p>

          <div className="space-y-1 border-l-2 border-neutral-800 pl-3 text-xs leading-relaxed text-neutral-400">
            <div className="font-semibold text-neutral-200">Thông tin đăng ký doanh nghiệp</div>
            <p>
              Giấy chứng nhận ĐKKD số <span className="font-semibold text-white">01M8027099</span> do phòng Tài chính - Kế hoạch quận Hoàng Mai, TP. Hà Nội cấp ngày 01/03/2021.
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
              <div className="flex h-12 w-36 items-center justify-center overflow-hidden rounded-lg border border-neutral-800 bg-white/5 p-1">
                <Image
                  src="/images/bo-cong-thuong.png"
                  alt="Đã thông báo Bộ Công Thương"
                  width={144}
                  height={48}
                  className="max-h-10 w-auto object-contain"
                />
              </div>
              <div className="text-xs text-neutral-300 leading-tight">
                <span className="block font-bold text-white group-hover:text-neutral-200">
                  Bộ Công Thương
                </span>
                <span className="text-neutral-400">Đã thông báo website TMĐT</span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2.5 pt-3">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label, className }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (mở tab mới)`}
                className={`grid size-10 place-items-center rounded-full border border-neutral-800 bg-neutral-900/90 text-neutral-300 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:text-white hover:shadow-lg focus-ring-inverse ${className}`}
              >
                <Icon className="size-4.5" />
              </a>
            ))}
          </div>
        </div>

        <FooterLinkColumn title="Sản phẩm nổi bật" links={featuredLinks} />
        <FooterLinkColumn title="Thông tin & Chính sách" links={POLICY_LINKS} />

        <section aria-labelledby="footer-showrooms" className="col-span-2 lg:col-span-1">
          <h2 id="footer-showrooms" className={FOOTER_HEADING_CLASS}>
            Hệ thống Showroom
          </h2>
          <div className="mt-4 space-y-3.5 text-sm text-neutral-300">
            {SHOWROOMS.map((showroom) => (
              <ShowroomCard key={showroom.name} showroom={showroom} />
            ))}

            <div className="pt-1 space-y-1.5 text-sm text-neutral-300 font-medium">
              <a
                className="inline-flex min-h-11 items-center gap-2 break-all transition text-neutral-200 hover:text-white hover:underline"
                href={`mailto:${STORE_CONTACT.email}`}
              >
                <Mail aria-hidden className="size-4 shrink-0 text-brand-400" />
                Email: {STORE_CONTACT.email}
              </a>
              <p className="text-xs text-neutral-400">Mở cửa: {STORE_CONTACT.openingHours}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-neutral-800 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-neutral-200 sm:text-sm">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2">
                <Icon aria-hidden className="size-5 text-brand-400" />
                {label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-neutral-300">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col justify-between gap-3 border-t border-neutral-800 pt-6 text-xs text-neutral-400 sm:flex-row sm:items-center">
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
