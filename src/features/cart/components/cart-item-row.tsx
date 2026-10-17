import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { QuantityStepper } from '@/foundation/components/indicators';
import { formatVnd } from '@/shared/format/money';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';
import type { CartItem } from '../model/cart.slice';
import type { CartLinePrice } from '../model/cart-promo-price';

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDecrementQuantity: () => void;
  onIncrementQuantity: () => void;
  onRemove: () => void;
  /** Đơn giá/thành tiền đã áp luật suất flash (`useCartLinePricing`). */
  linePrice: CartLinePrice;
  /** Đưa số lượng về mức còn hưởng giá flash. */
  onKeepPromoQuantity: (quantity: number) => void;
}

export function CartItemRow({
  item,
  isSelected,
  onToggleSelect,
  onDecrementQuantity,
  onIncrementQuantity,
  onRemove,
  linePrice,
  onKeepPromoQuantity,
}: CartItemRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm sm:gap-5 sm:p-5">
      {/* Selectbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelect}
        className="size-5 shrink-0 cursor-pointer rounded accent-neutral-900 focus-ring"
        aria-label={`Chọn sản phẩm ${item.name}`}
      />

      {/* Image */}
      <Link
        href={`/products/${item.slug ?? item.productId}`}
        className="group/img relative size-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:size-28"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={item.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 80px, 112px"
          className="object-cover transition-transform duration-300 group-hover/img:scale-105"
        />
      </Link>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-3xs font-bold uppercase tracking-wider text-neutral-500">{item.sku}</p>
            <h3 className="mt-1 truncate text-sm font-bold sm:text-base">
              <Link
                href={`/products/${item.slug ?? item.productId}`}
                className="rounded-sm transition hover:text-neutral-900 focus-ring"
              >
                {item.name}
              </Link>
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="shrink-0 rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-700"
            aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
            data-testid="remove-cart-item"
          >
            <Trash2 aria-hidden className="size-4" />
          </Button>
        </div>
        <div className="mt-auto flex items-end justify-between gap-4 pt-3">
          {/* Quantity */}
          <QuantityStepper
            value={item.quantity}
            onDecrement={onDecrementQuantity}
            onIncrement={onIncrementQuantity}
            decrementDisabled={item.quantity <= 1}
            wrapperClassName="flex items-center rounded-xl border border-ink/10"
            decrementClassName="grid size-10 place-items-center text-neutral-500 transition hover:text-ink disabled:opacity-30"
            incrementClassName="grid size-10 place-items-center text-neutral-500 transition hover:text-ink"
            valueClassName="min-w-[2rem] text-center text-sm font-bold"
          />
          {/* Price */}
          <div className="text-right">
            {linePrice.promo === 'applied' && (
              <span className="block text-2xs font-bold uppercase text-brand-600">Giá flash sale</span>
            )}
            <strong className={`text-sm sm:text-base ${linePrice.promo === 'applied' ? 'text-brand-600' : 'text-neutral-950'}`}>
              {formatVnd(linePrice.lineTotal)}
            </strong>
          </div>
        </div>
        {linePrice.promo === 'exceeded' && (
          <div role="status" className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
            {linePrice.promoMaxQuantity
              ? `Giá flash chỉ áp dụng khi mua tối đa ${linePrice.promoMaxQuantity} sản phẩm. Số lượng hiện tại tính giá thường ${formatVnd(linePrice.unitPrice)}/sp.`
              : `Đã hết suất flash sale, sản phẩm tính giá thường ${formatVnd(linePrice.unitPrice)}/sp.`}
            {linePrice.promoMaxQuantity ? (
              <button
                type="button"
                onClick={() => onKeepPromoQuantity(linePrice.promoMaxQuantity!)}
                className="ml-1 font-bold text-amber-950 underline underline-offset-2 focus-ring-tight rounded"
              >
                Giảm về {linePrice.promoMaxQuantity} để giữ giá flash
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
