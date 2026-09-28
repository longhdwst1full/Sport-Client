import { Search, X } from 'lucide-react';
import type { RefObject } from 'react';
import type { ProductSuggestionView } from '@/features/catalog';

interface SearchInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  onQueryChange: (value: string) => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  placeholder: string;
  isOpen: boolean;
  selectedIndex: number;
  results: ProductSuggestionView[];
}

export function SearchInput({
  inputRef,
  query,
  onQueryChange,
  onFocus,
  onKeyDown,
  onSubmit,
  onClear,
  placeholder,
  isOpen,
  selectedIndex,
  results,
}: SearchInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="group relative flex items-center overflow-hidden rounded-full border border-slate-200/90 bg-slate-50/80 shadow-sm transition-all duration-300 hover:border-emerald-400/60 hover:bg-white focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/15 focus-within:shadow-md"
    >
      <Search className="ml-4 size-4 shrink-0 text-emerald-600 transition group-focus-within:text-emerald-700 group-focus-within:scale-110" />

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="product-search-listbox"
        aria-autocomplete="list"
        aria-activedescendant={
          selectedIndex >= 0 && results[selectedIndex]
            ? `product-search-option-${results[selectedIndex].id}`
            : undefined
        }
        className="w-full bg-transparent px-3 py-2 text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:py-2.5 sm:text-sm"
        aria-label="Tìm kiếm sản phẩm"
        autoComplete="off"
      />

      {/* Clear Button */}
      {query && (
        <button
          type="button"
          onClick={onClear}
          className="mr-1 grid size-6 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700"
          aria-label="Xóa từ khóa"
        >
          <X className="size-3.5" />
        </button>
      )}

      {/* Rounded Pill Submit Button */}
      <button
        type="submit"
        className="my-1 mr-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-sm shadow-emerald-700/20 transition duration-200 hover:from-emerald-500 hover:to-emerald-600 hover:shadow-md hover:shadow-emerald-600/30 active:scale-95 sm:px-5 sm:py-2 sm:text-xs"
        aria-label="Thực hiện tìm kiếm"
      >
        <Search className="size-3.5 text-white" />
        <span className="font-black">TÌM KIẾM</span>
      </button>
    </form>
  );
}
