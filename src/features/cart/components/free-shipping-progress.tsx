import { Truck } from 'lucide-react';
import { freeShippingProgress } from '../model/free-shipping';
import { formatVnd } from '@/shared/format/money';

interface FreeShippingProgressProps {
  /** Tạm tính tiền hàng (giá hiển thị, gồm giá flash), chưa gồm phí giao. */
  subtotal: number;
  /** `SHIPPING_FREE_ORDER_MIN_AMOUNT`; 0 = tắt thì không hiển thị gì. */
  threshold: number;
  className?: string;
}

/** Nhắc ngưỡng miễn phí giao ở giỏ hàng và checkout; không quyết định phí (báo giá Backend quyết định). */
export function FreeShippingProgress({ subtotal, threshold, className = '' }: FreeShippingProgressProps) {
  const progress = freeShippingProgress(subtotal, threshold);
  if (!progress.enabled) return null;
  return (
    <div className={`rounded-xl bg-neutral-50 p-3 text-xs leading-5 ${className}`} aria-live="polite">
      <p className="flex items-center gap-1.5 font-semibold text-neutral-700">
        <Truck aria-hidden className="size-4 shrink-0 text-neutral-500" />
        Miễn phí giao hàng cho đơn từ {formatVnd(progress.threshold)}
      </p>
      <div
        role="progressbar"
        aria-label="Tiến độ miễn phí giao hàng"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className={`h-full rounded-full ${progress.reached ? 'bg-success-600' : 'bg-brand-600'}`}
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <p className={`mt-1.5 font-semibold ${progress.reached ? 'text-success-700' : 'text-neutral-600'}`}>
        {progress.reached
          ? 'Đơn của bạn được miễn phí giao hàng'
          : `Mua thêm ${formatVnd(progress.remaining)} để được miễn phí giao hàng`}
      </p>
    </div>
  );
}
