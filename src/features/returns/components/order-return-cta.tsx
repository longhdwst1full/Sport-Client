'use client';

import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { useGetAccountReturnEligibility } from '@/generated/api/returns/returns';
import { formatDate } from '@/shared/format/date-time';
import { RETURN_FIELD_LABELS, returnEligibilityReasonLabels } from '../model/return.constants';

/**
 * Khối "Đổi trả" trong chi tiết đơn của khách đã đăng nhập.
 *
 * D55: khách vãng lai không tự tạo phiếu — hiện hướng dẫn gọi hotline thay vì nút. Đơn chưa giao
 * thì ẩn hẳn khối để trang đơn không thêm một ô vô nghĩa.
 */
export function OrderReturnCta({ orderNo, authenticated }: { orderNo: string; authenticated: boolean }) {
  const eligibility = useGetAccountReturnEligibility(orderNo, { query: { enabled: authenticated, retry: false } });
  if (!authenticated) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
        <h2 className="font-black">Đổi trả</h2>
        <p className="mt-2 text-slate-600">Cần trả hàng? Vui lòng gọi hotline và cung cấp mã đơn, nhân viên sẽ tạo yêu cầu giúp bạn.</p>
      </section>
    );
  }
  const data = eligibility.data;
  if (!data || data.reason === 'ORDER_NOT_RETURNABLE') return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-black">Đổi trả</h2>
      {data.returnDeadline && (
        <p className="mt-2 text-sm text-slate-600">{RETURN_FIELD_LABELS.deadline}: <strong>{formatDate(data.returnDeadline)}</strong></p>
      )}
      {data.eligible ? (
        <Link
          href={`/orders/${encodeURIComponent(orderNo)}/return`}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"
        >
          <RotateCcw className="size-4" /> Yêu cầu trả hàng
        </Link>
      ) : (
        <div className="mt-3 text-sm text-slate-600">
          {data.reason && returnEligibilityReasonLabels[data.reason]}
          {data.openReturnNo && (
            <Link href={`/returns/${encodeURIComponent(data.openReturnNo)}`} className="mt-2 block font-bold text-emerald-700">
              Xem yêu cầu {data.openReturnNo}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
