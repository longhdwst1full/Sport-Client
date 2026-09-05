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
      <section className="bg-ink px-6 py-16 text-white lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Mail className="mx-auto size-10 text-emerald-400" />
          <h2 className="mt-5 text-3xl font-black sm:text-4xl">
            Nhận ưu đãi & kiến thức tập luyện
          </h2>
          <p className="mt-3 text-white/60">
            Đăng ký email để nhận thông tin sản phẩm mới, combo giảm giá và bài viết hướng dẫn tập luyện.
          </p>
          <NewsletterForm />
          <p className="mt-4 text-xs text-white/40">
            Chúng tôi tôn trọng quyền riêng tư. Bạn có thể hủy đăng ký bất cứ lúc nào.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="border-t border-white/10 bg-[#0f1712] px-6 py-14 text-white lg:px-10"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Column 1: Brand + Social */}
          <div>
            <div className="flex items-center gap-3 text-xl font-black">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-400 text-ink">
                <Dumbbell className="size-5" />
              </span>
              DCTD SPORT
            </div>
            <p className="mt-5 max-w-md leading-7 text-white/60">
              Thiết bị tập luyện và đồ thể thao được tuyển chọn cho người Việt, từ góc tập tại nhà đến không gian chuyên nghiệp.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-xl bg-white/10 text-white/70 transition hover:bg-emerald-400 hover:text-ink"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Mua sắm */}
          <div>
            <h2 className="font-bold text-white">Mua sắm</h2>
            <div className="mt-4 grid gap-2.5 text-sm text-white/60">
              {FOOTER_SHOP_LINKS.map(({ label, href }) => (
                <Link key={label} className="transition hover:text-white" href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Chính sách */}
          <div>
            <h2 className="font-bold text-white">Hỗ trợ & Chính sách</h2>
            <div className="mt-4 grid gap-2.5 text-sm text-white/60">
              {FOOTER_POLICY_LINKS.map(({ label, href }) => (
                <Link key={label} className="transition hover:text-white" href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Liên hệ */}
          <div>
            <h2 className="font-bold text-white">Liên hệ</h2>
            <div className="mt-4 grid gap-3 text-sm text-white/60">
              <a className="inline-flex items-center gap-2 transition hover:text-white" href="tel:18000000">
                <Phone className="size-4 shrink-0 text-emerald-400" />
                Hotline: 1800 0000
              </a>
              <a className="inline-flex items-center gap-2 transition hover:text-white" href="mailto:contact@dctdsport.vn">
                <Mail className="size-4 shrink-0 text-emerald-400" />
                contact@dctdsport.vn
              </a>
              <span className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                TP. Hồ Chí Minh, Việt Nam
              </span>
              <Link
                className="inline-flex items-center gap-2 transition hover:text-white"
                href="/contact"
              >
                <ArrowUpRight className="size-4 shrink-0 text-emerald-400" />
                Tư vấn không gian tập
              </Link>
            </div>
          </div>
        </div>

        {/* Trust badges + Payment */}
        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-400" />
                Hàng chính hãng 100%
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="size-4 text-emerald-400" />
                Giao hàng toàn quốc
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard className="size-4 text-emerald-400" />
                Thanh toán an toàn
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="rounded-md border border-white/10 px-2.5 py-1 font-bold">VISA</span>
              <span className="rounded-md border border-white/10 px-2.5 py-1 font-bold">MC</span>
              <span className="rounded-md border border-white/10 px-2.5 py-1 font-bold">MOMO</span>
              <span className="rounded-md border border-white/10 px-2.5 py-1 font-bold">COD</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/40">
          © 2026 DCTD Sport. Nền tảng đang trong giai đoạn phát triển V1.
        </div>
      </footer>
    </div>
  );
}
