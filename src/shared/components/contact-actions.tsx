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
      {/* Hotline Button: Primary solid action */}
      <a
        href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
        className={buttonVariants({
          variant: dark ? 'inverse' : 'primary',
          className: 'px-5 gap-2 text-xs sm:text-sm font-bold',
        })}
      >
        <Phone aria-hidden className="size-4 shrink-0 animate-phone-ring" />
        <span>{STORE_CONTACT.primaryHotline}</span>
      </a>

      {/* Zalo Button: Brand Zalo Blue */}
      <a
        href={STORE_CONTACT.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-[#0068FF] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#0068FF]/25 border border-[#0068FF]/30 hover:bg-[#0052cc] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 focus-ring"
      >
        <MessageCircle aria-hidden className="size-4 shrink-0" />
        <span>Nhắn Zalo</span>
        <span className="sr-only"> (mở tab mới)</span>
      </a>

      {/* Showroom / Contact Button */}
      <Link
        href="/contact"
        className={buttonVariants({
          variant: 'outline',
          className: dark
            ? 'border-neutral-700 bg-neutral-900/90 text-neutral-100 hover:bg-neutral-800 px-5 gap-2 text-xs sm:text-sm font-bold'
            : 'border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 px-5 gap-2 text-xs sm:text-sm font-bold',
        })}
      >
        <MapPin aria-hidden className="size-4 shrink-0 text-neutral-500" />
        <span>{contactLabel}</span>
      </Link>
    </div>
  );
}
