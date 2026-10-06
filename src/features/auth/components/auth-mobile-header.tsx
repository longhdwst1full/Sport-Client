import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Mobile top bar + desktop back link shared verbatim between login and register pages.
 */
export function AuthMobileHeader() {
  return (
    <>
      {/* Mobile Header Brand & Back */}
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <Link href="/" aria-label="Bảo An Sport — Trang chủ" className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          <div className="relative h-9 w-40">
            <Image
              src="/images/logo.png"
              alt="Bảo An Sport"
              fill
              priority
              sizes="160px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          <span>Trang chủ</span>
        </Link>
      </div>

      {/* Desktop Back Link */}
      <div className="hidden lg:block mb-5">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Quay lại trang chủ mua sắm</span>
        </Link>
      </div>
    </>
  );
}
