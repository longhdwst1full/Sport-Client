import Link from 'next/link';
import { Flame, Zap } from 'lucide-react';
import { STORE_POLICY_FACTS, STORE_POLICY_PAGES } from '@/shared/constants';
import { formatFlashEnd, type VariantFlashPrice } from '../model/variant-flash-price';
import { useFlashCountdown } from '../hooks/use-flash-countdown';
import { formatVnd } from '@/shared/format/money';

interface ProductPriceHeaderProps {
  canAdd: boolean;
  outOfStock: boolean;
  /** API xác nhận biến thể đang chọn còn hàng ở ít nhất một kho; `false` khi không biết. */
  inStock: boolean;
  priceLabel: string | undefined;
  /** Giá flash đang mở của biến thể đang chọn; `priceLabel` khi đó đã là giá flash. */
  flash?: VariantFlashPrice;
  /** Số lượng đang chọn vượt số suất còn lại: phần trong suất giá flash, phần dư giá gốc. */
  flashSplit?: { flashQuantity: number; regularQuantity: number; total: number };
  regularPriceLabel?: string;
}

export function ProductPriceHeader({
  canAdd,
  outOfStock,
  inStock,
  priceLabel,
  flash,
  flashSplit,
  regularPriceLabel,
}: ProductPriceHeaderProps) {
  if (flash && canAdd && priceLabel) {
    return (
      <div>
        <FlashPriceBlock flash={flash} priceLabel={priceLabel} />
        {flashSplit && (
          <p role="status" className="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-xs leading-5 text-neutral-800">
            Chỉ còn {flashSplit.flashQuantity} suất giá flash:{' '}
            <span className="font-bold text-brand-700">
              {flashSplit.flashQuantity} × {priceLabel}
            </span>{' '}
            + {flashSplit.regularQuantity} × {regularPriceLabel ?? 'giá gốc'} ={' '}
            <span className="font-bold text-neutral-950">{formatVnd(flashSplit.total)}</span>
          </p>
        )}
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

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Khối giá flash: dải đỏ + đồng hồ đếm ngược, giá flash/giá gạch/% giảm, thanh suất đã bán. */
function FlashPriceBlock({ flash, priceLabel }: { flash: VariantFlashPrice; priceLabel: string }) {
  const countdown = useFlashCountdown(flash.endsAtMs);
  const units = countdown
    ? [
        ...(countdown.days > 0 ? [{ value: countdown.days, label: 'ngày' }] : []),
        { value: countdown.hours, label: 'giờ' },
        { value: countdown.minutes, label: 'phút' },
        { value: countdown.seconds, label: 'giây' },
      ]
    : [];

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-b from-brand-50 to-white">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-brand-600 px-4 py-2.5 text-white">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-bold uppercase tracking-eyebrow">
          <Zap className="size-4 fill-amber-300 text-amber-300" aria-hidden="true" />
          Flash sale
        </span>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs font-semibold text-white/90">Kết thúc sau</span>
          {countdown ? (
            <span
              className="flex items-center gap-1 font-mono text-sm font-bold"
              role="timer"
              aria-label={units.map(({ value, label }) => `${value} ${label}`).join(' ')}
            >
              {units.map(({ value, label }, index) => (
                <span key={label} className="contents">
                  {index > 0 ? <span className="text-white/70" aria-hidden="true">:</span> : null}
                  <span className="grid h-7 min-w-7 place-items-center rounded-md bg-white px-1 text-brand-700" title={label}>
                    {pad(value)}
                  </span>
                </span>
              ))}
            </span>
          ) : (
            <span className="text-xs font-bold">{formatFlashEnd(flash.endsAtMs)}</span>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <strong className="break-words text-3xl font-bold leading-none text-brand-600 sm:text-4xl">{priceLabel}</strong>
          {flash.discountPercent !== null ? (
            <span className="rounded-md bg-brand-600 px-2 py-1 text-sm font-bold leading-none text-white">
              -{flash.discountPercent}%
            </span>
          ) : null}
        </div>
        {flash.originalPriceLabel ? (
          <p className="mt-2 text-sm text-neutral-500">
            Giá thường <span className="text-neutral-400 line-through">{flash.originalPriceLabel}</span>
          </p>
        ) : null}

        <div
          className="relative mt-3 h-5 w-full overflow-hidden rounded-full bg-brand-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={flash.soldPercent}
          aria-label={`Đã bán ${flash.soldPercent}% suất`}
        >
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(flash.soldPercent, 6)}%` }} />
          <span className="absolute inset-0 flex items-center justify-center gap-1 text-2xs font-bold text-neutral-950">
            <Flame className="size-3 text-brand-700" aria-hidden="true" />
            Còn {flash.availableQuantity} suất · Đã bán {flash.soldPercent}%
          </span>
        </div>

        <p className="mt-2 text-xs text-neutral-500">Giá được xác nhận lại ở bước đặt hàng</p>
      </div>
    </div>
  );
}
