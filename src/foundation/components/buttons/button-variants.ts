import { twMerge } from 'tailwind-merge';

export const BUTTON_VARIANT = {
  primary:
    'bg-brand-600 bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-600/35 hover:-translate-y-0.5 hover:from-brand-500 hover:to-brand-600 active:translate-y-0 active:scale-[0.98] border-t border-white/20 transition-all',
  secondary:
    'bg-slate-900 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm shadow-slate-900/20 hover:shadow-md hover:shadow-slate-900/30 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 active:scale-[0.98] border-t border-white/10 transition-all',
  outline:
    'border border-slate-300 bg-white text-slate-800 shadow-2xs hover:border-brand-600 hover:text-brand-600 hover:bg-brand-50/70 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all',
  ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] transition-all',
  danger:
    'bg-rose-600 bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/25 hover:shadow-lg hover:shadow-rose-600/35 hover:-translate-y-0.5 active:scale-[0.98] border-t border-white/20 transition-all',
  success:
    'bg-success-600 bg-gradient-to-r from-success-600 to-success-700 text-white shadow-md shadow-success-600/25 hover:shadow-lg hover:shadow-success-600/35 hover:-translate-y-0.5 active:scale-[0.98] border-t border-white/20 transition-all',
  warning: 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 hover:bg-amber-400 hover:-translate-y-0.5 active:scale-[0.98] transition-all',
  /** Viền đỏ nhạt cho hành động huỷ/xoá không phải hành động chính. */
  dangerOutline: 'border border-rose-200 bg-white text-rose-700 hover:border-rose-400 hover:bg-rose-50 active:scale-[0.98] transition-all',
  /** Nút trên nền tối (hero, banner). */
  inverse: 'bg-white text-slate-900 shadow-md shadow-black/10 hover:bg-slate-50 hover:-translate-y-0.5 active:scale-[0.98] transition-all',
  /** Nút dạng chữ/link: không nền, không chiều cao cố định (size bị bỏ qua). */
  link: 'h-auto px-0 text-brand-700 underline-offset-4 hover:underline hover:text-brand-800',
} as const;

export const BUTTON_SIZE = {
  sm: 'h-9 px-3 text-sm',
  /** 44px — vùng chạm tối thiểu trên mobile. */
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'grid size-11 place-items-center',
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANT;
export type ButtonSize = keyof typeof BUTTON_SIZE;

export interface ButtonVariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 select-none';

/**
 * Chuỗi class của nút trong design system — hàm thuần để `<Link className={buttonVariants(...)}>` dùng
 * chung style với `<Button>`. `size` mặc định `md`, `variant` mặc định `primary`; `className` được
 * tailwind-merge ghi đè sau cùng.
 */
export function buttonVariants({ variant = 'primary', size = 'md', fullWidth = false, className }: ButtonVariantOptions = {}): string {
  // `link` không có khung nút nên bỏ class kích thước (chiều cao/padding) để nó nằm gọn trong dòng chữ.
  const sizeClass = variant === 'link' ? '' : BUTTON_SIZE[size];
  return twMerge(BUTTON_BASE, sizeClass, BUTTON_VARIANT[variant], fullWidth && 'w-full', className);
}
