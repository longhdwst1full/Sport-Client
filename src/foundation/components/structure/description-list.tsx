import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type DescriptionItem = {
  /** Khoá ổn định cho React; mặc định dùng `label` khi là chuỗi. */
  key?: string;
  label: ReactNode;
  value: ReactNode;
  /** Class riêng cho `<dd>` (vd. màu giá). */
  valueClassName?: string;
  /** `false` thì bỏ qua dòng — tiện cho trường tuỳ chọn thay vì `cond && ...` rải trong JSX. */
  visible?: boolean;
};

const LAYOUT = {
  /** Nhãn trên, giá trị dưới; chia cột bằng `columns`. */
  stacked: { item: '', label: 'text-slate-500', value: 'font-semibold text-slate-900' },
  /** Nhãn trái, giá trị phải trên cùng một dòng (tóm tắt đơn, hoá đơn). */
  inline: {
    item: 'flex items-baseline justify-between gap-3',
    label: 'text-slate-500',
    value: 'text-right font-semibold text-slate-900',
  },
} as const;

const COLUMNS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3' } as const;

/**
 * Danh sách nhãn → giá trị (`<dl>/<dt>/<dd>`) dùng chung, thay cho các khối
 * `<div><dt>…</dt><dd>…</dd></div>` viết lặp ở từng feature.
 */
export function DescriptionList({
  items,
  layout = 'stacked',
  columns = 1,
  className,
  itemClassName,
  labelClassName,
  valueClassName,
}: {
  items: DescriptionItem[];
  layout?: keyof typeof LAYOUT;
  columns?: keyof typeof COLUMNS;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}) {
  const style = LAYOUT[layout];
  return (
    <dl className={twMerge('grid gap-x-4 gap-y-2', COLUMNS[columns], className)}>
      {items
        .filter((item) => item.visible !== false)
        .map((item, index) => (
          <div
            key={item.key ?? (typeof item.label === 'string' ? item.label : index)}
            className={twMerge(style.item, itemClassName)}
          >
            <dt className={twMerge(style.label, labelClassName)}>{item.label}</dt>
            <dd className={twMerge(style.value, valueClassName, item.valueClassName)}>{item.value}</dd>
          </div>
        ))}
    </dl>
  );
}
