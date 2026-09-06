'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronRight, Sparkles } from 'lucide-react';
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

const POPULAR_SUGGESTIONS = [
  'Máy chạy bộ',
  'Bộ tạ 24kg',
  'Bàn bóng bàn',
  'Trụ bóng rổ',
  'Găng boxing',
  'Thảm yoga',
];

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
      {/* Search Bar - Modern Rounded Pill Design */}
      <form
        onSubmit={handleSearchSubmit}
        className="group relative flex items-center overflow-hidden rounded-full border border-slate-200/90 bg-slate-50/80 shadow-sm transition-all duration-300 hover:border-emerald-400/60 hover:bg-white focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/15 focus-within:shadow-md"
      >
        <Search className="ml-4 size-4 shrink-0 text-emerald-600 transition group-focus-within:text-emerald-700 group-focus-within:scale-110" />

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
          className="w-full bg-transparent px-3 py-2 text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:py-2.5 sm:text-sm"
          aria-label="Tìm kiếm sản phẩm"
          autoComplete="off"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
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

      {/* Autocomplete Suggestions Popover Dropdown - Curved Rounded-3xl */}
      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl shadow-slate-900/15 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150 ring-1 ring-black/5">
          {results.length > 0 ? (
            <div>
              {/* Header hint */}
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="size-3 text-emerald-600" />
                  GỢI Ý SẢN PHẨM ({results.length})
                </span>
                <span className="text-[10px] font-medium text-slate-400">↑↓ di chuyển • Enter chọn</span>
              </div>

              {/* Scrollable list of suggestions */}
              <div className="mt-1 max-h-[360px] overflow-y-auto pr-0.5 space-y-1 scrollbar-thin">
                {results.map((product, index) => {
                  const isSelected = selectedIndex === index;

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex cursor-pointer items-center gap-3.5 rounded-2xl px-3.5 py-2.5 transition-all duration-200 ${
                        isSelected
                          ? 'bg-emerald-50/90 text-emerald-950 shadow-sm ring-1 ring-emerald-500/20'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <h4
                          className={`text-xs font-bold leading-snug line-clamp-1 sm:text-[13px] transition ${
                            isSelected ? 'text-emerald-700' : 'text-slate-900'
                          }`}
                        >
                          {product.name}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                          <span>{product.category}</span>
                          {product.badge && (
                            <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price on right */}
                      <div className="shrink-0 text-right">
                        <strong className="block text-xs font-black text-emerald-700 sm:text-sm">
                          {vndMoney.format(product.price)}
                        </strong>
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
              <div className="mt-1.5 border-t border-slate-100 pt-1.5">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-slate-200/60 bg-slate-50/80 py-2.5 text-xs font-bold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <span>Xem tất cả kết quả cho "{query.trim()}"</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* No Results Found State with Helpful Suggestions */
            <div className="p-6 text-center text-xs">
              <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <Search className="size-6" />
              </div>
              <p className="font-bold text-slate-700 sm:text-sm">
                Không tìm thấy sản phẩm nào khớp với "{query.trim()}"
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Thử tìm kiếm với các từ khóa phổ biến bên dưới:
              </p>
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5">
                {POPULAR_SUGGESTIONS.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => {
                      setQuery(kw);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
