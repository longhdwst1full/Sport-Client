import { twMerge } from 'tailwind-merge';

export const BUTTON_VARIANT = {
  primary:
    'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md shadow-red-600/25 hover:from-red-500 hover:via-rose-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-600/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] border-t border-white/25 transition-all duration-200',
  secondary:
    'bg-slate-100/90 text-slate-900 shadow-2xs hover:bg-slate-200 hover:text-slate-950 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] border border-slate-200/90 transition-all duration-200',
  outline:
    'border border-slate-300 bg-white text-slate-800 shadow-2xs hover:border-red-600 hover:text-red-600 hover:bg-red-50/50 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200',
  ghost: 'text-slate-700 hover:bg-red-50/50 hover:text-red-600 active:scale-[0.98] transition-all duration-200',
  danger:
    'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white shadow-md shadow-rose-600/25 hover:from-rose-500 hover:to-red-600 hover:shadow-lg hover:shadow-rose-600/35 hover:-translate-y-0.5 active:scale-[0.98] border-t border-white/20 transition-all duration-200',
  success:
    'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:scale-[0.98] border-t border-white/20 transition-all duration-200',
  warning:
    'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/25 hover:from-amber-300 hover:to-orange-400 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] border-t border-white/30 transition-all duration-200',
  /** Viền đỏ nhạt cho hành động huỷ/xoá không phải hành động chính. */
  dangerOutline:
    'border border-rose-200 bg-white text-rose-700 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-800 active:scale-[0.98] transition-all duration-200',
  /** Nút tối màu Onyx thể thao sang trọng */
  dark:
    'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white shadow-md shadow-slate-900/20 hover:from-slate-800 hover:to-black hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] border-t border-white/15 transition-all duration-200',
  /** Nút trên nền tối (hero, banner). */
  inverse:
    'bg-white text-slate-900 shadow-md shadow-black/10 hover:bg-slate-50 hover:text-red-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] border border-slate-200/50 transition-all duration-200',
  /** Nút dạng chữ/link: không nền, không chiều cao cố định (size bị bỏ qua). */
  link: 'h-auto px-0 text-red-600 font-bold underline-offset-4 hover:underline hover:text-red-700 transition-all duration-200',
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
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 select-none';

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
