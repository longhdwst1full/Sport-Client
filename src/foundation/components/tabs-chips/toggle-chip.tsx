import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Chip lọc bật/tắt (danh mục, loại bài viết…). Đang chọn = nền đỏ rất nhạt, viền và chữ đỏ (token
 * `selected`), như "surface brand light" của dragon-web-v2; chưa chọn = kiểu nút phụ. Một chỗ định kiểu cho
 * mọi nhóm chip thay vì mỗi feature tự viết (trước đây chip đang chọn có nơi đen, nơi đỏ có bóng).
 */
export const ToggleChip = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }>(
  function ToggleChip({ selected, className, type = 'button', ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={selected}
        className={twMerge(
          'inline-flex h-9 items-center rounded-full border px-4 text-xs font-semibold transition-colors focus-ring',
          selected
            ? 'border-selected-border bg-selected text-on-selected'
            : 'border-control-border bg-control text-on-control hover:border-control-border-strong hover:bg-control-hover',
          className,
        )}
        {...rest}
      />
    );
  },
);
