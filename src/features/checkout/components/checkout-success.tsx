import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import type { CreateCheckoutQuoteDtoPaymentMethod, ReservationDto } from '@/generated/api/checkout/models';

interface CheckoutSuccessProps {
  reservation: ReservationDto;
  paymentMethod: CreateCheckoutQuoteDtoPaymentMethod;
}

export function CheckoutSuccess({ reservation, paymentMethod }: CheckoutSuccessProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <section className="rounded-[32px] border border-emerald-200 bg-white p-7 text-center shadow-xl sm:p-12">
        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="size-11" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-slate-950">Đã xác nhận và giữ hàng</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          Mã giữ hàng <strong className="font-mono text-emerald-700">{reservation.id}</strong>. Hàng được giữ đến{' '}
          <strong>{new Date(reservation.expiresAt).toLocaleString('vi-VN')}</strong>.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {paymentMethod === 'COD'
            ? 'Bạn thanh toán đủ một lần khi nhận hàng. Doanh thu chỉ ghi nhận sau khi giao hoàn tất.'
            : 'Đơn đang chờ bước tạo chỉ dẫn chuyển khoản và xác nhận tiền ở module thanh toán.'}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Tiếp tục mua sắm</Link>
          <Link href="/profile" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Tài khoản của tôi</Link>
        </div>
      </section>
    </main>
  );
}
