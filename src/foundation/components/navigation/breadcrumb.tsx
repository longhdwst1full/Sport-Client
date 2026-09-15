import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  /** Bỏ trống ở mục cuối: trang hiện tại không tự liên kết tới chính nó. */
  href?: string;
}

/**
 * Đường dẫn phân cấp dùng chung cho mọi trang công khai.
 *
 * Thuộc `foundation` vì chỉ nhận nhãn và đường dẫn đã dựng sẵn — không biết sản phẩm,
 * danh mục hay bài viết là gì (`13-foundation-components.md`).
 */
/** `inverted` dành cho trang nền tối; mặc định là nền sáng. */
export type BreadcrumbTone = 'default' | 'inverted';

const TONE_CLASSES: Record<BreadcrumbTone, { root: string; link: string; current: string }> = {
  default: {
    root: 'text-stone-500',
    link: 'transition hover:text-[var(--dc-primary-700)]',
    current: 'font-bold text-ink',
  },
  inverted: {
    root: 'text-slate-400',
    link: 'transition hover:text-white',
    current: 'font-bold text-white',
  },
};

export function Breadcrumb({
  items,
  className = '',
  tone = 'default',
}: {
  items: BreadcrumbItem[];
  className?: string;
  tone?: BreadcrumbTone;
}) {
  const toneClasses = TONE_CLASSES[tone];
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-xs font-semibold ${toneClasses.root} ${className}`.trim()}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="size-3 text-stone-400" aria-hidden />}
              {item.href && !isLast ? (
                <Link href={item.href} className={toneClasses.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={toneClasses.current} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
