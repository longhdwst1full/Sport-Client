import Link from 'next/link';
import { CheckCircle2, CircleAlert, XCircle } from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import type { VnpayReturnDto } from '@/generated/api/payments/models';

const PRESENTATION = {
  SUCCESS: {
    icon: CheckCircle2,
    tone: 'border-emerald-300 bg-emerald-50 text-emerald-900',
    iconTone: 'text-emerald-600',
    title: 'VNPay đã ghi nhận giao dịch',
  },
  FAILED: {
    icon: XCircle,
    tone: 'border-rose-300 bg-rose-50 text-rose-900',
    iconTone: 'text-rose-600',
    title: 'Giao dịch chưa thành công',
  },
  INVALID: {
    icon: CircleAlert,
    tone: 'border-amber-300 bg-amber-50 text-amber-900',
    iconTone: 'text-amber-600',
    title: 'Không xác minh được kết quả',
  },
} as const;

export function VnpayReturnPage({ result }: { result: VnpayReturnDto }) {
  const presentation = PRESENTATION[result.displayStatus];
  const Icon = presentation.icon;

  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-10">
        <main className="mx-auto max-w-2xl px-4 sm:px-6">
          <section className={`rounded-3xl border p-8 shadow-sm ${presentation.tone}`}>
            <Icon className={`size-12 ${presentation.iconTone}`} />
            <h1 className="mt-4 text-2xl font-black">{presentation.title}</h1>
            <p className="mt-3 text-sm leading-6">{result.message}</p>

            {result.paymentRef && (
              <p className="mt-4 text-xs font-semibold opacity-70">
                Mã thanh toán: {result.paymentRef}
              </p>
            )}
          </section>

          {/*
            Trang này chỉ đọc kết quả VNPay gửi kèm khi trình duyệt quay về.
            Trạng thái thật của đơn do IPN quyết định, nên luôn hướng khách về
            trang đơn hàng thay vì để họ tin vào màn hình này.
          */}
          <p className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
            Trạng thái cuối cùng của đơn được cập nhật khi hệ thống nhận xác nhận trực tiếp từ
            VNPay. Mở trang đơn hàng để xem tình trạng chính thức.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/orders"
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
            >
              Xem đơn hàng của tôi
            </Link>
            <Link
              href="/"
              className="rounded-full bg-slate-100 px-6 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-200"
            >
              Về trang chủ
            </Link>
          </div>
        </main>
      </div>
    </StorefrontLayout>
  );
}
