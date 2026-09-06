'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronRight } from 'lucide-react';
import { vndMoney } from '@/shared/format/money';
import {
  searchProducts,
  type SearchableProduct,
} from '@/shared/data/searchable-catalog';

interface AutocompleteSearchProps {
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AutocompleteSearch({
  placeholder = 'Tìm sản phẩm, thương hiệu...',
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

  // Live search results based on user typing
  const results: SearchableProduct[] = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(query, 8);
  }, [query]);

  // Open popover when user types
  useEffect(() => {
    if (query.trim().length > 0) {
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setIsOpen(false);
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

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Bar matching the user's screenshot layout */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex items-stretch overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm transition hover:border-slate-400 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent px-3.5 py-2 text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:px-4 sm:py-2.5 sm:text-sm"
          aria-label="Tìm kiếm sản phẩm"
          autoComplete="off"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center px-2 text-slate-400 hover:text-slate-600 transition"
            aria-label="Xóa từ khóa"
          >
            <X className="size-4" />
          </button>
        )}

        {/* "Q TÌM KIẾM" Button on the right matching user screenshot */}
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1.5 border-l border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 transition hover:bg-slate-200 sm:px-5 sm:py-2.5 sm:text-xs"
          aria-label="Thực hiện tìm kiếm"
        >
          <Search className="size-3.5 sm:size-4 text-slate-700" />
          <span className="font-black text-slate-800">TÌM KIẾM</span>
        </button>
      </form>

      {/* Autocomplete Suggestions Popover Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
          {results.length > 0 ? (
            <div>
              {/* Header hint */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3.5 py-1.5 text-[11px] font-bold text-slate-500">
                <span>GỢI Ý SẢN PHẨM ({results.length})</span>
                <span className="text-[10px] font-normal text-slate-400">↑↓ di chuyển • Enter chọn</span>
              </div>

              {/* Scrollable list of suggestions matching screenshot format */}
              <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                {results.map((product, index) => {
                  const isSelected = selectedIndex === index;

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex cursor-pointer items-center gap-3 px-3.5 py-2.5 transition ${
                        isSelected
                          ? 'bg-emerald-50/80 text-emerald-900'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      {/* Product Thumbnail on the left */}
                      <div className="relative size-10 shrink-0 overflow-hidden rounded border border-slate-200 bg-white p-0.5">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-contain"
                        />
                      </div>

                      {/* Product Name matching screenshot layout */}
                      <div className="min-w-0 flex-1">
                        <h4
                          className={`text-xs sm:text-[13px] font-medium leading-tight truncate ${
                            isSelected ? 'text-emerald-700 font-semibold' : 'text-slate-800'
                          }`}
                        >
                          {product.name}
                        </h4>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{product.category}</span>
                          {product.badge && (
                            <span className="rounded bg-slate-100 px-1 py-0.2 text-[9px] font-bold text-emerald-700">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price on right */}
                      <div className="shrink-0 text-right">
                        <span className="block text-xs font-bold text-red-600 sm:text-slate-900">
                          {vndMoney.format(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="block text-[10px] text-slate-400 line-through">
                            {vndMoney.format(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer "Xem tất cả kết quả" action */}
              <div className="border-t border-slate-100 bg-slate-50 p-2 text-center">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                >
                  <span>Xem tất cả kết quả cho "{query.trim()}"</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* No Results Found State */
            <div className="p-6 text-center text-xs text-slate-500">
              <p className="font-bold text-slate-700">
                Không tìm thấy sản phẩm nào khớp với "{query.trim()}"
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Gợi ý tìm kiếm: "bóng", "vợt", "bàn bóng bàn", "tạ tay", "máy chạy bộ"...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
