import type { ComponentType, ReactNode, SVGProps } from 'react';
import { twMerge } from 'tailwind-merge';

export type IconListItem = {
  /** Khoá ổn định; mặc định dùng `label` khi là chuỗi. */
  key?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: ReactNode;
  /** Màu riêng của icon (vd. `text-success-400` cho dòng cam kết). */
  iconClassName?: string;
};

const COLUMNS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3', 4: 'grid-cols-2 lg:grid-cols-4' } as const;

/**
 * Danh sách "icon + nhãn" (cam kết, lợi ích, đặc điểm) thay cho các khối
 * `<div className="flex items-center gap-2"><Icon/><span/></div>` lặp ở từng feature.
 * Icon là trang trí nên luôn `aria-hidden`; nghĩa nằm ở nhãn.
 */
export function IconList({
  items,
  columns = 1,
  className,
  itemClassName,
  iconClassName,
}: {
  items: IconListItem[];
  columns?: keyof typeof COLUMNS;
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
}) {
  return (
    <ul className={twMerge('grid gap-3', COLUMNS[columns], className)}>
      {items.map(({ key, icon: Icon, label, iconClassName: itemIcon }, index) => (
        <li
          key={key ?? (typeof label === 'string' ? label : index)}
          className={twMerge('flex items-center gap-2', itemClassName)}
        >
          <Icon aria-hidden className={twMerge('size-4 shrink-0', iconClassName, itemIcon)} />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
