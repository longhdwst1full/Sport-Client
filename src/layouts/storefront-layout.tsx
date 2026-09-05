import type { ReactNode } from 'react';
import Link from 'next/link';
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

const FOOTER_SHOP_LINKS = [
  { label: 'Theo môn thể thao', href: '/category' },
  { label: 'Sản phẩm nổi bật', href: '/#products' },
  { label: 'Combo Home Gym', href: '/#products' },
  { label: 'Kiến thức luyện tập', href: '/news' },
  { label: 'Hệ thống Showroom', href: '/contact' },
];

const FOOTER_POLICY_LINKS = [
  { label: 'Chính sách vận chuyển', href: '/#benefits' },
  { label: 'Chính sách đổi trả', href: '/#benefits' },
  { label: 'Chính sách bảo hành', href: '/#benefits' },
  { label: 'Câu hỏi thường gặp', href: '/#about' },
  { label: 'Điều khoản sử dụng', href: '/#about' },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: MessageCircle, href: '#', label: 'Zalo' },
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
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Column 1: Brand + Social */}
          <div>
            <div className="flex items-center gap-3 text-xl font-black">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20">
                <Dumbbell className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white leading-none">
                  DCTD <span className="text-emerald-500">SPORT</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  Performance Gear
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              Thiết bị tập luyện và dụng cụ thể thao cao cấp cho người Việt, từ góc tập tại nhà đến không gian chuyên nghiệp.
            </p>
            <div className="mt-6 flex gap-2.5">
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

          {/* Column 2: Mua sắm */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">Mua sắm</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-400">
              {FOOTER_SHOP_LINKS.map(({ label, href }) => (
                <Link key={label} className="transition hover:text-emerald-400" href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Chính sách */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">Hỗ trợ & Chính sách</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-400">
              {FOOTER_POLICY_LINKS.map(({ label, href }) => (
                <Link key={label} className="transition hover:text-emerald-400" href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Liên hệ */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">Liên hệ</h2>
            <div className="mt-4 grid gap-2.5 text-sm text-slate-400">
              <a className="inline-flex items-center gap-2 transition hover:text-emerald-400" href="tel:18000000">
                <Phone className="size-4 shrink-0 text-emerald-500" />
                Hotline: 1800 0000
              </a>
              <a className="inline-flex items-center gap-2 transition hover:text-emerald-400" href="mailto:contact@dctdsport.vn">
                <Mail className="size-4 shrink-0 text-emerald-500" />
                contact@dctdsport.vn
              </a>
              <span className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                Hà Nội & TP. Hồ Chí Minh, Việt Nam
              </span>
              <Link
                className="inline-flex items-center gap-2 text-emerald-400 transition hover:underline"
                href="/contact"
              >
                <ArrowUpRight className="size-4 shrink-0" />
                Đăng ký tư vấn góc tập
              </Link>
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
              <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-bold">MOMO</span>
              <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-bold">COD</span>
              <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-bold">TRẢ GÓP 0%</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mx-auto mt-8 max-w-7xl border-t border-slate-800/80 pt-6 text-xs text-slate-500">
          © 2026 DCTD Sport. Nền tảng thương mại điện tử dụng cụ thể thao cao cấp.
        </div>
      </footer>
    </div>
  );
}
