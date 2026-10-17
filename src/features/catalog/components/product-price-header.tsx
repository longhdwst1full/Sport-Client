import Link from 'next/link';
import { Zap } from 'lucide-react';
import { STORE_POLICY_FACTS, STORE_POLICY_PAGES } from '@/shared/constants';
import { formatFlashEnd, type VariantFlashPrice } from '../model/variant-flash-price';

interface ProductPriceHeaderProps {
  canAdd: boolean;
  outOfStock: boolean;
  /** API xác nhận biến thể đang chọn còn hàng ở ít nhất một kho; `false` khi không biết. */
  inStock: boolean;
  priceLabel: string | undefined;
  /** Giá flash đang mở của biến thể đang chọn; `priceLabel` khi đó đã là giá flash. */
  flash?: VariantFlashPrice;
}

export function ProductPriceHeader({ canAdd, outOfStock, inStock, priceLabel, flash }: ProductPriceHeaderProps) {
  if (flash && canAdd && priceLabel) {
    return (
      <div>
        <div className="overflow-hidden rounded-2xl border border-brand-200 bg-brand-50">
          <div className="flex items-center justify-between gap-2 bg-brand-600 px-4 py-2 text-white">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-eyebrow">
              <Zap className="size-4 fill-amber-300 text-amber-300" aria-hidden="true" />
              Flash sale
            </span>
            <span className="text-xs font-semibold text-white/90">Kết thúc {formatFlashEnd(flash.endsAtMs)}</span>
          </div>
          <div className="px-4 py-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <strong className="break-words text-2xl font-bold text-brand-600 min-[400px]:text-3xl sm:text-4xl">
                {priceLabel}
              </strong>
              {flash.originalPriceLabel ? (
                <span className="text-base text-neutral-400 line-through">{flash.originalPriceLabel}</span>
              ) : null}
              {flash.discountPercent !== null ? (
                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
                  -{flash.discountPercent}%
                </span>
              ) : null}
            </div>
            <p className="mt-1.5 text-xs font-semibold text-neutral-600">
              Còn {flash.availableQuantity} suất
              {flash.perCustomerLimit !== null ? ` · Tối đa ${flash.perCustomerLimit} sản phẩm/khách` : ''} · Giá được
              xác nhận lại ở bước đặt hàng
            </p>
          </div>
        </div>
        <ProductAvailability inStock={inStock} outOfStock={outOfStock} />
      </div>
    );
  }

  return (
    <div>
      {/* Ngoài flash sale không hiển thị giá gạch hay "Tiết kiệm x%": contract chưa có giá gốc theo biến
          thể, bản trước tự nhân giá bán ×1,25 để dựng ra mức giảm không có thật. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="min-w-0">
          <span className="eyebrow text-neutral-500">
            {canAdd || outOfStock ? 'Giá bán niêm yết' : 'Giá bán'}
          </span>
          <strong className="mt-1 block break-words text-2xl font-bold text-neutral-950 min-[400px]:text-3xl sm:text-4xl">
            {(canAdd || outOfStock) && priceLabel ? priceLabel : 'Liên hệ báo giá'}
          </strong>
          {outOfStock && (
            <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
              Tạm hết hàng
            </span>
          )}
        </div>
      </div>

      <ProductAvailability inStock={inStock} outOfStock={outOfStock} />
    </div>
  );
}

function ProductAvailability({ inStock, outOfStock }: { inStock: boolean; outOfStock: boolean }) {
  return (
    <>
      {/* "Còn hàng" chỉ hiện khi API trả `inStock: true` cho biến thể đang chọn; không có số lượng tồn. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-neutral-600">
        {inStock && !outOfStock && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 font-bold text-success-800">
            <span aria-hidden className="size-1.5 rounded-full bg-success-600" />
            Còn hàng
          </span>
        )}
        {/* GAP: chưa có bộ ước tính theo tỉnh trên trang sản phẩm (`estimateCheckoutShipping` đã có, chưa
            nối); phí và thời gian thật được báo theo địa chỉ ở bước đặt hàng. */}
        <span>
          {STORE_POLICY_FACTS.shippingSummary}. Phí & thời gian giao báo theo địa chỉ ở bước đặt hàng ·{' '}
          <Link href={STORE_POLICY_PAGES.SHIPPING.href} className="text-link">Chính sách giao hàng</Link>
        </span>
      </div>
    </>
  );
}
