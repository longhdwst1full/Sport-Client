import Image from 'next/image';
import { Search } from 'lucide-react';
import type { ProductSuggestionView } from '@/features/catalog';

interface SuggestionItemProps {
  product: ProductSuggestionView;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

export function SuggestionItem({ product, isSelected, onSelect, onHover }: SuggestionItemProps) {
  return (
    <div
      id={`product-search-option-${product.id}`}
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`flex cursor-pointer items-center gap-3.5 rounded-xl px-3.5 py-2.5 transition-colors duration-150 ${
        isSelected
          ? 'bg-neutral-50 text-neutral-900 ring-1 ring-neutral-900/20'
          : 'text-neutral-800 hover:bg-neutral-50'
      }`}
    >
      {/* Product Thumbnail */}
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white p-1">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="48px"
            className="object-contain"
          />
        ) : (
          <div className="grid size-full place-items-center text-neutral-300">
            <Search aria-hidden className="size-4" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="min-w-0 flex-1">
        <h4
          className={`text-xs font-bold leading-snug line-clamp-1 sm:text-[13px] transition ${
            isSelected ? 'text-neutral-900' : 'text-neutral-900'
          }`}
        >
          {product.name}
        </h4>
        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span>{product.categoryLabel}</span>
        </div>
      </div>

      {/* Price on right */}
      <div className="shrink-0 text-right">
        <strong className="block text-xs font-bold text-neutral-950 sm:text-sm">
          {product.priceLabel}
        </strong>
      </div>
    </div>
  );
}
