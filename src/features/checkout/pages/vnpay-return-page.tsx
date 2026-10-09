import Link from 'next/link';
import { CheckCircle2, CircleAlert, XCircle } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import type { VnpayReturnView } from '../model/checkout.mapper';

const PRESENTATION = {
  SUCCESS: {
    icon: CheckCircle2,
    tone: 'border-success-300 bg-success-50 text-success-900',
    iconTone: 'text-success-600',
    title: 'VNPay đã ghi nhận giao dịch',
  },
  FAILED: {
    icon: XCircle,
    tone: 'border-red-300 bg-red-50 text-red-900',
    iconTone: 'text-red-600',
    title: 'Giao dịch chưa thành công',
  },
  INVALID: {
    icon: CircleAlert,
    tone: 'border-amber-300 bg-amber-50 text-amber-900',
    iconTone: 'text-amber-600',
    title: 'Không xác minh được kết quả',
  },
} as const;

export function VnpayReturnPage({ result }: { result: VnpayReturnView }) {
  const presentation = PRESENTATION[result.displayStatus];
  const Icon = presentation.icon;

  return (
      <div className="bg-neutral-50/60 pb-20 pt-10">
        <main className="mx-auto max-w-2xl px-4 sm:px-6">
          <section role="status" className={`rounded-3xl border p-5 shadow-sm sm:p-8 ${presentation.tone}`}>
            <Icon aria-hidden className={`size-12 ${presentation.iconTone}`} />
            <h1 className="mt-4 text-2xl font-bold">{presentation.title}</h1>
            <p className="mt-3 text-sm leading-6">{result.message}</p>

            {result.paymentRef && (
              <p className="mt-4 break-all text-xs font-semibold opacity-80">
                Mã thanh toán: {result.paymentRef}
              </p>
            )}
          </section>

          {/*
            Trang này chỉ đọc kết quả VNPay gửi kèm khi trình duyệt quay về.
            Trạng thái thật của đơn do IPN quyết định, nên luôn hướng khách về
            trang đơn hàng thay vì để họ tin vào màn hình này.
          */}
          <p className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-600">
            Trạng thái cuối cùng của đơn được cập nhật khi hệ thống nhận xác nhận trực tiếp từ
            VNPay. Mở trang đơn hàng để xem tình trạng chính thức.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/orders"
              className={buttonVariants({ variant: 'primary', className: 'rounded-full px-6 font-bold' })}
            >
              Xem đơn hàng của tôi
            </Link>
            <Link
              href="/"
              className={buttonVariants({ variant: 'ghost', className: 'rounded-full bg-neutral-100 px-6 font-bold text-neutral-800 hover:bg-neutral-200' })}
            >
              Về trang chủ
            </Link>
          </div>
        </main>
      </div>
  );
}
