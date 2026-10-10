import { forwardRef, type FormEvent, type InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from '../buttons';

export interface SearchBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onSubmit'> {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  /** Mặc định xoá về chuỗi rỗng. */
  onClear?: () => void;
  submitLabel?: string;
  /** Icon kính lúp trong nút Tìm (header có, trang kết quả không). */
  submitIcon?: boolean;
  /** Ghi đè class của form / icon đầu ô (trang kết quả không đổi màu icon khi focus). */
  className?: string;
  iconClassName?: string;
}

/**
 * Ô tìm kiếm dạng viên thuốc (icon · ô nhập · nút xoá · nút Tìm) dùng chung cho header (có autocomplete)
 * và trang kết quả. Class giữ đúng như hai bản viết tay trước đây để gom code không đổi giao diện;
 * thuộc tính combobox/aria/onKeyDown truyền thẳng xuống `<input>`.
 */
export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(function SearchBox(
  {
    value,
    onValueChange,
    onSubmit,
    onClear,
    submitLabel = 'Tìm kiếm',
    submitIcon = true,
    className,
    iconClassName,
    'aria-label': ariaLabel = 'Tìm kiếm sản phẩm',
    ...inputProps
  },
  ref,
) {
  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={twMerge(
        'group relative flex items-center overflow-hidden rounded-full border border-neutral-300 bg-neutral-50/80 hover:border-neutral-400 hover:bg-white transition-all duration-200 focus-within:border-neutral-800 focus-within:bg-white focus-within:ring-4 focus-within:ring-neutral-900/10 shadow-2xs',
        className,
      )}
    >
      <Search
        aria-hidden
        className={twMerge('ml-4 size-4 shrink-0 text-neutral-400 transition group-focus-within:text-neutral-800', iconClassName)}
      />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        aria-label={ariaLabel}
        className="w-full border-0 border-none bg-transparent px-3 py-2 text-sm font-medium text-neutral-800 outline-none ring-0 placeholder:text-neutral-500 focus:border-0 focus:outline-none focus:ring-0 sm:py-2.5"
        {...inputProps}
      />
      {value && (
        <button
          type="button"
          onClick={() => (onClear ? onClear() : onValueChange(''))}
          className="mr-1 grid size-7 shrink-0 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-200/60 hover:text-neutral-700 focus-visible:outline-none"
          aria-label="Xóa từ khóa"
        >
          <X aria-hidden className="size-3.5" />
        </button>
      )}
      <Button
        type="submit"
        variant="primary"
        size="sm"
        className="my-1 mr-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-bold tracking-tight shadow-md sm:px-5"
      >
        {submitIcon && <Search aria-hidden className="size-3.5 text-white" />}
        <span>{submitLabel}</span>
      </Button>
    </form>
  );
});
