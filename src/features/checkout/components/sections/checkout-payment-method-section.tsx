import { CreditCard } from 'lucide-react';
import type { CheckoutPaymentMethod } from '@/generated/api/checkout/checkout.schemas';
import { optionClass } from './checkout-section.styles';

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
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-slate-300">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <span className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm shadow-emerald-600/30">
          3
        </span>
        <div>
          <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
            <CreditCard className="size-5 text-emerald-600" /> Phương thức thanh toán
          </h2>
          <p className="text-xs text-slate-500">Lựa chọn hình thức thanh toán thuận tiện nhất</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3.5 sm:grid-cols-2" role="radiogroup" aria-label="Phương thức thanh toán">
        {([
          [
            'COD',
            'Thanh toán khi nhận hàng (COD)',
            'Kiểm tra hàng trước khi nhận, thanh toán tiền mặt cho nhân viên giao hàng.',
            'COD',
          ],
          [
            'VNPAY',
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
              <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 font-extrabold text-[11px] text-emerald-800">
                {badge}
              </span>
            </div>
            <span className="mt-2 block text-xs leading-5 text-slate-500">{description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
