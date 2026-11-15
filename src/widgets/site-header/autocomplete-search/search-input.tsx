import type { RefObject } from 'react';
import type { ProductSuggestionView } from '@/features/catalog';
import { SearchBox } from '@/foundation/components/field-system';

interface SearchInputProps {
  listboxId: string;
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
  listboxId,
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
    <SearchBox
      ref={inputRef}
      value={query}
      onValueChange={onQueryChange}
      onSubmit={onSubmit}
      onClear={onClear}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoComplete="off"
      role="combobox"
      aria-expanded={isOpen}
      aria-controls={isOpen ? listboxId : undefined}
      aria-autocomplete="list"
      aria-activedescendant={
        isOpen && selectedIndex >= 0 && results[selectedIndex]
          ? `${listboxId}-option-${results[selectedIndex].id}`
          : undefined
      }
    />
  );
}
