import { CreditCard } from 'lucide-react';
import { CheckoutPaymentMethod } from '@/generated/api/checkout/checkout.schemas';
import { optionClass } from './checkout-section.styles';
import { CheckoutStepSection } from './checkout-step-section';

/** Bước 3: COD hoặc VNPay; đổi phương thức phải bỏ báo giá cũ để báo giá lại theo phương thức mới. */
export function CheckoutPaymentMethodSection({
  paymentMethod,
  setPaymentMethod,
  invalidateQuote,
}: {
  paymentMethod: CheckoutPaymentMethod;
  setPaymentMethod: (value: CheckoutPaymentMethod) => void;
  invalidateQuote: () => void;
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
            onClick={() => { if (paymentMethod === value) return; setPaymentMethod(value); invalidateQuote(); }}
            className={optionClass(paymentMethod === value)}
          >
            <div className="flex items-center justify-between gap-2">
              <strong className="text-sm font-bold text-slate-900">{label}</strong>
              <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-100 font-extrabold text-[11px] text-brand-800">
                {badge}
              </span>
            </div>
            <span className="mt-2 block text-xs leading-5 text-slate-500">{description}</span>
          </button>
        ))}
      </div>
    </CheckoutStepSection>
  );
}
