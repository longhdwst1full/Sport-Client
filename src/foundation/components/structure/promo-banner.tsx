import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Banner quảng bá dạng ảnh nền + lớp phủ chữ (tiêu đề, mô tả, CTA), là link khi có `href`.
 * Chỉ nhận dữ liệu đã map và ảnh đã render (`media`); khung (tỉ lệ, bo góc, ring) do caller truyền
 * qua `className` vì mỗi vị trí đặt banner khác nhau.
 *
 * a11y: banner chỉ có ảnh (không tiêu đề/mô tả) thì link lấy `ctaLabel` làm `aria-label`.
 */
export function PromoBanner({
  href,
  media,
  title,
  subtitle,
  ctaLabel,
  className,
}: {
  href?: string | null;
  /** Ảnh nền (thường `fill`), render trước lớp phủ. */
  media: ReactNode;
  title?: string | null;
  subtitle?: string | null;
  /** Nhãn CTA; chỉ hiện khi có `href`. */
  ctaLabel: string;
  className?: string;
}) {
  const hasText = Boolean(title || subtitle);
  const body = (
    <>
      {media}
      {hasText && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 py-6 text-white sm:px-10">
            <div className="max-w-xl">
              {title && <h2 className="line-clamp-2 text-xl font-bold leading-tight sm:text-2xl">{title}</h2>}
              {subtitle && <p className="mt-2 line-clamp-2 text-xs text-neutral-300 sm:text-sm">{subtitle}</p>}
              {href && (
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-neutral-300 group-hover:underline sm:text-sm">
                  {ctaLabel}
                  <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-1" />
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );

  return href ? (
    <Link href={href} className={className} aria-label={hasText ? undefined : ctaLabel}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
