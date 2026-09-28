import { CheckCircle2, Phone, ShoppingBag, Zap } from 'lucide-react';
import { QuantityStepper } from '@/foundation/components/indicators';
import { STORE_CONTACT } from '@/shared/constants';

interface PurchaseActionsProps {
  quantity: number;
  onDecrementQuantity: () => void;
  onIncrementQuantity: () => void;
  canAdd: boolean;
  outOfStock: boolean;
  isAddedToast: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
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
          wrapperClassName="flex items-center rounded-full border border-stone-200 bg-stone-50 p-1"
          decrementClassName={`grid size-8 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-stone-200 ${
            quantity <= 1 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
          incrementClassName="grid size-8 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-stone-200"
          valueClassName="w-12 text-center text-sm font-extrabold text-ink"
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
              className="inline-flex items-center gap-1 font-extrabold text-emerald-700 underline-offset-2 hover:underline"
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
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 animate-fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
        </div>
      )}

      {/* CTA Buttons (Add to Cart + Buy Now) */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={!canAdd}
          onClick={onAddToCart}
          className="flex items-center justify-center gap-2 rounded-full border-2 border-slate-900 bg-white px-5 py-3.5 font-bold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag className="size-4" />
          <span>{canAdd ? 'Thêm vào giỏ' : outOfStock ? 'Tạm hết hàng' : 'Liên hệ báo giá'}</span>
        </button>

        <button
          type="button"
          disabled={!canAdd}
          onClick={onBuyNow}
          className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 hover:shadow-emerald-600/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap className="size-4 fill-white" />
          <span>Mua ngay</span>
        </button>
      </div>
    </>
  );
}
