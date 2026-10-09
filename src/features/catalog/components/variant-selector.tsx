import { Check } from 'lucide-react';
import type { ProductVariantOptionView } from '../model/product.mapper';

interface VariantSelectorProps {
  variants: ProductVariantOptionView[];
  selectedVariantId: string | undefined;
  onSelectVariant: (variantId: string) => void;
}

export function VariantSelector({ variants, selectedVariantId, onSelectVariant }: VariantSelectorProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 id="purchase-heading" className="text-sm font-bold uppercase tracking-wider text-ink">
          Phiên bản / Quy cách
        </h2>
        {/* "có sẵn" từng ngụ ý còn hàng; contract chưa có tồn kho nên chỉ đếm số phiên bản. */}
        <span className="text-xs text-neutral-500">{variants.length} phiên bản</span>
      </div>

      <div className="mt-3 grid gap-2.5">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;

          return (
            <button
              key={variant.id}
              type="button"
              aria-pressed={isSelected}
              className={`relative flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition focus-ring ${
                isSelected
                  ? 'border-neutral-900 bg-neutral-50/50 shadow-sm ring-2 ring-neutral-900/20'
                  : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
              }`}
              onClick={() => onSelectVariant(variant.id)}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`grid size-5 shrink-0 place-items-center rounded-full border transition ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white'
                  }`}
                >
                  {isSelected && <Check aria-hidden className="size-3 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <span className="block break-words font-bold text-ink">{variant.name}</span>
                  <span className="break-all text-xs text-neutral-500">Mã SKU: {variant.sku}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <strong className="block text-sm font-bold text-ink">
                  {variant.priceAmount !== null ? variant.priceLabel : 'Liên hệ'}
                </strong>
                {!variant.sellable && (
                  <span className="text-2xs text-neutral-500">
                    {variant.inStock === false && variant.priceAmount !== null ? 'Tạm hết hàng' : 'Chưa mở bán online'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
