import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  CreditCard,
  Dumbbell,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { SiteHeader } from '@/widgets/site-header/site-header';
import { NewsletterForm } from '@/widgets/newsletter-form/newsletter-form';
import { FloatingContactBar } from '@/widgets/floating-contact-bar/floating-contact-bar';
import {
  STORE_CONFIG,
  STORE_CONTACT,
  STORE_SHOWROOMS,
  FOOTER_SHOP_LINKS,
  FOOTER_POLICY_LINKS,
} from '@/constants';

const SOCIAL_LINKS = [
  { icon: Facebook, href: STORE_CONTACT.facebookUrl, label: 'Facebook' },
  { icon: Instagram, href: STORE_CONTACT.youtubeUrl, label: 'YouTube' },
  { icon: MessageCircle, href: STORE_CONTACT.zaloUrl, label: 'Zalo' },
];

export function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>{children}</main>

      {/* Newsletter CTA Banner before footer */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-16 text-white border-t border-slate-800 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Mail className="size-6" />
          </div>
          <h2 className="mt-5 text-2xl font-black sm:text-3xl text-white">
            Nhận ưu đãi độc quyền & kiến thức thể thao
          </h2>
          <p className="mt-2.5 text-sm text-slate-400 sm:text-base">
            Đăng ký email để nhận thông tin sản phẩm mới, combo thiết bị giảm giá và bài viết hướng dẫn tập luyện từ HLV.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Chúng tôi cam kết bảo mật thông tin. Bạn có thể hủy nhận tin bất cứ lúc nào.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="border-t border-slate-800/80 bg-slate-950 px-6 py-14 text-white lg:px-10"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
          {/* Column 1: Brand + DKBD + Bo Cong Thuong + Social */}
          <div className="space-y-4">
            <div className="inline-flex rounded-xl bg-white px-3 py-2 shadow-md">
              <div className="relative h-9 w-44">
                <Image
                  src="/images/logo.png"
                  alt="Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <p className="max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
              Bảo An Sport chuyên cung cấp dụng cụ thể thao, thiết bị Gym, máy tập thể hình và phụ kiện chính hãng. Mẫu mã đa dạng, giao hàng toàn quốc, tư vấn tận tâm.
            </p>

            {/* Giay chung nhan DKKD */}
            <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3.5 text-xs text-slate-400 space-y-1.5">
              <div className="font-bold text-slate-300">Thông tin đăng ký doanh nghiệp:</div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Giấy chứng nhận ĐKKD số <strong className="text-emerald-400">01M8027099</strong> do phòng Tài chính - Kế hoạch quận Hoàng Mai, TP. Hà Nội cấp ngày 01/03/2021.
              </p>
            </div>

            {/* Da thong bao Bo Cong Thuong Badge */}
            <div className="pt-1">
              <a
                href="http://online.gov.vn/Home/WebDetails/79482?AspxAutoDetectCookieSupport=1"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 transition hover:opacity-90"
                title="Website đã thông báo Bộ Công Thương"
              >
                <div className="relative h-12 w-36 overflow-hidden rounded-lg bg-white/10 p-1 border border-white/15">
                  <Image
                    src="/images/bo-cong-thuong.png"
                    alt="Đã thông báo Bộ Công Thương"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  <span className="block font-bold text-slate-300 group-hover:text-emerald-400">
                    Bộ Công Thương
                  </span>
                  <span>Đã thông báo website TMĐT</span>
                </div>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-2.5 pt-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-emerald-500/50 hover:bg-emerald-500 hover:text-slate-950"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Sản phẩm nổi bật */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Sản phẩm nổi bật
            </h2>
            <div className="mt-4 grid gap-2 text-xs sm:text-sm text-slate-400">
              <Link className="transition hover:text-emerald-400" href="/category/ta-tay">
                Tạ tay - Tạ đơn
              </Link>
              <Link className="transition hover:text-emerald-400" href="/category/xa-don-xa-kep">
                Xà đơn - Xà kép
              </Link>
              <Link className="transition hover:text-emerald-400" href="/category/ghe-tap-ta">
                Ghế tập tạ đa năng
              </Link>
              <Link className="transition hover:text-emerald-400" href="/category/gian-ta-da-nang">
                Giàn tạ đa năng
              </Link>
              <Link className="transition hover:text-emerald-400" href="/category/dung-cu-bong-ban">
                Bàn bóng bàn thi đấu
              </Link>
              <Link className="transition hover:text-emerald-400" href="/category/may-chay-bo">
                Máy chạy bộ điện
              </Link>
              <Link className="transition hover:text-emerald-400" href="/category/xe-dap-tap">
                Xe đạp tập thể dục
              </Link>
            </div>
          </div>

          {/* Column 3: Thông tin & Chính sách */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Thông tin & Chính sách
            </h2>
            <div className="mt-4 grid gap-2 text-xs sm:text-sm text-slate-400">
              <Link className="transition hover:text-emerald-400" href="/#about">
                Giới thiệu Bảo An Sport
              </Link>
              <Link className="transition hover:text-emerald-400" href="/#benefits">
                Cam kết khách hàng 100%
              </Link>
              <Link className="transition hover:text-emerald-400" href="/news">
                Cẩm nang & Hướng dẫn tập luyện
              </Link>
              <Link className="transition hover:text-emerald-400" href="/contact">
                Vận chuyển & Lắp đặt 2H
              </Link>
              <Link className="transition hover:text-emerald-400" href="/profile">
                Tra cứu bảo hành điện tử
              </Link>
              <Link className="transition hover:text-emerald-400" href="/contact">
                Chính sách đổi trả 7 ngày
              </Link>
              <Link className="transition hover:text-emerald-400" href="/contact">
                Bảo mật thông tin khách hàng
              </Link>
            </div>
          </div>

          {/* Column 4: Showrooms & Liên hệ */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Hệ thống Showroom
            </h2>
            <div className="mt-4 space-y-3.5 text-xs text-slate-400">
              {/* Showroom HN */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-emerald-400" /> SHOWROOM HÀ NỘI
                  </strong>
                  <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    Trụ sở
                  </span>
                </div>
                <p className="text-slate-300">
                  Số 234 Định Công, Phường Định Công, Quận Hoàng Mai, Hà Nội
                </p>
                <div className="pt-1">
                  <a
                    href={`tel:${STORE_CONTACT.hotlineHnRaw}`}
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:underline"
                  >
                    <Phone className="size-3" />
                    Hotline: {STORE_CONTACT.hotlineHn}
                  </a>
                </div>
              </div>

              {/* Showroom HCM */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-emerald-400" /> SHOWROOM TP. HỒ CHÍ MINH
                  </strong>
                  <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    Chi nhánh
                  </span>
                </div>
                <p className="text-slate-300">
                  Số 34 Đường số 2, Phường 11, Cư xá Đài Ra Đa, Quận 6, TP. Hồ Chí Minh
                </p>
                <div className="pt-1">
                  <a
                    href={`tel:${STORE_CONTACT.hotlineHcmRaw}`}
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:underline"
                  >
                    <Phone className="size-3" />
                    Hotline: {STORE_CONTACT.hotlineHcm}
                  </a>
                </div>
              </div>

              {/* Email & Hours */}
              <div className="pt-1 space-y-1">
                <a
                  className="inline-flex items-center gap-1.5 transition hover:text-emerald-400"
                  href={`mailto:${STORE_CONTACT.email}`}
                >
                  <Mail className="size-3.5 text-emerald-400" />
                  Email: {STORE_CONTACT.email}
                </a>
                <p className="text-[11px] text-slate-500">
                  Mở cửa: 08:30 - 21:30 tất cả các ngày trong tuần (kể cả T7 & CN)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges + Payment */}
        <div className="mx-auto mt-12 max-w-7xl border-t border-slate-800/80 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-400" />
                Hàng chính hãng 100%
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="size-4 text-emerald-400" />
                Giao hàng & Lắp ráp 2H
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard className="size-4 text-emerald-400" />
                Thanh toán an toàn 100%
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-bold">VISA</span>
              <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-bold">MASTER</span>
              <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-bold">VietQR</span>
              <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-bold">MOMO</span>
              <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-bold">COD</span>
              <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-bold text-emerald-400">TRẢ GÓP 0%</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mx-auto mt-8 flex flex-col justify-between gap-2 max-w-7xl border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <div>
            © 2026 {STORE_CONFIG.name}. Chuyên cung cấp dụng cụ thể thao, thiết bị thể dục và thể hình chính hãng uy tín toàn quốc.
          </div>
          <div>
            Thời gian phục vụ: 08:30 - 21:30 tất cả các ngày trong tuần
          </div>
        </div>
      </footer>

      {/* Persistent Floating Quick Support Widget */}
      <FloatingContactBar />
    </div>
  );
}
