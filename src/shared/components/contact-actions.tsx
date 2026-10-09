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
  // `whitespace-nowrap` + icon `shrink-0`: nút không vỡ chữ khi khung hẹp (cột bài viết), cả hàng tự xuống dòng.
  const focus = `${dark ? 'focus-ring-inverse' : 'focus-ring'} whitespace-nowrap`;
  const ghost = dark
    ? 'border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10'
    : '';

  return (
    <div className={`flex flex-wrap gap-3 ${className}`.trim()}>
      <a
        href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
        className={buttonVariants({ variant: dark ? 'inverse' : 'primary', className: `${focus} px-5` })}
      >
        <Phone aria-hidden className="size-4 shrink-0" /> {STORE_CONTACT.primaryHotline}
      </a>
      <a
        href={STORE_CONTACT.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: 'outline', className: `${focus} ${ghost} px-5` })}
      >
        <MessageCircle aria-hidden className="size-4 shrink-0" /> Nhắn Zalo
        <span className="sr-only"> (mở tab mới)</span>
      </a>
      <Link href="/contact" className={buttonVariants({ variant: 'outline', className: `${focus} ${ghost} px-5` })}>
        <MapPin aria-hidden className="size-4 shrink-0" /> {contactLabel}
      </Link>
    </div>
  );
}
