import { Search, X } from 'lucide-react';
import type { RefObject } from 'react';
import type { ProductSuggestionView } from '@/features/catalog';
import { Button } from '@/foundation/components/buttons';
import { TextInput } from '@/foundation/components/field-system';

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
      className="group relative flex items-center overflow-hidden rounded-full border border-slate-300 bg-slate-50/80 hover:border-slate-400 hover:bg-white transition-all duration-200 focus-within:border-brand-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-500/15 shadow-2xs"
    >
      <Search aria-hidden className="ml-4 size-4 shrink-0 text-slate-400 transition group-focus-within:text-brand-600" />

      <TextInput
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
        className="w-full bg-transparent px-3 py-2 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-500 sm:py-2.5"
        aria-label="Tìm kiếm sản phẩm"
        autoComplete="off"
      />

      {/* Clear Button */}
      {query && (
        <Button
          onClick={onClear}
          className="mr-1 grid size-6 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Xóa từ khóa"
        >
          <X aria-hidden className="size-3.5" />
        </Button>
      )}

      {/* Rounded Pill Submit Button */}
      <Button
        type="submit"
        className="my-1 mr-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-sm shadow-brand-600/25 transition-all duration-200 hover:from-brand-500 hover:to-brand-600 hover:shadow-md hover:shadow-brand-600/35 hover:-translate-y-0.5 active:scale-95 border-t border-white/20 sm:px-5 sm:py-2"
      >
        <Search aria-hidden className="size-3.5 text-white" />
        <span>Tìm kiếm</span>
      </Button>
    </form>
  );
}
