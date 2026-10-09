import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import type { OrderDetailView } from '@/features/orders';
import { buttonVariants } from '@/foundation/components/buttons';
import { DescriptionList } from '@/foundation/components/structure';

interface CheckoutSuccessProps {
  order: OrderDetailView;
}

export function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      <section className="rounded-4xl border border-success-200 bg-white p-5 text-center shadow-xl sm:p-12">
        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-success-100 text-success-700">
          <CheckCircle2 aria-hidden className="size-11" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-neutral-950">Đặt hàng thành công</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-600">
          Mã đơn <strong className="break-all font-mono text-neutral-950">{order.orderNo}</strong> đã được tiếp nhận tại{' '}
          <strong>{order.branchName}</strong>.
        </p>
        <DescriptionList
          columns={2}
          className="mx-auto mt-5 max-w-lg grid-cols-1 gap-3 rounded-2xl bg-neutral-50 p-4 text-left text-sm sm:grid-cols-2"
          labelClassName="text-xs"
          valueClassName="font-bold"
          items={[
            { label: 'Tổng thanh toán', value: order.grandTotalLabel },
            { label: 'Trạng thái', value: order.statusLabel },
            { label: 'Thanh toán', value: order.paymentMethodLabel },
          ]}
        />
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants({ variant: 'primary', className: 'px-5 font-bold' })}>
            Tiếp tục mua sắm
          </Link>
          <Link
            href={`/orders/${order.orderNo}`}
            className={buttonVariants({ variant: 'outline', className: 'px-5 font-bold' })}
          >
            Xem đơn hàng
          </Link>
        </div>
      </section>
    </main>
  );
}
