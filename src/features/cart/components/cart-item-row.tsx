import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { QuantityStepper } from '@/foundation/components/indicators';
import { formatVnd } from '@/shared/format/money';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';
import type { CartItem } from '../model/cart.slice';

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDecrementQuantity: () => void;
  onIncrementQuantity: () => void;
  onRemove: () => void;
}

export function CartItemRow({
  item,
  isSelected,
  onToggleSelect,
  onDecrementQuantity,
  onIncrementQuantity,
  onRemove,
}: CartItemRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm sm:gap-5 sm:p-5">
      {/* Selectbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelect}
        className="size-5 shrink-0 cursor-pointer rounded accent-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
        aria-label={`Chọn sản phẩm ${item.name}`}
      />

      {/* Image */}
      <Link
        href={`/products/${item.slug ?? item.productId}`}
        className="group/img relative size-20 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:size-28"
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
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-stone-500">{item.sku}</p>
            <h3 className="mt-1 truncate text-sm font-bold sm:text-base">
              <Link
                href={`/products/${item.slug ?? item.productId}`}
                className="rounded-sm transition hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                {item.name}
              </Link>
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="shrink-0 rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-700"
            aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
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
            decrementClassName="grid size-10 place-items-center text-stone-500 transition hover:text-ink disabled:opacity-30"
            incrementClassName="grid size-10 place-items-center text-stone-500 transition hover:text-ink"
            valueClassName="min-w-[2rem] text-center text-sm font-bold"
          />
          {/* Price */}
          <strong className="text-sm text-brand-600 sm:text-base">{formatVnd(item.price * item.quantity)}</strong>
        </div>
      </div>
    </div>
  );
}
