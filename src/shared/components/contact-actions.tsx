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
          variant: dark ? 'static' : 'primary',
          className: 'px-5 gap-2 text-xs sm:text-sm font-bold',
        })}
      >
        <Phone aria-hidden className="size-4 shrink-0 animate-phone-ring" />
        <span>{STORE_CONTACT.primaryHotline}</span>
      </a>

      {/* Zalo: màu nhận diện của Zalo (ngoại lệ bên thứ ba của RULE-DS-01), cùng khung/cỡ với nút còn lại. */}
      <a
        href={STORE_CONTACT.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({
          className: 'gap-2 bg-[#0068FF] px-5 text-xs font-bold text-white hover:bg-[#0052cc] active:bg-[#0047b3] sm:text-sm',
        })}
      >
        <MessageCircle aria-hidden className="size-4 shrink-0" />
        <span>Nhắn Zalo</span>
        <span className="sr-only"> (mở tab mới)</span>
      </a>

      <Link
        href="/contact"
        className={buttonVariants({
          variant: dark ? 'static' : 'secondary',
          className: 'gap-2 px-5 text-xs font-bold sm:text-sm',
        })}
      >
        <MapPin aria-hidden className="size-4 shrink-0" />
        <span>{contactLabel}</span>
      </Link>
    </div>
  );
}
