import Link from 'next/link';
import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { STORE_CONTACT } from '@/shared/constants';

/**
 * Bộ nút liên hệ dùng chung (gọi hotline · Zalo · trang liên hệ) cho dải cuối trang, CTA trong bài
 * viết… Một chỗ sửa số/nhãn/kiểu nút; dữ liệu lấy từ `STORE_CONTACT` (RULE-TRUST-01).
 *
 * `tone="dark"` khi đặt trên nền tối (nút trắng + viền mờ), `light` trên nền sáng.
 */
export function ContactActions({
  tone = 'light',
  contactLabel = 'Đăng ký tư vấn',
  className = '',
}: {
  tone?: 'light' | 'dark';
  contactLabel?: string;
  className?: string;
}) {
  const dark = tone === 'dark';

  return (
    <div className={`flex flex-wrap gap-3 ${className}`.trim()}>
      {/* Hotline Button: Vibrant Red CTA */}
      <a
        href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-red-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-red-600/30 border border-red-500/30 hover:from-red-700 hover:to-red-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 focus-ring"
      >
        <Phone aria-hidden className="size-4 shrink-0 animate-phone-ring text-amber-300" />
        <span>{STORE_CONTACT.primaryHotline}</span>
      </a>

      {/* Zalo Button: Brand Zalo Blue */}
      <a
        href={STORE_CONTACT.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-[#0068FF] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#0068FF]/25 border border-[#0068FF]/30 hover:bg-[#0052cc] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 focus-ring"
      >
        <MessageCircle aria-hidden className="size-4 shrink-0" />
        <span>Nhắn Zalo</span>
        <span className="sr-only"> (mở tab mới)</span>
      </a>

      {/* Showroom / Contact Button */}
      <Link
        href="/contact"
        className={
          dark
            ? 'inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900/90 px-5 py-2.5 text-xs sm:text-sm font-bold text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 focus-ring'
            : 'inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-neutral-900 shadow-2xs hover:border-neutral-400 hover:bg-neutral-50 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 focus-ring'
        }
      >
        <MapPin aria-hidden className="size-4 shrink-0 text-red-500" />
        <span>{contactLabel}</span>
      </Link>
    </div>
  );
}
