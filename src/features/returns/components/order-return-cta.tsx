'use client';

import Link from 'next/link';
import { PhoneCall, RotateCcw, ShieldCheck } from 'lucide-react';
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
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <RotateCcw className="size-4" />
          </div>
          <h2 className="text-sm font-black text-slate-900">Đổi trả & Bảo hành</h2>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          Chính sách đổi trả trong 7 ngày cho sản phẩm có lỗi từ nhà sản xuất. Khách vãng lai vui lòng liên hệ hotline để nhân viên hỗ trợ tạo phiếu.
        </p>
        <a
          href="tel:0939987456"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
        >
          <PhoneCall className="size-3.5 text-emerald-600" /> Hotline đổi trả: 0939 987 456
        </a>
      </section>
    );
  }
  const data = eligibility.data;
  if (!data || data.reason === 'ORDER_NOT_RETURNABLE') return null;

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-center gap-2.5">
        <div className="grid size-8 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
          <RotateCcw className="size-4" />
        </div>
        <h2 className="text-sm font-black text-slate-900">Chính sách đổi trả</h2>
      </div>
      {data.returnDeadline && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
          <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
          <span>{RETURN_FIELD_LABELS.deadline}: <strong className="text-slate-900">{formatDate(data.returnDeadline)}</strong></span>
        </div>
      )}
      {data.eligible ? (
        <Link
          href={`/orders/${encodeURIComponent(orderNo)}/return`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <RotateCcw className="size-3.5" /> Tạo yêu cầu đổi trả
        </Link>
      ) : (
        <div className="mt-3 text-xs leading-relaxed text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100">
          {data.reason && returnEligibilityReasonLabels[data.reason]}
          {data.openReturnNo && (
            <Link
              href={`/returns/${encodeURIComponent(data.openReturnNo)}`}
              className="mt-2 inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
            >
              Xem chi tiết yêu cầu {data.openReturnNo} →
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
