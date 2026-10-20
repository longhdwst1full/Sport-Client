import { twMerge } from 'tailwind-merge';

/**
 * Bộ nút theo mẫu dragon-web-v2 (`20-design-tokens.md` RULE-DS-04) — ít biến thể, màu đi qua token vai
 * trò (`--color-action`, `--color-control`… ở `globals.css`), không viết thẳng mã màu:
 * - `primary`: đỏ thương hiệu, chữ trắng (5.05:1) — MỌI hành động chính: Mua ngay, Đặt hàng, Tìm kiếm,
 *   Gửi, Thử lại. Mỗi vùng chỉ một nút primary.
 * - `secondary`: nền trắng, viền xám ấm, chữ than — hành động phụ: Thêm vào giỏ, Xem thêm, Huỷ bỏ chọn.
 * - `static`: nút sáng đặt trên nền tối (hero, banner, khối tối, footer).
 * - `ghost` / `link`: nút chữ, không khung ("Xem tất cả →").
 * - `danger` / `dangerOutline`: chỉ cho huỷ/xoá.
 * Nền đặc, không gradient; không ghi đè màu bằng `className` — thiếu kiểu thì thêm biến thể ở đây.
 */
export const BUTTON_VARIANT = {
  primary: 'bg-action text-on-action hover:bg-action-hover active:bg-action-pressed',
  secondary:
    'border border-control-border bg-control text-on-control hover:border-control-border-strong hover:bg-control-hover active:bg-control-pressed',
  static: 'bg-white text-on-control hover:bg-control-hover active:bg-control-pressed',
  ghost: 'text-on-control hover:bg-control-hover active:bg-control-pressed',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  /** Viền đỏ nhạt cho hành động huỷ/xoá không phải hành động chính. */
  dangerOutline: 'border border-red-200 bg-white text-red-700 hover:border-red-400 hover:bg-red-50 hover:text-red-800',
  /** Nút dạng chữ/link: không nền, không chiều cao cố định (size bị bỏ qua). */
  link: 'h-auto px-0 text-on-control underline-offset-4 hover:underline',
} as const;

export const BUTTON_SIZE = {
  sm: 'h-9 px-3 text-sm',
  /** 44px — vùng chạm tối thiểu trên mobile. */
  md: 'h-11 px-4 text-sm',
  /** 48px — nút chuyển đổi. */
  lg: 'h-12 px-6 text-[15px]',
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

/**
 * Bo 16px (thẻ) như Dragon; icon trong nút luôn 16px, không co. Disabled dùng MỘT kiểu chung (nền/ chữ xám
 * ấm) thay vì làm mờ — nút mờ 50% trên ảnh/nền màu đọc không ra.
 */
const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-colors duration-150 active:scale-[0.98] focus-ring select-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-control-disabled disabled:text-on-control-disabled';
/** Nút chữ không có nền: disabled chỉ đổi màu chữ. */
const LINK_DISABLED = 'disabled:bg-transparent';

/**
 * Chuỗi class của nút trong design system — hàm thuần để `<Link className={buttonVariants(...)}>` dùng
 * chung style với `<Button>`. `size` mặc định `md`, `variant` mặc định `primary`; `className` được
 * tailwind-merge ghi đè sau cùng.
 */
export function buttonVariants({ variant = 'primary', size = 'md', fullWidth = false, className }: ButtonVariantOptions = {}): string {
  // `link` không có khung nút nên bỏ class kích thước (chiều cao/padding) để nó nằm gọn trong dòng chữ.
  const sizeClass = variant === 'link' ? '' : BUTTON_SIZE[size];
  return twMerge(
    BUTTON_BASE,
    sizeClass,
    BUTTON_VARIANT[variant],
    (variant === 'link' || variant === 'ghost') && LINK_DISABLED,
    fullWidth && 'w-full',
    className,
  );
}
