import { CreditCard } from 'lucide-react';
import { CheckoutPaymentMethod } from '@/generated/api/checkout/checkout.schemas';
import { CheckoutStepSection, optionClass } from './checkout-step-section';

/** Bước 3: COD hoặc VNPay. Đổi phương thức không báo giá lại: phí không phụ thuộc thanh toán, lựa chọn đi kèm bước xác nhận. */
export function CheckoutPaymentMethodSection({
  paymentMethod,
  setPaymentMethod,
  onSelectionChange,
}: {
  paymentMethod: CheckoutPaymentMethod;
  setPaymentMethod: (value: CheckoutPaymentMethod) => void;
  /** Gọi sau khi khách đổi phương thức; không báo giá lại trừ khi trang quyết định (xem checkout-page). */
  onSelectionChange?: () => void;
}) {
  return (
    <CheckoutStepSection step={3} icon={CreditCard} title="Phương thức thanh toán" description="Lựa chọn hình thức thanh toán thuận tiện nhất">
      <div className="mt-5 grid gap-3.5 sm:grid-cols-2" role="radiogroup" aria-label="Phương thức thanh toán">
        {([
          [
            CheckoutPaymentMethod.COD,
            'Thanh toán khi nhận hàng (COD)',
            'Kiểm tra hàng trước khi nhận, thanh toán tiền mặt cho nhân viên giao hàng.',
            'COD',
          ],
          [
            CheckoutPaymentMethod.VNPAY,
            'Chuyển khoản VietQR / VNPay',
            'Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử VNPay, hoàn tất tức thì.',
            'QR',
          ],
        ] as const).map(([value, label, description, badge]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={paymentMethod === value}
            onClick={() => { if (paymentMethod === value) return; setPaymentMethod(value); onSelectionChange?.(); }}
            className={optionClass(paymentMethod === value)}
          >
            <div className="flex items-center justify-between gap-2">
              <strong className="text-sm font-bold text-neutral-900">{label}</strong>
              <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-lg bg-neutral-100 font-extrabold text-2xs text-neutral-950">
                {badge}
              </span>
            </div>
            <span className="mt-2 block text-xs leading-5 text-neutral-500">{description}</span>
          </button>
        ))}
      </div>
    </CheckoutStepSection>
  );
}
