import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import type { OrderDetailDto } from '@/generated/api/orders/models';
import { vndMoney } from '@/shared/format/money';

interface CheckoutSuccessProps {
  order: OrderDetailDto;
}

export function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <section className="rounded-[32px] border border-emerald-200 bg-white p-7 text-center shadow-xl sm:p-12">
        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="size-11" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-slate-950">Đặt hàng thành công</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          Mã đơn <strong className="font-mono text-emerald-700">{order.orderNo}</strong> đã được tiếp nhận tại{' '}
          <strong>{order.branchName}</strong>.
        </p>
        <div className="mx-auto mt-5 grid max-w-lg gap-3 rounded-2xl bg-slate-50 p-4 text-left text-sm sm:grid-cols-2">
          <div><span className="block text-xs text-slate-500">Tổng thanh toán</span><strong>{vndMoney.format(Number(order.grandTotal))}</strong></div>
          <div><span className="block text-xs text-slate-500">Trạng thái</span><strong>Chờ cửa hàng xác nhận</strong></div>
          <div className="sm:col-span-2"><span className="block text-xs text-slate-500">Thanh toán</span><strong>{order.paymentMethod === 'COD' ? 'Thanh toán đủ một lần khi nhận hàng' : 'Chuyển khoản đủ một lần; cửa hàng xác nhận khi tiền thực nhận'}</strong></div>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Tiếp tục mua sắm</Link>
          <Link href="/profile" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Tài khoản của tôi</Link>
        </div>
      </section>
    </main>
  );
}
