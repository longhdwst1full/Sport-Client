'use client';

import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { resolveInputClassName, type InputSize } from './input-variants';
import { filterOptions, indexOptions, type ComboboxOption } from './combobox-filter';

export interface ComboboxProps {
  id?: string;
  value: string | null;
  options: readonly ComboboxOption[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  /** Hiện khi không có mục nào khớp từ khoá. */
  emptyText?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  size?: InputSize;
  className?: string;
  'aria-describedby'?: string;
  'aria-busy'?: boolean;
}

/**
 * Ô chọn có gõ tìm (ARIA combobox + listbox), thay `<select>` cho danh sách dài như tỉnh/quận/phường.
 * Lọc không dấu và theo chữ viết tắt (`combobox-filter.ts`). Đóng danh sách mà không chọn thì giữ giá trị cũ.
 */
export function Combobox({
  id,
  value,
  options,
  onChange,
  placeholder,
  emptyText = 'Không tìm thấy kết quả',
  disabled,
  required,
  invalid,
  size = 'md',
  className,
  'aria-describedby': describedBy,
  'aria-busy': busy,
}: ComboboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-listbox`;
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const indexed = useMemo(() => indexOptions(options), [options]);
  const matches = useMemo(() => filterOptions(indexed, query), [indexed, query]);
  const selected = options.find((option) => option.value === value);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    const index = matches.findIndex((option) => option.value === value);
    setActiveIndex(index >= 0 ? index : 0);
  };

  const choose = (option: ComboboxOption) => {
    if (option.value !== value) onChange(option.value);
    close();
  };

  const moveActive = (next: number) => {
    if (!matches.length) return;
    const index = (next + matches.length) % matches.length;
    setActiveIndex(index);
    listRef.current?.children[index]?.scrollIntoView({ block: 'nearest' });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) openList();
        else moveActive(activeIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (open) moveActive(activeIndex - 1);
        break;
      case 'Enter':
        if (open && matches[activeIndex]) {
          event.preventDefault();
          choose(matches[activeIndex]);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          close();
        }
        break;
      case 'Tab':
        close();
        break;
    }
  };

  const activeOptionId = open && matches[activeIndex] ? `${inputId}-opt-${activeIndex}` : undefined;

  return (
    <div className="relative">
      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-busy={busy}
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        required={required}
        placeholder={open && selected ? selected.label : placeholder}
        value={open ? query : (selected?.label ?? '')}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          if (!open) setOpen(true);
        }}
        onFocus={(event) => {
          openList();
          // Mobile: đưa ô lên giữa màn hình để danh sách không bị bàn phím/thanh đặt hàng dính đáy che.
          if (window.matchMedia('(max-width: 639px)').matches) {
            event.currentTarget.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }
        }}
        onClick={() => !open && openList()}
        onBlur={close}
        onKeyDown={handleKeyDown}
        className={resolveInputClassName({ size, invalid, className }, 'truncate pr-10')}
      />
      <ChevronDown
        aria-hidden
        className={`pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
      />
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          // Giữ focus ở ô nhập khi bấm chọn, để `onBlur` không đóng danh sách trước `onClick`.
          onMouseDown={(event) => event.preventDefault()}
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-64 overflow-y-auto overscroll-contain rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {matches.length === 0 ? (
            <li className="px-3.5 py-2.5 text-sm text-neutral-500">{emptyText}</li>
          ) : (
            matches.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${inputId}-opt-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => choose(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 text-sm ${
                    index === activeIndex ? 'bg-neutral-100' : ''
                  } ${isSelected ? 'font-semibold text-neutral-950' : 'text-neutral-800'}`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check aria-hidden className="size-4 shrink-0 text-neutral-900" />}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
