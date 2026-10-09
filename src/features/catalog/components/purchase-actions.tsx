import type { Ref } from 'react';
import { CheckCircle2, Phone, ShoppingBag, Zap } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { QuantityStepper } from '@/foundation/components/indicators';
import { STORE_CONTACT } from '@/shared/constants';

/** Viền đen đậm cho nút "Thêm vào giỏ" (khối mua chính + thanh dính đáy) thay cho viền xám của `outline`. */
const PRIMARY_OUTLINE_CTA = 'font-bold';

interface PurchaseActionsProps {
  quantity: number;
  onDecrementQuantity: () => void;
  onIncrementQuantity: () => void;
  canAdd: boolean;
  outOfStock: boolean;
  isAddedToast: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  /** Mốc của nhóm nút chính; thanh mua dính đáy (mobile) chỉ hiện khi mốc này ra khỏi màn hình. */
  ctaRef?: Ref<HTMLDivElement>;
}

export function PurchaseActions({
  quantity,
  onDecrementQuantity,
  onIncrementQuantity,
  canAdd,
  outOfStock,
  isAddedToast,
  onAddToCart,
  onBuyNow,
  ctaRef,
}: PurchaseActionsProps) {
  return (
    <>
      {/* Quantity Selector */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-ink">Số lượng:</span>
        <QuantityStepper
          value={quantity}
          onDecrement={onDecrementQuantity}
          onIncrement={onIncrementQuantity}
          wrapperClassName="flex items-center rounded-full border border-neutral-200 bg-neutral-50 p-1"
          decrementClassName={`grid size-10 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-neutral-200 ${
            quantity <= 1 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
          incrementClassName="grid size-10 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-neutral-200"
          valueClassName="w-12 text-center text-sm font-semibold text-ink"
        />
      </div>

      {/* Không hiển thị quà tặng hay "trả góp từ ~x đ/tháng": contract chưa có khuyến mãi quà tặng
          hay gói trả góp theo sản phẩm, bản trước viết cứng quà và trị giá cho mọi sản phẩm. */}
      {!canAdd && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900" role="status">
          <p className="font-bold">
            {outOfStock ? 'Phiên bản này đang tạm hết hàng.' : 'Phiên bản này chưa có giá bán online.'}
          </p>
          <p className="mt-1">
            Gọi{' '}
            <a
              href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
              className="inline-flex items-center gap-1 rounded font-semibold text-neutral-900 underline-offset-2 hover:underline focus-ring"
            >
              <Phone className="size-3" aria-hidden="true" />
              {STORE_CONTACT.primaryHotline}
            </a>{' '}
            {outOfStock ? 'để hỏi thời gian có hàng.' : 'để được báo giá.'}
          </p>
        </div>
      )}

      {/* Toast Feedback */}
      {isAddedToast && (
        <div className="flex items-center gap-2 rounded-2xl bg-success-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-success-700/30 animate-fade-in" role="status">
          <CheckCircle2 aria-hidden className="size-4 shrink-0" />
          <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
        </div>
      )}

      {/* CTA Buttons (Add to Cart + Buy Now) */}
      <div ref={ctaRef} className="grid gap-3 sm:grid-cols-2">
        <Button
          variant="outline"
          size="lg"
          disabled={!canAdd}
          onClick={onAddToCart}
          className={PRIMARY_OUTLINE_CTA}
        >
          <ShoppingBag aria-hidden className="size-4" />
          <span>{canAdd ? 'Thêm vào giỏ' : outOfStock ? 'Tạm hết hàng' : 'Liên hệ báo giá'}</span>
        </Button>

        <Button
          variant="cta"
          size="lg"
          disabled={!canAdd}
          onClick={onBuyNow}
          className="font-bold"
        >
          <Zap aria-hidden className="size-4 fill-current" />
          <span>Mua ngay</span>
        </Button>
      </div>
    </>
  );
}

interface StickyBuyBarProps {
  visible: boolean;
  priceLabel: string;
  canAdd: boolean;
  outOfStock: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

/**
 * Thanh mua dính đáy cho mobile; dùng lại đúng handler của khối mua chính (không có logic giỏ riêng).
 * `data-sticky-buy-bar` là mốc để widget nút liên hệ nổi tự ẩn trên PDP mobile, đừng đổi tên.
 * Ẩn bằng `hidden` thay vì gỡ khỏi DOM để không đổi chiều cao trang khi cuộn.
 */
export function StickyBuyBar({ visible, priceLabel, canAdd, outOfStock, onAddToCart, onBuyNow }: StickyBuyBarProps) {
  return (
    <div
      data-sticky-buy-bar
      hidden={!visible}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <strong className="min-w-0 flex-1 truncate text-base font-bold text-neutral-950">
          {canAdd || outOfStock ? priceLabel : 'Liên hệ báo giá'}
        </strong>
        <Button
          variant="outline"
          disabled={!canAdd}
          onClick={onAddToCart}
          className={`${PRIMARY_OUTLINE_CTA} gap-1.5 border px-3 text-xs`}
        >
          <ShoppingBag aria-hidden className="size-4" />
          <span>{canAdd ? 'Thêm vào giỏ' : outOfStock ? 'Tạm hết hàng' : 'Liên hệ'}</span>
        </Button>
        <Button variant="cta" disabled={!canAdd} onClick={onBuyNow} className="gap-1.5 text-xs font-bold">
          <Zap aria-hidden className="size-4 fill-current" />
          <span>Mua ngay</span>
        </Button>
      </div>
    </div>
  );
}
