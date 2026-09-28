'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProductSearch } from '@/features/catalog';
import { useDebounce } from '@/shared/hooks';
import { SearchInput } from './search-input';
import { SuggestionPopover } from './suggestion-popover';

interface AutocompleteSearchProps {
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AutocompleteSearch({
  placeholder = 'Tìm kiếm máy chạy bộ, tạ tay, bóng bàn, bóng rổ...',
  className = '',
  isMobile = false,
  onCloseMobile,
}: AutocompleteSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Gọi Backend theo giá trị đã hoãn: mỗi phím gõ một lượt gọi là quá nhiều cho một lần tìm.
  const debouncedQuery = useDebounce(query, 300);
  // Từ khoá vừa gõ chưa kịp gửi đi thì kết quả đang hiện là của từ khoá cũ. Giữ lại dễ làm
  // khách bấm nhầm sang sản phẩm không liên quan, nên coi như chưa có kết quả.
  const isTypingAhead = query.trim() !== debouncedQuery.trim();
  const { suggestions, isPending: isSearching, isError } = useProductSearch(debouncedQuery);
  const results = isTypingAhead ? [] : suggestions;
  const isPending = isTypingAhead || isSearching;

  // Open popover when user types or on focus
  useEffect(() => {
    if (query.trim().length > 0) {
      setIsOpen(true);
      setSelectedIndex(-1);
    }
  }, [query]);

  // Click outside to dismiss popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        e.preventDefault();
        const chosen = results[selectedIndex];
        handleSelectProduct(chosen.slug);
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (selectedIndex >= 0 && selectedIndex < results.length) {
      handleSelectProduct(results[selectedIndex].slug);
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      if (onCloseMobile) onCloseMobile();
    }
  };

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/products/${slug}`);
    if (onCloseMobile) onCloseMobile();
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handlePickPopularTerm = (term: string) => {
    setQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
  };

  const handlePrefillTerm = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const handleDismissForNav = () => {
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Bar - Modern Rounded Pill Design */}
      <SearchInput
        inputRef={inputRef}
        query={query}
        onQueryChange={setQuery}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        onSubmit={handleSearchSubmit}
        onClear={handleClear}
        placeholder={placeholder}
        isOpen={isOpen}
        selectedIndex={selectedIndex}
        results={results}
      />

      {/* Autocomplete Suggestions Popover Dropdown - Curved Rounded-3xl */}
      {isOpen && (
        <SuggestionPopover
          query={query}
          isError={isError}
          isPending={isPending}
          results={results}
          selectedIndex={selectedIndex}
          inputRef={inputRef}
          onSelectProduct={handleSelectProduct}
          onHoverIndex={setSelectedIndex}
          onSearchSubmit={handleSearchSubmit}
          onPickPopularTerm={handlePickPopularTerm}
          onPrefillTerm={handlePrefillTerm}
          onDismissForNav={handleDismissForNav}
        />
      )}
    </div>
  );
}
