import Link from 'next/link';
import { ChevronRight, Search, Sparkles } from 'lucide-react';
import type { RefObject } from 'react';
import type { ProductSuggestionView } from '@/features/catalog';
import { SuggestionItem } from './suggestion-item';

const POPULAR_SUGGESTIONS = [
  'Máy chạy bộ',
  'Bộ tạ 24kg',
  'Bàn bóng bàn',
  'Trụ bóng rổ',
  'Găng boxing',
  'Thảm yoga',
];

interface SuggestionPopoverProps {
  query: string;
  isError: boolean;
  isPending: boolean;
  results: ProductSuggestionView[];
  selectedIndex: number;
  inputRef: RefObject<HTMLInputElement | null>;
  onSelectProduct: (slug: string) => void;
  onHoverIndex: (index: number) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onPickPopularTerm: (term: string) => void;
  onPrefillTerm: (term: string) => void;
  onDismissForNav: () => void;
}

export function SuggestionPopover({
  query,
  isError,
  isPending,
  results,
  selectedIndex,
  inputRef,
  onSelectProduct,
  onHoverIndex,
  onSearchSubmit,
  onPickPopularTerm,
  onPrefillTerm,
  onDismissForNav,
}: SuggestionPopoverProps) {
  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-3 shadow-2xl shadow-slate-900/15 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150 ring-1 ring-black/5">
      {!query.trim() ? (
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
            <Sparkles className="size-3.5 text-emerald-600" />
            <span>Từ khóa tìm kiếm phổ biến</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {POPULAR_SUGGESTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onPickPopularTerm(term)}
                className="rounded-full border border-slate-200 bg-slate-50/90 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {term}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <span className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Bộ môn & Thiết bị nổi bật
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/category"
                onClick={onDismissForNav}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 font-bold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 transition"
              >
                <span>🏋️ Dụng cụ Gym</span>
                <ChevronRight className="size-3.5 text-slate-400" />
              </Link>
              <Link
                href="/category"
                onClick={onDismissForNav}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 font-bold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 transition"
              >
                <span>🏃 Máy chạy & Cardio</span>
                <ChevronRight className="size-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      ) : isError ? (
        /* Lỗi HTTP là kết cục cuối cùng, không phải danh sách rỗng: nói rõ để khách
           biết cần thử lại chứ không tưởng cửa hàng không có hàng. */
        <div className="p-6 text-center text-xs">
          <p className="font-bold text-slate-700 sm:text-sm">Không tìm được sản phẩm</p>
          <p className="mt-1 text-[11px] text-slate-400">
            Kết nối đang gặp sự cố. Vui lòng thử lại sau giây lát.
          </p>
        </div>
      ) : isPending && results.length === 0 ? (
        <div className="space-y-1 p-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex items-center gap-3.5 rounded-2xl px-3.5 py-2.5">
              <div className="size-12 shrink-0 animate-pulse rounded-xl bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                <div className="h-2.5 w-1/3 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div>
          {/* Header hint */}
          <div className="flex items-center justify-between rounded-2xl bg-emerald-50/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3 text-emerald-600" />
              GỢI Ý SẢN PHẨM ({results.length})
            </span>
            <span className="text-[10px] font-medium text-slate-400">↑↓ di chuyển • Enter chọn</span>
          </div>

          {/* Đang tìm lại thì giữ kết quả cũ và làm mờ, không nháy về khung xám. */}
          <div
            id="product-search-listbox"
            role="listbox"
            aria-label="Gợi ý sản phẩm"
            className="mt-1 max-h-[360px] space-y-1 overflow-y-auto pr-0.5 scrollbar-thin"
          >
            {results.map((product, index) => (
              <SuggestionItem
                key={product.id}
                product={product}
                isSelected={selectedIndex === index}
                onSelect={() => onSelectProduct(product.slug)}
                onHover={() => onHoverIndex(index)}
              />
            ))}
          </div>

          {/* Footer "Xem tất cả kết quả" action */}
          <div className="mt-1.5 border-t border-slate-100 pt-1.5">
            <button
              type="button"
              onClick={onSearchSubmit}
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
                onClick={() => onPrefillTerm(kw)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
