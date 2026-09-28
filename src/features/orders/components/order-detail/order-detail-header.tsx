import Link from 'next/link';
import { ArrowLeft, ChevronRight, Headphones } from 'lucide-react';

/** Breadcrumb (khách vãng lai không có mục "Đơn hàng của tôi") và lối tắt danh sách đơn / hỗ trợ. */
export function OrderDetailHeader({
  orderNo,
  isAuthenticated,
  onOpenSupport,
}: {
  orderNo: string;
  isAuthenticated: boolean;
  onOpenSupport: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-emerald-700 transition">Trang chủ</Link>
        <ChevronRight className="size-3 text-slate-400" />
        {isAuthenticated ? (
          <>
            <Link href="/orders" className="hover:text-emerald-700 transition">Đơn hàng của tôi</Link>
            <ChevronRight className="size-3 text-slate-400" />
          </>
        ) : null}
        <span className="text-slate-600">Chi tiết đơn hàng</span>
        <ChevronRight className="size-3 text-slate-400" />
        <span className="font-mono font-bold text-slate-900">{orderNo}</span>
      </nav>

      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <ArrowLeft className="size-3.5" /> Danh sách đơn
          </Link>
        )}
        <button
          type="button"
          onClick={onOpenSupport}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
        >
          <Headphones className="size-3.5 text-emerald-600" /> Cần hỗ trợ?
        </button>
      </div>
    </div>
  );
}
