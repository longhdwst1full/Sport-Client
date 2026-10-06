import { twMerge } from 'tailwind-merge';

export const BUTTON_VARIANT = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800',
  outline: 'border border-slate-300 bg-white text-slate-900 hover:border-brand-600 hover:text-brand-700',
  ghost: 'text-slate-700 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  success: 'bg-success-600 text-white hover:bg-success-700',
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
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Chuỗi class của nút trong design system — hàm thuần để `<Link className={buttonVariants(...)}>` dùng
 * chung style với `<Button>`. `size` mặc định `md`, `variant` mặc định `primary`; `className` được
 * tailwind-merge ghi đè sau cùng.
 */
export function buttonVariants({ variant = 'primary', size = 'md', fullWidth = false, className }: ButtonVariantOptions = {}): string {
  return twMerge(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], fullWidth && 'w-full', className);
}
