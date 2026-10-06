import { twMerge } from 'tailwind-merge';

export const INPUT_SIZE = {
  /** 44px — vùng chạm tối thiểu. */
  md: 'h-11',
  lg: 'h-12',
} as const;

export type InputSize = keyof typeof INPUT_SIZE;

export interface InputVariantOptions {
  size?: InputSize;
  invalid?: boolean;
  className?: string;
}

// `text-base` trên mobile để iOS không tự zoom khi focus ô nhập (< 16px).
const INPUT_BASE =
  'block w-full rounded-xl border border-slate-300 bg-white px-3.5 text-base text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:border-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm';
const INPUT_INVALID = 'border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/30';

/** Chuỗi class ô nhập của design system (input/textarea/select). `size` mặc định `md`. */
export function inputVariants({ size = 'md', invalid = false, className }: InputVariantOptions = {}): string {
  return twMerge(INPUT_BASE, INPUT_SIZE[size], invalid && INPUT_INVALID, className);
}

/**
 * Quy tắc tương thích ngược chung: không truyền `size`/`invalid` mà có `className` → giữ nguyên className
 * của caller (passthrough như trước); ngược lại dùng `inputVariants`.
 */
export function resolveInputClassName(
  options: InputVariantOptions,
  extra?: string,
): string | undefined {
  const { size, invalid, className } = options;
  if (size === undefined && invalid === undefined && className) return className;
  return inputVariants({ size, invalid, className: extra ? twMerge(extra, className) : className });
}
