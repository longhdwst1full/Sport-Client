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
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Column 1: Brand + Social */}
          <div>
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
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              {STORE_CONFIG.description}
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

          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">Liên hệ</h2>
            <div className="mt-4 grid gap-2.5 text-sm text-slate-400">
              <a className="inline-flex items-center gap-2 transition hover:text-emerald-400" href={`tel:${STORE_CONTACT.hotlineHnRaw}`}>
                <Phone className="size-4 shrink-0 text-emerald-500" />
                Hotline HN: {STORE_CONTACT.hotlineHn}
              </a>
              <a className="inline-flex items-center gap-2 transition hover:text-emerald-400" href={`tel:${STORE_CONTACT.hotlineHcmRaw}`}>
                <Phone className="size-4 shrink-0 text-emerald-500" />
                Hotline HCM: {STORE_CONTACT.hotlineHcm}
              </a>
              <a className="inline-flex items-center gap-2 transition hover:text-emerald-400" href={`mailto:${STORE_CONTACT.email}`}>
                <Mail className="size-4 shrink-0 text-emerald-500" />
                {STORE_CONTACT.email}
              </a>
              <span className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>
                  <strong className="text-slate-300">HN:</strong> {STORE_SHOWROOMS[0]?.address.replace('Số ', '')}<br />
                  <strong className="text-slate-300">HCM:</strong> {STORE_SHOWROOMS[1]?.address.replace('Số ', '')}
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-[11px] text-slate-500">
                Mở cửa {STORE_CONTACT.openingHours}
              </span>
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
          © 2026 Bảo An Sport. Chuyên cung cấp dụng cụ thể thao, thiết bị thể dục và thể hình chính hãng.
        </div>
      </footer>

      {/* Persistent Floating Quick Support Widget */}
      <FloatingContactBar />
    </div>
  );
}
